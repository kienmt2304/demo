import { Stack, Switch, Title } from "@mantine/core";
import { useSettings } from "@demo/shared";

export default function Accessibility() {
  const [settings, updateSettings] = useSettings(true);

  return (
    <Stack px="xl">
      <Title order={3}>Accessibility</Title>
      <Switch
        label="Enable hotkeys"
        description="Enable hotkeys for faster actions"
        checked={settings.enableHotkeys}
        onChange={(event) =>
          updateSettings({ enableHotkeys: event.currentTarget.checked })
        }
      />
      <Switch
        label="Auto contrast"
        description="Automatically change text color based on background color"
        checked={settings.autoContrast}
        onChange={(event) =>
          updateSettings({ autoContrast: event.currentTarget.checked })
        }
      />
      <Switch
        label="Respect reduced motion"
        description="Respect OS settings to reduce motion"
        checked={settings.respectReducedMotion}
        onChange={(event) =>
          updateSettings({ respectReducedMotion: event.currentTarget.checked })
        }
      />
      <Switch
        label="Font smoothing"
        description="Enable font smoothing"
        checked={settings.fontSmoothing}
        onChange={(event) =>
          updateSettings({ fontSmoothing: event.currentTarget.checked })
        }
      />
    </Stack>
  );
}
