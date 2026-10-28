import { Menu } from "@mantine/core";
import { useCallback, useState } from "react";
import { CommandKey } from "@demo/shared";
import type { ContextMenuItem } from "#service/IDE/type";
import { isDivider } from "#service/IDE/utils";
import type { ReactElementWithChildren } from "@demo/shared";

type ContextMenuProps = ReactElementWithChildren & {
  items: ContextMenuItem[];
};

export default function ContextMenu({ children, items }: ContextMenuProps) {
  const renderItem = useCallback((item: ContextMenuItem, index: number) => {
    if (isDivider(item)) {
      return <Menu.Divider key={`${item.type}-${index}`} />;
    }
    return (
      <Menu.Item
        rightSection={
          item.shortcut ? <CommandKey shortcut={item.shortcut} /> : null
        }
        key={item.label}
        onClick={item.action}
      >
        {item.label}
      </Menu.Item>
    );
  }, []);

  return (
    <Menu position="bottom-start">
      <Menu.ContextMenu>{children}</Menu.ContextMenu>
      <Menu.Dropdown>{items.map(renderItem)}</Menu.Dropdown>
    </Menu>
  );
}
