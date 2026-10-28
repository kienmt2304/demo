import { Flex, Splitter, useMantineTheme } from "@mantine/core";
import Headings from "./Headings";
import { useMemo } from "react";
import type { Shortcut } from "@demo/shared";
import { flat, isMenuItem } from "#service/IDE/utils";
import { MenuItems } from "#service/IDE/menu-items";
import MenuActions from "#service/IDE/menu-actions";
import { useHotkeys } from "@demo/shared";
import Sidebar from "./Sidebar";
import ActivityBar from "./Sidebar/ActivityBar";
import useIDEContext from "#hooks/useIDEContext";
import Editor from "./Editor";
import Terminal from "./Terminal";
import { TreeProvider } from "@demo/shared";
import IDETheme from "./Theme";

export default function IDE() {
  const { mainSplitterRef, verticalSplitterRef } = useIDEContext();
  const theme = useMantineTheme();

  const shortcuts = useMemo(() => {
    const flattenedItems: Array<[Shortcut, () => void]> = [];
    flat(MenuItems, flattenedItems, (item) => {
      if (
        isMenuItem(item) ||
        !item.hotkey ||
        item.dummyHotkey ||
        !MenuActions[item.hotkey ?? ""]
      )
        return;
      return [item.hotkey, MenuActions[item.hotkey ?? ""]];
    });
    return flattenedItems.filter(Boolean);
  }, []);

  useHotkeys(shortcuts);

  return (
    <TreeProvider>
      <IDETheme>
        <Headings />
        <Flex w="100%" h={"calc(100% - 32px)"}>
          <ActivityBar />
          <Splitter
            h={"100%"}
            handleColor={theme.colors.gray[4]}
            splitterRef={mainSplitterRef}
            withHandle={false}
            w="100%"
          >
            <Splitter.Pane defaultSize={20} min="200px" collapsible>
              <Sidebar />
            </Splitter.Pane>
            <Splitter.Pane defaultSize={80} min={20}>
              <Splitter
                splitterRef={verticalSplitterRef}
                withHandle={false}
                orientation="vertical"
                h="100%"
              >
                <Splitter.Pane collapsible defaultSize={70} min={10}>
                  <Editor />
                </Splitter.Pane>
                <Splitter.Pane collapsible defaultSize={30} min={10}>
                  <Terminal />
                </Splitter.Pane>
              </Splitter>
            </Splitter.Pane>
          </Splitter>
        </Flex>
      </IDETheme>
    </TreeProvider>
  );
}
