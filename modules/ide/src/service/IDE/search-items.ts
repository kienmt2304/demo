import { MenuItems } from "./menu-items";
import type { MenuChildren, MenuItem, SearchItem } from "./type";
import { isMenuItem } from "./utils";

function createSearchItems(menuItems: MenuItem[]) {
  const searchItems: SearchItem[] = [];
  const recurse = (
    inputs: Array<MenuItem> | Array<MenuChildren>,
    items: SearchItem[],
  ) => {
    for (const input of inputs) {
      if (isMenuItem(input)) {
        recurse(input.children, items);
      } else if (input.children?.length) {
        recurse(input.children, items);
      } else if (input.type === "item") {
        items.push({
          id: input.id ?? "",
          name: input.name ?? "",
          hotkey: input.hotkey,
        });
      }
    }
  };
  recurse(menuItems, searchItems);
  return searchItems;
}

const SearchItems = createSearchItems(MenuItems);

export default SearchItems;
