import type { MenuItem } from "./type";

export const MenuItems: MenuItem[] = [
  {
    id: "file",
    name: "File",
    children: [
      {
        id: "file:new-file",
        name: "New File",
        type: "item",
        hotkey: "ctrl+N",
        highlight: true,
      },
      {
        id: "file:new-folder",
        name: "New Folder",
        type: "item",
        hotkey: "ctrl+shift+N",
      },
      {
        type: "divider",
      },
      {
        id: "file:open-file",
        name: "Open File...",
        type: "item",
        hotkey: "ctrl+O",
        highlight: true,
      },
      {
        id: "file:open-folder",
        name: "Open Folder...",
        type: "item",
        hotkey: "ctrl+shift+O",
      },
      {
        type: "divider",
      },
      {
        id: "file:save",
        name: "Save",
        type: "item",
        hotkey: "ctrl+S",
        highlight: true,
      },
      {
        type: "divider",
      },
      {
        id: "file:close",
        name: "Close editor",
        type: "item",
        hotkey: "ctrl+F4",
      },
      {
        id: "ide:exit",
        name: "Exit IDE",
        type: "item",
      },
    ],
  },
  {
    id: "edit",
    name: "Edit",
    children: [
      {
        id: "edit:undo",
        name: "Undo",
        type: "item",
        hotkey: "ctrl+Z",
        highlight: true,
      },
      {
        id: "edit:redo",
        name: "Redo",
        type: "item",
        hotkey: "ctrl+Y",
        highlight: true,
      },
      {
        type: "divider",
      },
      {
        id: "edit:cut",
        name: "Cut",
        type: "item",
        hotkey: "ctrl+X",
      },
      {
        id: "edit:copy",
        name: "Copy",
        type: "item",
        hotkey: "ctrl+C",
      },
      {
        id: "edit:paste",
        name: "Paste",
        type: "item",
        hotkey: "ctrl+V",
      },
      {
        type: "divider",
      },
      {
        id: "edit:find",
        name: "Find",
        type: "item",
        hotkey: "ctrl+F",
        highlight: true,
      },
      {
        id: "edit:replace",
        name: "Replace",
        type: "item",
        hotkey: "ctrl+H",
      },
      {
        type: "divider",
      },
      {
        id: "edit:find-in-files",
        name: "Find in Files",
        type: "item",
        hotkey: "ctrl+shift+F",
      },
      {
        id: "edit:replace-in-files",
        name: "Replace in Files",
        type: "item",
        hotkey: "ctrl+shift+H",
      },
    ],
  },
  {
    id: "view",
    name: "View",
    children: [
      {
        id: "view:command-palette",
        name: "Command Palette",
        type: "item",
        hotkey: "ctrl+shift+P",
        highlight: true,
      },
      {
        id: "view:explorer",
        name: "Explorer",
        type: "item",
        hotkey: "ctrl+shift+E",
        highlight: true,
      },
      {
        id: "view:search",
        name: "Search",
        type: "item",
        hotkey: "ctrl+shift+F",
        dummyHotkey: true,
      },
      {
        id: "view:terminal",
        name: "Terminal",
        type: "item",
        hotkey: "ctrl+`",
        highlight: true,
      },
    ],
  },
  {
    id: "go",
    name: "Go",
    children: [
      {
        id: "go:last-edit-location",
        name: "Last Edit Location",
        type: "item",
        hotkey: "ctrl+shift+K",
      },
      {
        id: "go:go-to-file",
        name: "Go to File",
        type: "item",
        hotkey: "ctrl+P",
        highlight: true,
      },
      {
        id: "go:go-to-line",
        name: "Go to Line",
        type: "item",
        hotkey: "ctrl+G",
      },
      {
        type: "divider",
      },
      {
        id: "go:next-editor",
        name: "Next Editor",
        type: "item",
        hotkey: "ctrl+pageDown",
      },
      {
        id: "go:previous-editor",
        name: "Previous Editor",
        type: "item",
        hotkey: "ctrl+pageUp",
      },
    ],
  },
  {
    id: "help",
    name: "Help",
    children: [
      {
        id: "help:keyboard-shortcuts",
        name: "Keyboard Shortcuts",
        type: "item",
        hotkey: "ctrl+/",
      },
    ],
  },
];
