import type { Settings } from "./types";

export const commandPalletModeSelector = (settings: Settings) =>
  settings.commandPaletteMode ?? "compound";

export const enableHotkeysSelector = (settings: Settings) =>
  settings.enableHotkeys ?? true;

export const pushNotiSelector = (settings: Settings) =>
  settings.pushNotification ?? true;
