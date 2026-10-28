import {
  Box,
  Button,
  RangeSlider,
  SegmentedControl,
  Stack,
  Switch,
  Title,
} from "@mantine/core";
import classes from "./settings.module.css";
import { notifications } from "@mantine/notifications";
import { formatHour, useSettings } from "@demo/shared";
import Section from "./Section";
import { useLocalStorage } from "@mantine/hooks";

export default function CommandPaletteSettings() {
  const [settings, updateSettings] = useSettings(true);
  const [recentIds, setRecentIds] = useLocalStorage({
    key: "command-palette:recent",
    defaultValue: [],
  });

  const clearRecent = () => {
    setRecentIds([]);
    notifications.show({
      title: "Recent cleared",
      message: "History was reset.",
    });
  };

  return (
    <Stack px="xl" pb={16}>
      <Title order={3}>Command Palette</Title>

      <Section
        title="Command spotlight mode"
        description="Set command spotlight mode"
      >
        <SegmentedControl
          value={settings.commandPaletteMode}
          onChange={(value) => {
            updateSettings({ commandPaletteMode: value });
          }}
          data={[
            { label: "Compound mode", value: "compound" },
            { label: "Simple mode", value: "simple" },
          ]}
        />
      </Section>
      <Section
        title="Reset recent activity"
        description={`Reset recent ${recentIds.length ? `${recentIds.length} ` : ""}activities`}
      >
        <Button variant="light" color="red" onClick={clearRecent}>
          Clear
        </Button>
      </Section>
    </Stack>
  );
}
