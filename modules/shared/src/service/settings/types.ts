import type { MantineColorScheme } from "@mantine/core";
import type { CustomThemeProps } from "../../components/Providers/ThemeProvider/context";

export type DigestFrequency = "daily" | "weekly" | "never";

export type SettingsStore = {
  enableHotkeys?: boolean;
  emailNotifications?: boolean;
  digest?: DigestFrequency;
  pushNotification?: boolean;
  deliveryHours?: [number, number];
  commandPaletteMode?: "simple" | "compound";
  fontSmoothing?: boolean;
};

export type Settings = SettingsStore & {
  colorScheme: MantineColorScheme;
} & CustomThemeProps;

export type UseSettingsWithoutSelectorReturnType = [
  settings: Settings,
  updateSettings: (_settings: Partial<Settings>) => void,
];
export type UseSettingsWithSelectorReturnType<T> = [
  settings: T | undefined,
  updateSettings: (_settings: Partial<Settings>) => void,
];
export type UseSettingsReturnType<T> =
  | UseSettingsWithoutSelectorReturnType
  | UseSettingsWithSelectorReturnType<T>;
