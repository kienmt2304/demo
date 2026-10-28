import {
  Flex,
  Text,
  type RenderTreeNodePayload,
  type TreeNodeData,
} from "@mantine/core";
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react";
import classes from "../../ide.module.css";
import FileIcon from "../../FileIcon";
import ContextMenu from "../../ContextMenu";
import type { ContextMenuItem } from "#service/IDE/type";

type ExplorerLeafProps = RenderTreeNodePayload & {
  onClick?: (node: TreeNodeData) => void;
};

export default function ExplorerLeaf({
  node,
  expanded,
  elementProps,
  selected,
  onClick,
}: ExplorerLeafProps) {
  const bg = selected
    ? "var(--mantine-color-placeholder) !important"
    : "var(--mantine-color-default)";

  let children;

  if (node.hasChildren) {
    children = (
      <>
        {expanded ? (
          <IconChevronDown size={16} />
        ) : (
          <IconChevronRight size={16} />
        )}
        <Text>{node.label}</Text>
      </>
    );
  } else {
    children = (
      <>
        <FileIcon file={node.value} />
        <Text>{node.label}</Text>
      </>
    );
  }

  const options: ContextMenuItem[] = [
    {
      type: "item",
      label: "Cut",
      action: () => {},
    },
    {
      type: "item",
      label: "Copy",
      action: () => {},
    },
    {
      type: "divider",
    },
    {
      type: "item",
      label: "Copy path",
      action: () => {},
    },
    {
      type: "divider",
    },
    {
      type: "item",
      label: "Rename...",
      action: () => {},
    },
    {
      type: "item",
      label: "Delete",
      action: () => {},
    },
  ];

  return (
    <ContextMenu items={options}>
      <Flex
        bg={bg}
        {...elementProps}
        onClick={(e) => {
          elementProps.onClick(e);
          onClick?.(node);
        }}
        classNames={{
          root: classes.leaf,
        }}
        align="center"
        gap={4}
        justify={"flex-start"}
      >
        {children}
      </Flex>
    </ContextMenu>
  );
}
