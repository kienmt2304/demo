import { useLocalStorage } from "@mantine/hooks";
import classes from "../ide.module.css";
import { countLines } from "#service/IDE/editor";
import { type CursorPosition } from "#service/IDE/type";
import { Box } from "@mantine/core";

type EditorGutterProps = {
  onLineClick?: (_line: number) => void;
};

export default function EditorGutter({ onLineClick }: EditorGutterProps) {
  const [activeFile] = useLocalStorage<{
    prev?: string[];
    current?: string;
  }>({
    key: "ide:editor:active",
  });
  const [fileContent] = useLocalStorage({
    key: `ide:editor:file-${encodeURIComponent(activeFile?.current ?? "temp")}`,
    defaultValue: "",
  });
  const lineCount = countLines(fileContent);
  const [cursorPosition] = useLocalStorage<CursorPosition>({
    key: "ide:editor:cursorpos",
    defaultValue: { ln: lineCount, col: 0 },
  });

  return (
    <Box className={classes.gutter} aria-hidden>
      {Array.from({ length: lineCount }, (_, i) => (
        <Box
          key={i}
          className={classes.lineNumber}
          style={{ minWidth: "3ch" }}
          data-active={i + 1 === cursorPosition.ln || undefined}
          onMouseDown={(event) => {
            event.preventDefault();
            onLineClick?.(i + 1);
          }}
        >
          {i + 1}
        </Box>
      ))}
    </Box>
  );
}
