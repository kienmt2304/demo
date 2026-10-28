import { Box, Code } from "@mantine/core";
import classes from "../ide.module.css";
import { useLocalStorage } from "@mantine/hooks";
import type {
  ContextMenuItem,
  CursorPosition,
  Edit,
  EditorTheme,
  SelectLineHandle,
} from "#service/IDE/type";
import {
  applyEdit,
  countLines,
  getCursorPosition,
  getLanguage,
  indent,
  newline,
  outdent,
  toggleLineComment,
} from "#service/IDE/editor";
import {
  useImperativeHandle,
  useMemo,
  useRef,
  type KeyboardEvent,
  type Ref,
} from "react";
import { getFileName, getItemFileType } from "#service/IDE";
import { notifications } from "@mantine/notifications";
import { useHighlight } from "@mantine/code-highlight";
import ContextMenu from "../ContextMenu";

type EditorInputProps = {
  ref: Ref<SelectLineHandle>;
};

export default function EditorInput({ ref }: EditorInputProps) {
  const [activeFile] = useLocalStorage<{
    prev?: string[];
    current?: string;
  }>({
    key: "ide:editor:active",
  });
  const [fileContent, setFileContent] = useLocalStorage({
    key: `ide:editor:file-${encodeURIComponent(activeFile?.current ?? "temp")}`,
    defaultValue: "",
  });
  const lineCount = countLines(fileContent);
  const [cursorPosition, setCursorPosition] = useLocalStorage<CursorPosition>({
    key: "ide:editor:cursorpos",
    defaultValue: { ln: lineCount, col: 0 },
  });
  const [editorTheme] = useLocalStorage<EditorTheme>({
    key: "ide:editor:theme",
    defaultValue: "auto",
  });
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const releaseTab = useRef(false);

  const reportCursor = (el: HTMLTextAreaElement) => {
    const caret =
      el.selectionDirection === "backward"
        ? el.selectionStart
        : el.selectionEnd;
    setCursorPosition(
      getCursorPosition(el.value, el.selectionStart, el.selectionEnd, caret),
    );
  };

  const fileType = useMemo(
    () => getItemFileType(getFileName(activeFile?.current ?? "")),
    [activeFile?.current],
  );
  const commentToken = fileType ? getLanguage(fileType).comment : null;

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    const el = event.currentTarget;
    const { selectionStart: start, selectionEnd: end } = el;
    const mod = event.metaKey || event.ctrlKey;

    if (event.key === "Escape") {
      releaseTab.current = true;
      return;
    }
    const released = releaseTab.current;
    releaseTab.current = false;

    let edit: Edit | null = null;
    if (event.key === "Tab" && !mod && !event.altKey) {
      if (released) return;
      event.preventDefault();
      edit = event.shiftKey
        ? outdent(el.value, start, end)
        : indent(el.value, start, end);
    } else if (
      event.key === "Enter" &&
      !mod &&
      !event.altKey &&
      !event.shiftKey
    ) {
      event.preventDefault();
      edit = newline(el.value, start, end);
    } else if (event.key === "/" && mod) {
      event.preventDefault();
      if (!commentToken) {
        notifications.show({
          color: "gray",
          title: "No line comments",
          message: `${getFileName(activeFile?.current ?? "")} has no line comment syntax.`,
        });
        return;
      }
      edit = toggleLineComment(el.value, start, end, commentToken);
    }

    if (edit) {
      applyEdit(el, edit);
      reportCursor(el);
    }
  };

  const selectLine = (line: number) => {
    const el = inputRef.current;
    if (!el) return;
    const lines = el.value.split("\n");
    const start = lines
      .slice(0, line - 1)
      .reduce((sum, l) => sum + l.length + 1, 0);
    const end = Math.min(el.value.length, start + lines[line - 1].length + 1);
    el.focus();
    el.setSelectionRange(start, end);
    reportCursor(el);
  };

  useImperativeHandle(ref, () => ({ selectLine }));

  const highlight = useHighlight();
  const highlighted = useMemo(
    () =>
      highlight({
        code: fileContent,
        language: fileType,
        colorScheme: editorTheme,
      }),
    [highlight, fileContent, fileType, editorTheme],
  );

  const items: ContextMenuItem[] = [
    { type: "item", label: "Cut", action: () => {} },
    { type: "item", label: "Copy", action: () => {} },
    { type: "item", label: "Paste", action: () => {} },
    { type: "divider" },
    { type: "item", label: "Command palette...", action: () => {} },
  ];

  return (
    <ContextMenu items={items}>
      <Box className={classes.code}>
        <Box
          className={classes.activeLine}
          style={{ top: 8 + (cursorPosition.ln - 1) * 20 }}
        />
        <textarea
          ref={inputRef}
          className={classes.input}
          value={fileContent}
          onChange={(event) => {
            setFileContent(event.currentTarget.value);
            reportCursor(event.currentTarget);
          }}
          onSelect={(event) => reportCursor(event.currentTarget)}
          onKeyDown={handleKeyDown}
          wrap="off"
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          aria-label="Code editor"
          aria-multiline
          data-gramm="false"
        />
        <pre className={classes.highlight} aria-hidden>
          {highlighted.isHighlighted ? (
            <Code
              dangerouslySetInnerHTML={{ __html: highlighted.highlightedCode }}
            />
          ) : (
            <Code>{fileContent}</Code>
          )}
        </pre>
      </Box>
    </ContextMenu>
  );
}
