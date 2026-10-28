import { Stack, Tabs, useMatches } from "@mantine/core";
import { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import NotificationSettings from "./Notification";
import {
  IconAccessible,
  IconBell,
  IconCommand,
  IconPalette,
} from "@tabler/icons-react";
import AppearanceSettings from "./Appearance";
import CommandPaletteSettings from "./CommandPalette";
import Accessibility from "./Accessibility";
import { useLocalStorage } from "@mantine/hooks";

const HashArray = [
  "#appearance",
  "#notifications",
  "#accessibility",
  "#commandPalette",
] as const;

type Hashes = (typeof HashArray)[number];

const isValidHash = (hash?: string | null): hash is Hashes => {
  return !!hash && HashArray.includes(hash as Hashes);
};

export default function Settings() {
  const tabsOrientation = useMatches<"horizontal" | "vertical">({
    base: "horizontal",
    sm: "vertical",
  });
  const [tab, setTab] = useLocalStorage<Hashes>({
    key: "settings:tab",
    defaultValue: "#appearance",
  });

  useEffect(() => () => setTab("#appearance"), []);

  return (
    <Tabs
      variant="pills"
      value={tab}
      onChange={(newTab) => {
        if (!isValidHash(newTab)) return;
        setTab(newTab);
      }}
      orientation={tabsOrientation}
      styles={{
        list: { width: "20%" },
      }}
    >
      <Tabs.List>
        <Tabs.Tab value="#appearance" leftSection={<IconPalette size={16} />}>
          Appearance
        </Tabs.Tab>
        <Tabs.Tab value="#notifications" leftSection={<IconBell size={16} />}>
          Notifications
        </Tabs.Tab>
        <Tabs.Tab
          value="#accessibility"
          leftSection={<IconAccessible size={16} />}
        >
          Accessibility
        </Tabs.Tab>
        <Tabs.Tab
          value="#commandPalette"
          leftSection={<IconCommand size={16} />}
        >
          Command Palette
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="#appearance">
        <AppearanceSettings />
      </Tabs.Panel>
      <Tabs.Panel value="#notifications">
        <NotificationSettings />
      </Tabs.Panel>
      <Tabs.Panel value="#accessibility">
        <Accessibility />
      </Tabs.Panel>
      <Tabs.Panel value="#commandPalette">
        <CommandPaletteSettings />
      </Tabs.Panel>
    </Tabs>
  );
}
