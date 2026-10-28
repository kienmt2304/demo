import type { TreeNodeData } from "@mantine/core";
import type { Data, DataStore, SupportedFiles } from "./type";

export function serializeData(data: Data[], store: DataStore[]) {
  if (data.length === 0) return;
  data.forEach((datum) => {
    store.push({
      id: datum.value,
      name: String(datum.label),
      parent: datum.parent,
      type: datum.type,
    });
    serializeData(datum.children ?? [], store);
  });
  return;
}

export function deserializeData(store: DataStore[]): Data[] {
  const map = new Map<string, Data>();

  store.forEach((item) => {
    map.set(item.id, {
      parent: item.parent,
      type: item.type,
      label: item.name,
      value: item.id,
      hasChildren: item.type === "folder",
    });
  });

  const roots: Data[] = [];
  store.forEach((item) => {
    const node = map.get(item.id)!;
    if (item.parent) {
      const parent = map.get(item.parent);
      if (parent) {
        (parent.children ??= []).push(node);
      } else {
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  return roots;
}

export function getItemFileType(item: TreeNodeData | string) {
  if (typeof item === "string") {
    return item.split(".").at(-1) as SupportedFiles;
  }
  if (item.hasChildren) return undefined;
  return String(item.label).split(".").at(-1) as SupportedFiles;
}

export function getItemByValue(value: string, data: Data[]): Data | undefined {
  for (const item of data) {
    if (item.value === value) return item;
    const found = getItemByValue(value, item.children ?? []);
    if (found) return found;
  }
  return undefined;
}

export function isChild(value: string, parentValue: string, data: Data[]) {
  const nodeToCheck = getItemByValue(parentValue, data);
  if (!nodeToCheck) return false;
  return nodeToCheck.children?.find((child) => child.value === value);
}

export function getFileName(fullFile: string): string {
  return fullFile.split("/").at(-1) ?? "";
}

export function removeDups(entries: string[]) {
  const res: string[] = [];
  for (let i = 0; i < entries.length; i++) {
    if (i + 1 < entries.length && entries[i] === entries[i + 1]) continue;
    res.push(entries[i]);
  }
  return res;
}
