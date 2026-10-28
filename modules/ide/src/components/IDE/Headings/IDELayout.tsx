import { ActionIcon, Flex, Tooltip } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import {
  IconLayoutBottombar,
  IconLayoutBottombarFilled,
  IconLayoutSidebar,
  IconLayoutSidebarFilled,
} from "@tabler/icons-react";
import useIDEContext from "#hooks/useIDEContext";

export default function IDELayout() {
  const { sidebar, terminal } = useIDEContext();
  const [explorerCollapsed] = useLocalStorage({
    key: "ide:explorer:collapsed",
    defaultValue: false,
  });
  const [terminalCollapsed] = useLocalStorage({
    key: "ide:terminal:collapsed",
    defaultValue: false,
  });

  return (
    <Flex align="center" justify={"flex-end"} mr={8} flex={1}>
      <Tooltip label="Toggle Primary Sidebar (Ctrl + B)" position="bottom">
        <ActionIcon variant="default" bd={"none"} onClick={sidebar.toggle}>
          {explorerCollapsed ? (
            <IconLayoutSidebar />
          ) : (
            <IconLayoutSidebarFilled />
          )}
        </ActionIcon>
      </Tooltip>
      <Tooltip label="Toggle Panel (Ctrl + `)" position="bottom">
        <ActionIcon variant="default" bd={"none"} onClick={terminal.toggle}>
          {terminalCollapsed ? (
            <IconLayoutBottombar />
          ) : (
            <IconLayoutBottombarFilled />
          )}
        </ActionIcon>
      </Tooltip>
    </Flex>
  );
}
