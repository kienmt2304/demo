import { Box, Flex, Text, type FloatingPosition } from "@mantine/core";
import FileIcon from "../FileIcon";
import { ActionButton } from "@demo/shared";
import { IconX } from "@tabler/icons-react";
import { getFileName } from "#service/IDE";
import { useHover } from "@mantine/hooks";
import type { ContextMenuItem } from "#service/IDE/type";
import ContextMenu from "../ContextMenu";

type EditorMenuItemProps = {
  item: string;
  onClick: (_item: string) => void;
  onClose: (_item: string) => void;
  isDirty?: boolean;
  active?: boolean;
  tooltipPosition?: FloatingPosition;
};

export default function EditorMenuItem({
  item,
  onClick,
  onClose,
  isDirty = false,
  active = false,
  tooltipPosition,
}: EditorMenuItemProps) {
  const { hovered, ref } = useHover();

  const items: ContextMenuItem[] = [
    { type: "item", label: "Close", action: () => {} },
    { type: "item", label: "Close others", action: () => {} },
    { type: "item", label: "Close saved", action: () => {} },
    { type: "item", label: "Close all", action: () => {} },
    { type: "divider" },
    { type: "item", label: "Copy path", action: () => {} },
    { type: "item", label: "Pin", action: () => {} },
  ];

  return (
    <ContextMenu items={items}>
      <Flex
        gap={4}
        justify="flex-start"
        align="center"
        p={8}
        onClick={() => onClick(item)}
        onAuxClick={(event) => (event.button === 1 ? onClose(item) : null)}
        bg={
          !active
            ? "var(--mantine-color-gray-light)"
            : "var(--mantine-color-body)"
        }
        pos="relative"
        style={{
          borderRight: "1px solid var(--mantine-color-default-border)",
          cursor: "pointer",
        }}
        ref={ref}
      >
        <FileIcon file={item} />
        <Text>{getFileName(item)}</Text>
        <Box
          style={{
            alignSelf: "flex-end",
            visibility: isDirty || hovered ? "visible" : "hidden",
          }}
        >
          <ActionButton
            tooltip="Close (Alt + F4)"
            tooltipPosition={tooltipPosition}
            onClick={(e) => {
              e.stopPropagation();
              onClose(item);
            }}
            Icon={IconX}
            size={16}
            iconSize={16}
            bg="none"
          />
        </Box>
        {active ? (
          <Box
            pos="absolute"
            bottom={0}
            left={0}
            right={0}
            h={"2px"}
            style={{
              zIndex: 10,
            }}
            bg="var(--mantine-primary-color-filled-hover)"
          />
        ) : null}
      </Flex>
    </ContextMenu>
  );
}
