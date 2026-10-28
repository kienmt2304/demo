import { Stack, useComputedColorScheme } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import type { HighlighterCore } from "shiki";
import {
  editorColors,
  fallbackColors,
  loadShiki,
  resolveThemeName,
} from "#service/IDE/shiki";
import type { EditorTheme } from "#service/IDE/type";
import type { ReactElementWithChildren } from "@demo/shared";

export default function IDETheme({ children }: ReactElementWithChildren) {
  const [editorTheme] = useLocalStorage<EditorTheme>({
    key: "ide:editor:theme",
    defaultValue: "auto",
  });

  const scheme = useComputedColorScheme("light");
  const themeName = resolveThemeName(editorTheme, scheme);
  const [shiki, setShiki] = useState<HighlighterCore | null>(null);
  const colors = useMemo(
    () =>
      shiki ? editorColors(shiki.getTheme(themeName)) : fallbackColors(scheme),
    [shiki, themeName, scheme],
  );
  useEffect(() => {
    let active = true;
    loadShiki().then((highlighter) => active && setShiki(highlighter));
    return () => {
      active = false;
    };
  }, []);

  const vars = {
    "--editor-bg": colors.background,
    "--editor-fg": colors.foreground,
    "--editor-scheme": colors.type,
    "--editor-line-number": colors.lineNumber,
    "--editor-active-line-number": colors.activeLineNumber,
    "--editor-line-highlight": colors.lineHighlight,
    "--editor-selection": colors.selection,
    "--editor-cursor": colors.cursor,
    "--editor-font-size": `16px`,
    "--editor-line-height": `20px`,
    "--editor-padding": `8px`,
  } as CSSProperties;

  return (
    <Stack h={"100dvh"} style={vars} gap={0}>
      {children}
    </Stack>
  );
}
