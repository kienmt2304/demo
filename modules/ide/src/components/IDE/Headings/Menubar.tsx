import { Menubar as MantineMenubar, Menu } from "@mantine/core";
import { MenuItems } from "#service/IDE/menu-items";
import { useCallback } from "react";
import type { MenuChildren } from "#service/IDE/type";
import { CommandKey } from "@demo/shared";
import MenuActions from "#service/IDE/menu-actions";

export default function MenuBar() {
  const renderItem = useCallback(
    (
      item: MenuChildren,
      ParentComponent: typeof Menu.Item | typeof Menu.Sub.Item = Menu.Item,
    ) => {
      if (item.type === "divider") {
        return <Menu.Divider />;
      }
      return (
        <ParentComponent
          rightSection={
            item.hotkey ? <CommandKey small shortcut={item.hotkey} /> : null
          }
          onClick={MenuActions[item.id ?? ""]}
        >
          {item.name}
        </ParentComponent>
      );
    },
    [MenuActions],
  );

  const renderDropdown = useCallback(
    (
      items: MenuChildren[],
      ParentComponent:
        | typeof MantineMenubar.Dropdown
        | typeof Menu.Sub.Dropdown = MantineMenubar.Dropdown,
    ) => {
      return (
        <ParentComponent>
          {items.map((item) => {
            if (item.children?.length) {
              return (
                <Menu.Sub>
                  <Menu.Sub.Target>
                    {renderItem(item, Menu.Sub.Item)}
                    {renderDropdown(item.children, Menu.Sub.Dropdown)}
                  </Menu.Sub.Target>
                </Menu.Sub>
              );
            }
            return renderItem(item);
          })}
        </ParentComponent>
      );
    },
    [],
  );

  return (
    <MantineMenubar flex={1}>
      {MenuItems.map((item) => {
        return (
          <MantineMenubar.Menu width={250} key={item.id}>
            <MantineMenubar.Target>{item.name}</MantineMenubar.Target>
            {renderDropdown(item.children)}
          </MantineMenubar.Menu>
        );
      })}
    </MantineMenubar>
  );
}
