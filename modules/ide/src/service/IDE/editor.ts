import type { CursorPosition, Edit, Language, SupportedFiles } from "./type";

export function countLines(input: string) {
  let lines = 1;
  for (let i = 0; i < input.length; i++) if (input[i] === "\n") lines++;
  return lines;
}

export function getCursorPosition(
  value: string,
  start: number,
  end: number,
  caret: number,
): CursorPosition {
  const lineStart = value.lastIndexOf("\n", caret - 1) + 1;
  let line = 1;
  for (let i = 0; i < lineStart; i++) if (value[i] === "\n") line++;
  return { ln: line, col: caret - lineStart + 1, selected: end - start };
}

function lineStartOf(value: string, offset: number) {
  return value.lastIndexOf("\n", offset - 1) + 1;
}

function lineEndOf(value: string, offset: number) {
  const end = value.indexOf("\n", offset);
  return end === -1 ? value.length : end;
}

function selectedBlock(value: string, start: number, end: number) {
  const lastOffset = end > start && value[end - 1] === "\n" ? end - 1 : end;
  const from = lineStartOf(value, start);
  const to = lineEndOf(value, lastOffset);
  return { from, to, lines: value.slice(from, to).split("\n") };
}

function rewriteBlock(
  value: string,
  start: number,
  end: number,
  rewrite: (lines: string[]) => { lines: string[]; caretShift: number },
): Edit | null {
  const { from, to, lines } = selectedBlock(value, start, end);
  const result = rewrite(lines);
  const text = result.lines.join("\n");
  if (text === value.slice(from, to)) return null;

  if (start === end) {
    const caret = Math.max(from, start + result.caretShift);
    return {
      start: from,
      end: to,
      text,
      selectionStart: caret,
      selectionEnd: caret,
    };
  }
  return {
    start: from,
    end: to,
    text,
    selectionStart: from,
    selectionEnd: from + text.length,
  };
}

export function indent(
  value: string,
  start: number,
  end: number,
  tabSize: number = 2,
): Edit | null {
  if (value.slice(start, end).includes("\n")) {
    return rewriteBlock(value, start, end, (lines) => ({
      lines: lines.map((l) => (l.length ? " ".repeat(tabSize) + l : l)),
      caretShift: tabSize,
    }));
  }
  const column = start - lineStartOf(value, start);
  const spaces = " ".repeat(tabSize - (column % tabSize));
  const caret = start + spaces.length;
  return {
    start,
    end,
    text: spaces,
    selectionStart: caret,
    selectionEnd: caret,
  };
}

const leadingWhitespace = (line: string) => line.match(/^[ \t]*/)![0];

export function outdent(
  value: string,
  start: number,
  end: number,
  tabSize = 2,
): Edit | null {
  return rewriteBlock(value, start, end, (lines) => {
    const removed = lines.map((l) => {
      const ws = leadingWhitespace(l);
      return ws.startsWith("\t") ? 1 : Math.min(tabSize, ws.length);
    });
    return {
      lines: lines.map((l, i) => l.slice(removed[i])),
      caretShift: -removed[0],
    };
  });
}

const closers: Record<string, string> = { "{": "}", "[": "]", "(": ")" };

export function newline(
  value: string,
  start: number,
  end: number,
  tabSize = 2,
): Edit {
  const lineStart = lineStartOf(value, start);
  const indentation = leadingWhitespace(value.slice(lineStart, start));
  const before = value[start - 1];
  const after = value[end];
  const opener = before ? closers[before] : undefined;
  const step = " ".repeat(tabSize);

  if (opener && after === opener) {
    // `{|}` → put the caret on an indented line between the brackets.
    const text = `\n${indentation}${step}\n${indentation}`;
    const caret = start + 1 + indentation.length + step.length;
    return { start, end, text, selectionStart: caret, selectionEnd: caret };
  }

  const text = `\n${indentation}${opener ? step : ""}`;
  const caret = start + text.length;
  return { start, end, text, selectionStart: caret, selectionEnd: caret };
}

export function toggleLineComment(
  value: string,
  start: number,
  end: number,
  token: string,
): Edit | null {
  return rewriteBlock(value, start, end, (lines) => {
    const filled = lines.filter((l) => l.trim().length);
    if (!filled.length) return { lines, caretShift: 0 };

    const commented = filled.every((l) => l.trimStart().startsWith(token));
    if (commented) {
      let firstShift = 0;
      const next = lines.map((l, i) => {
        const ws = leadingWhitespace(l);
        const rest = l.slice(ws.length);
        if (!rest.startsWith(token)) return l;
        const cut = token.length + (rest[token.length] === " " ? 1 : 0);
        if (i === 0) firstShift = -cut;
        return ws + rest.slice(cut);
      });
      return { lines: next, caretShift: firstShift };
    }

    const column = Math.min(...filled.map((l) => leadingWhitespace(l).length));
    const marker = `${token} `;
    return {
      lines: lines.map((l) =>
        l.trim().length ? l.slice(0, column) + marker + l.slice(column) : l,
      ),
      caretShift: lines[0].trim().length ? marker.length : 0,
    };
  });
}

export function applyEdit(el: HTMLTextAreaElement, edit: Edit) {
  el.setSelectionRange(edit.start, edit.end);
  if (!document.execCommand("insertText", false, edit.text)) {
    el.setRangeText(edit.text, edit.start, edit.end);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }
  el.setSelectionRange(edit.selectionStart, edit.selectionEnd);
}

export const languages: Language[] = [
  { value: "tsx", label: "TypeScript JSX", comment: "//" },
  { value: "ts", label: "TypeScript", comment: "//" },
  { value: "js", label: "JavaScript", comment: "//" },
  { value: "json", label: "JSON", comment: null },
  { value: "css", label: "CSS", comment: null },
  { value: "html", label: "HTML", comment: null },
  { value: "md", label: "Markdown", comment: null },
  { value: "txt", label: "Plain Text", comment: null },
];

export function getLanguage(id: SupportedFiles): Language {
  return (
    languages.find((l) => l.value === id) ?? languages[languages.length - 1]
  );
}
