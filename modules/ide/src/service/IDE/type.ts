import type { TreeNodeData } from "@mantine/core";
import type { Shortcut } from "@demo/shared";
import type { TerminalStore } from "./store";

export type ItemType = "file" | "folder";

export type DataStore = {
  id: string;
  name: string;
  parent?: string;
  type: ItemType;
};

export type Data = TreeNodeData & {
  type: ItemType;
  parent?: string;
  children?: Data[];
  hasChildren?: boolean;
};

export type MenuChildren = {
  id?: string;
  name?: string;
  children?: MenuChildren[];
  hotkey?: Shortcut;
  dummyHotkey?: boolean;
  type: "item" | "divider";
  highlight?: boolean;
};

export type MenuItem = {
  id: string;
  name: string;
  children: MenuChildren[];
  highlight?: boolean;
};

export type SearchItem = {
  id: string;
  name: string;
  hotkey?: Shortcut;
  highlight?: boolean;
};

export type SupportedFiles =
  | "tsx"
  | "ts"
  | "js"
  | "txt"
  | "css"
  | "html"
  | "json"
  | "md";

export type CursorPosition = {
  ln: number;
  col: number;
  file?: string;
  selected?: number;
};

export type Edit = {
  start: number;
  end: number;
  text: string;
  selectionStart: number;
  selectionEnd: number;
};

export type Language = {
  value: SupportedFiles;
  label: string;
  comment: string | null;
};

export type EditorTheme =
  | "auto"
  | "dark-plus"
  | "light-plus"
  | "github-dark"
  | "github-light"
  | "one-dark-pro"
  | "dracula"
  | "nord"
  | "solarized-light";

export type SelectLineHandle = {
  selectLine: (_line: number) => void;
};

export type TerminalJob = {
  dir: string;
  command: string;
  content: string;
};

export type IDECommandContext<T extends Data = Data> = {
  tree: T[];
  currentPath: string;
  setCurrentPath: (_path: string) => void;
  id: string;
  setID: (_id: string) => void;
  store: TerminalStore;
  openFile: (_path: string) => void;
  viewFile: (_path: string) => string;
};

export type TransformReturnType = {
  fn: string;
  params: string[];
};

export type TerminalEventChanges = {
  changes?: Record<string, string>;
  end?: boolean;
};

export type TerminalSubscriberFN = (_changes: TerminalEventChanges) => void;

export type ContextMenuDivider = {
  type: "divider";
};

export type ContextMenuItemBase = {
  type: "item";
  label: string;
  action: () => void;
  shortcut?: Shortcut;
};

export type ContextMenuItem = ContextMenuDivider | ContextMenuItemBase;

export type FocusInput = {
  focus?: () => void;
};
