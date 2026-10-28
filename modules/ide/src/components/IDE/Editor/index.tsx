import { CodeHighlightAdapterProvider } from "@mantine/code-highlight";
import "@mantine/code-highlight/styles.css";
import { Flex, Stack } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import EditorEmptyState from "./EditorEmptyState";
import EditorMenu from "./EditorMenu";
import EditorBreadCrumb from "./BreadCrumb";
import EditorGutter from "./EditorGutter";
import EditorInput from "./EditorInput";
import { useRef } from "react";
import { type SelectLineHandle } from "#service/IDE/type";
import { shikiAdapter } from "#service/IDE/shiki";
import { countLines } from "#service/IDE/editor";
import classes from "../ide.module.css";

export default function Editor() {
  const [openedFiles] = useLocalStorage<string[]>({
    key: "ide:editor:openedFiles",
    defaultValue: [],
  });

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

  const ref = useRef<SelectLineHandle>(null);

  if (openedFiles.length === 0) {
    return <EditorEmptyState />;
  }

  return (
    <CodeHighlightAdapterProvider adapter={shikiAdapter}>
      <Stack h={"100%"} gap={0} className={classes.scroller}>
        <EditorMenu />
        <EditorBreadCrumb />
        <Flex
          gap={0}
          flex="1"
          miw="100%"
          className={classes.content}
          style={{ minHeight: lineCount * 20 + 8 * 2 }}
          w="max-content"
        >
          <EditorGutter onLineClick={ref.current?.selectLine} />
          <EditorInput ref={ref} />
        </Flex>
      </Stack>
    </CodeHighlightAdapterProvider>
  );
}
