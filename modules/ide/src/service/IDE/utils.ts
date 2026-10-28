import type {
  ContextMenuDivider,
  ContextMenuItem,
  MenuChildren,
  MenuItem,
} from "./type";

export const isMenuItem = (item: MenuItem | MenuChildren): item is MenuItem =>
  "menu" in item;

export const flat = <T>(
  items: Array<MenuItem> | Array<MenuChildren>,
  flattenedItems: Array<T>,
  transform: (_item: MenuItem | MenuChildren) => T,
) => {
  for (const item of items) {
    if (isMenuItem(item)) {
      flat(item.children, flattenedItems, transform);
    } else if (item.children?.length) {
      flat(item.children, flattenedItems, transform);
    } else {
      flattenedItems.push(transform(item));
    }
  }
};

export const isDivider = (
  item: ContextMenuItem,
): item is ContextMenuDivider => {
  return item.type === "divider";
};

export const getEntriesOfFileOrFolder = (path: string) => {
  const names = path.split("/");
  const entries: string[] = [];
  names.reduce((prev, name, index) => {
    prev += name;
    entries.push(prev);
    if (index < names.length - 1) prev += "/";
    return prev;
  }, "");
  return entries;
};
