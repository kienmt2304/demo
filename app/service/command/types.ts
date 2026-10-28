export type CommandGroup = "Navigation" | "Actions" | "Settings";

/** Palette "pages": the root list, or a nested list opened by a command. */
export type PaletteView = "root" | "theme";

import type { Shortcut } from "@demo/shared";

export type { Shortcut };

export type Command = {
  id: string;
  label: string;
  description?: string;
  group: CommandGroup;
  keywords?: string[];
  shortcut?: Shortcut;
  icon?: React.ReactNode;
  opensView?: PaletteView;
  run: () => void;
};

/** Everything the command registry needs from the surrounding app. */
export type CommandContext = {
  goTo: (page: number) => void;
  setColorScheme: (scheme: "light" | "dark" | "auto") => void;
  toggleColorScheme: () => void;
  copyLink: () => void;
  openSettings: () => void;
  openShortcuts: () => void;
  clearRecent: () => void;
};
