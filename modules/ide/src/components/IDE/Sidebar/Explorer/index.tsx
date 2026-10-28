import { Flex, Stack, Title } from "@mantine/core";
import ActionMenu from "./ActionMenu";
import ExplorerTree from "./ExplorerTree";
import type { ContextMenuItem } from "#service/IDE/type";
import ContextMenu from "../../ContextMenu";

export default function Explorer() {
  const items: ContextMenuItem[] = [
    { type: "item", label: "New file", action: () => {} },
    { type: "item", label: "New folder", action: () => {} },
    { type: "item", label: "Open in terminal", action: () => {} },
    { type: "divider" },
    { type: "item", label: "Find in folder...", action: () => {} },
    { type: "divider" },
    { type: "item", label: "Paste", action: () => {} },
    { type: "divider" },
    { type: "item", label: "Copy path", action: () => {} },
  ];

  return (
    <ContextMenu items={items}>
      <Stack
        h="100%"
        w="100%"
        align="stretch"
        justify="flex-start"
        gap={0}
        p={8}
      >
        <Flex w="100%" justify={"space-between"} align={"center"}>
          <Title order={5}>Explorer</Title>
          <ActionMenu />
        </Flex>
        <ExplorerTree />
      </Stack>
    </ContextMenu>
  );
}
