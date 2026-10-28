import { notifications } from "@mantine/notifications";
import {
  IconBell,
  IconCalendarPin,
  IconChalkboardTeacher,
  IconDeviceDesktop,
  IconHistory,
  IconHome,
  IconKeyboard,
  IconLink,
  IconMoon,
  IconPalette,
  IconPlus,
  IconRefresh,
  IconSettings,
  IconSun,
  IconTable,
  IconUpload,
} from "@tabler/icons-react";

import type { Command, CommandContext, PaletteView, Shortcut } from "./types";
import { PAGES } from "~/const";

const iconProps = { size: 18, stroke: 1.5 };

const navigationIcons: Record<string, React.ReactNode> = {
  "/": <IconHome {...iconProps} />,
  "/table": <IconTable {...iconProps} />,
  "/onboarding": <IconChalkboardTeacher {...iconProps} />,
  "/settings": <IconSettings {...iconProps} />,
  "/booking": <IconCalendarPin {...iconProps} />,
  "/upload": <IconUpload {...iconProps} />,
};

const navigationMeta: Record<
  string,
  { shortcut?: Shortcut; keywords: string[] }
> = {
  "/": {
    shortcut: "alt+shift+H",
    keywords: ["home", "overview", "start"],
  },
  "/table": { shortcut: "alt+shift+E", keywords: ["table", "data table"] },
  "/onboarding": {
    shortcut: "alt+shift+O",
    keywords: ["onboarding", "form"],
  },
  "/settings": {
    shortcut: "alt+shift+S",
    keywords: ["settings", "preferences", "notifications"],
  },
  "/booking": { keywords: ["booking", "appointment", "calendar"] },
  "/upload": { shortcut: "alt+shift+u", keywords: ["file", "upload"] },
};

/** Builds the root command registry. Pure data plus closures over `ctx`. */
export function buildCommands(ctx: CommandContext): Command[] {
  const navigation: Command[] = PAGES.map((page) => ({
    id: `go-${page.name}`,
    label: `${page.title}`,
    description: `Go to ${page.title}`,
    group: "Navigation",
    icon: navigationIcons[page.link],
    ...navigationMeta[page.link],
    run: () => ctx.goTo(page.number),
  }));

  const actions: Command[] = [
    {
      id: "copy-link",
      label: "Copy link",
      description: "Copy the current page URL to the clipboard",
      group: "Actions",
      keywords: ["url", "share", "clipboard"],
      shortcut: "alt+shift+C",
      icon: <IconLink {...iconProps} />,
      run: ctx.copyLink,
    },
    {
      id: "test-notification",
      label: "Show test notification",
      description: "Trigger a sample toast",
      group: "Actions",
      keywords: ["toast", "alert", "ping"],
      shortcut: "alt+shift+N",
      icon: <IconBell {...iconProps} />,
      run: () =>
        notifications.show({
          title: "Hello from the palette",
          message: "This is what a test notification looks like.",
        }),
    },
    {
      id: "new-project",
      label: "Create project",
      description: "Start a new empty project",
      group: "Actions",
      keywords: ["add", "new", "repo"],
      icon: <IconPlus {...iconProps} />,
      run: () =>
        notifications.show({
          color: "teal",
          title: "Project created",
          message: "“Untitled project” was added to Projects.",
        }),
    },
    {
      id: "sync",
      label: "Sync data",
      description: "Refresh everything from the server",
      group: "Actions",
      keywords: ["refresh", "reload", "fetch"],
      icon: <IconRefresh {...iconProps} />,
      run: () => {
        const id = notifications.show({
          loading: true,
          title: "Syncing…",
          message: "Fetching the latest data",
          autoClose: false,
          withCloseButton: false,
        });
        setTimeout(() => {
          notifications.update({
            id,
            loading: false,
            color: "teal",
            title: "Sync complete",
            message: "Everything is up to date.",
            autoClose: 2500,
            withCloseButton: true,
          });
        }, 1200);
      },
    },
  ];

  const settings: Command[] = [
    {
      id: "toggle-theme",
      label: "Toggle color scheme",
      description: "Switch between light and dark",
      group: "Settings",
      keywords: ["dark mode", "light mode", "appearance"],
      shortcut: "alt+shift+L",
      icon: <IconMoon {...iconProps} />,
      run: ctx.toggleColorScheme,
    },
    {
      id: "change-theme",
      label: "Change theme…",
      description: "Pick light, dark or system",
      group: "Settings",
      keywords: ["appearance", "color scheme"],
      icon: <IconPalette {...iconProps} />,
      opensView: "theme",
      run: () => {},
    },
    {
      id: "open-settings",
      label: "Open settings",
      description: "Preferences for this workspace",
      group: "Settings",
      keywords: ["preferences", "options", "config"],
      shortcut: "alt+shift+S",
      icon: <IconSettings {...iconProps} />,
      run: ctx.openSettings,
    },
    {
      id: "show-shortcuts",
      label: "Keyboard shortcuts",
      description: "List every shortcut",
      group: "Settings",
      keywords: ["hotkeys", "keys", "help"],
      shortcut: "alt+shift+K",
      icon: <IconKeyboard {...iconProps} />,
      run: ctx.openShortcuts,
    },
    {
      id: "clear-recent",
      label: "Clear recent commands",
      description: "Forget the Recent group",
      group: "Settings",
      keywords: ["history", "reset"],
      icon: <IconHistory {...iconProps} />,
      run: ctx.clearRecent,
    },
  ];

  return [...navigation, ...actions, ...settings];
}

/** Commands shown in nested palette views. */
export function buildViewCommands(
  ctx: CommandContext,
): Record<Exclude<PaletteView, "root">, Command[]> {
  const setScheme =
    (scheme: "light" | "dark" | "auto", label: string) => () => {
      ctx.setColorScheme(scheme);
      notifications.show({
        title: "Theme changed",
        message: `Using ${label} theme.`,
      });
    };

  return {
    theme: [
      {
        id: "theme-light",
        label: "Light theme",
        group: "Settings",
        icon: <IconSun {...iconProps} />,
        run: setScheme("light", "light"),
      },
      {
        id: "theme-dark",
        label: "Dark theme",
        group: "Settings",
        icon: <IconMoon {...iconProps} />,
        run: setScheme("dark", "dark"),
      },
      {
        id: "theme-auto",
        label: "System theme",
        description: "Follow the operating system",
        group: "Settings",
        keywords: ["auto", "os"],
        icon: <IconDeviceDesktop {...iconProps} />,
        run: setScheme("auto", "system"),
      },
    ],
  };
}

export const viewTitles: Record<PaletteView, string> = {
  root: "",
  theme: "Theme",
};
