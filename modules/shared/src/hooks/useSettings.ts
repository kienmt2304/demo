import { useDebouncedCallback, useLocalStorage } from "@mantine/hooks";
import type {
  Settings,
  SettingsStore,
  UseSettingsReturnType,
  UseSettingsWithoutSelectorReturnType,
  UseSettingsWithSelectorReturnType,
} from "../service/settings/types";
import { useMantineColorScheme, type MantineRadius } from "@mantine/core";
import { useCallback, useContext, useEffect, useMemo } from "react";
import { notifications } from "@mantine/notifications";
import ThemeContext, {
  type CustomThemeProps,
} from "../components/Providers/ThemeProvider/context";
import compact from "../service/settings/compact";

const SETTINGS_STORE = "settings";

const DEFAULT_SETTINGS: SettingsStore = {
  enableHotkeys: true,
  emailNotifications: true,
  digest: "daily",
  pushNotification: true,
  deliveryHours: [8, 18],
};

export default function useSettings(
  shouldNotify: boolean,
  selector?: undefined,
): UseSettingsWithoutSelectorReturnType;
export default function useSettings<T>(
  shouldNotify: boolean,
  selector: (_settings: Settings) => T,
): UseSettingsWithSelectorReturnType<T>;
export default function useSettings<T>(
  shouldNotify = true,
  selector?: (_settings: Settings) => T,
): UseSettingsReturnType<T> {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const { props, setProps } = useContext(ThemeContext);
  const [storageSettings, setStorageSettings] = useLocalStorage<Settings>({
    key: SETTINGS_STORE,
    defaultValue: {
      ...DEFAULT_SETTINGS,
      ...props,
      colorScheme,
    },
  });

  const announceSaved = useDebouncedCallback(() => {
    notifications.show({
      id: "settings-saved",
      color: "teal",
      title: "Preferences saved",
      message: "Changes are stored on this device.",
      autoClose: 1500,
    });
  }, 600);

  const updateProps = useDebouncedCallback(
    (props: Partial<CustomThemeProps>) => {
      setProps(compact(props));
    },
    300,
  );

  const updateSettings = useCallback((value: Partial<Settings>) => {
    const {
      colorScheme: newColorScheme,
      primaryColor,
      scale,
      defaultRadius,
      fontSmoothing,
      respectReducedMotion,
      autoContrast,
      ...rest
    } = value;
    if (newColorScheme) {
      setColorScheme(newColorScheme);
    }
    const propsToUpdate = compact({
      scale,
      defaultRadius,
      primaryColor,
      fontSmoothing,
      respectReducedMotion,
      autoContrast,
    });
    updateProps(propsToUpdate);
    setStorageSettings((prev) => {
      return {
        ...prev,
        ...rest,
        ...propsToUpdate,
      };
    });
    if (shouldNotify) {
      announceSaved();
    }
  }, []);

  const selected = useMemo<T | undefined>(() => {
    if (!selector) return undefined;
    return selector(storageSettings);
  }, [storageSettings, selector]);
  if (selector) {
    return [selected, updateSettings];
  }

  return [storageSettings, updateSettings];
}
