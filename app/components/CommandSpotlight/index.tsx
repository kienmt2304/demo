import {
  Button,
  Group,
  Modal,
  SegmentedControl,
  Stack,
  Table,
  Text,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useClipboard, useDisclosure, useLocalStorage } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { spotlight } from "@mantine/spotlight";
import { useCallback, useMemo, useState } from "react";
import {
  CommandKey,
  commandPalletModeSelector,
  useHotkeys,
  useSettings,
} from "@demo/shared";
import { buildCommands, buildViewCommands } from "~/service/command";
import type {
  Command,
  CommandContext,
  PaletteView,
  Shortcut,
} from "~/service/command/types";
import { CompoundPalette } from "./CompoundPalette";
import { SimplePalette } from "./SimplePalette";
import useNavigate from "~/hooks/useNavigate";
import { PAGES } from "~/const";

export default function CommandSpotlight() {
  const [mode] = useSettings(true, commandPalletModeSelector);
  const [view, setView] = useState<PaletteView>("root");
  const [query, setQuery] = useState("");
  const [recentIds, setRecentIds] = useLocalStorage<string[]>({
    key: "command-palette:recent",
    defaultValue: [],
  })
  const navigate = useNavigate();

  const [shortcutsOpened, shortcuts] = useDisclosure(false);
  const clipboard = useClipboard();
  const { setColorScheme } = useMantineColorScheme();
  const computedScheme = useComputedColorScheme("light");

  const ctx = useMemo<CommandContext>(
    () => ({
      goTo: (number) => {
        const target = PAGES.find((page) => page.number === number);
        if (!target) return;
        navigate(target.link);
        notifications.show({
          title: "Navigated",
          message: `Opened ${ target.name }`,
        });
      },
      setColorScheme,
      toggleColorScheme: () => {
        const next = computedScheme === "dark" ? "light" : "dark";
        setColorScheme(next);
        notifications.show({
          title: "Color Scheme",
          message: `Switched to ${ next } mode`,
        });
      },
      copyLink: () => {
        clipboard.copy(window.location.href);
        notifications.show({
          color: "teal",
          title: "Link copied",
          message: `${ window.location.href } copied!`,
        });
      },
      openSettings: () =>
        navigate("settings", { useMask: true, mask: "/setting" }),
      openShortcuts: shortcuts.open,
      clearRecent: () => {
        setRecentIds([]);
        notifications.show({
          title: "Recent cleared",
          message: "History was reset.",
        });
      },
    }),
    [clipboard, computedScheme, setColorScheme, setRecentIds, shortcuts.open],
  );

  const commands = useMemo(() => buildCommands(ctx), [ctx]);
  const viewCommands = useMemo(() => buildViewCommands(ctx), [ctx]);

  const commandsById = useMemo(() => {
    const all = [...commands, ...Object.values(viewCommands).flat()];
    return new Map(all.map((command) => [command.id, command]));
  }, [commands, viewCommands]);

  const recent = recentIds
    .map((id) => commandsById.get(id))
    .filter((command): command is Command => Boolean(command));

  /** Single entry point for palette clicks and direct hotkeys. */
  const execute = useCallback(
    (command: Command) => {
      if (command.opensView) {
        setView(command.opensView);
        setQuery("");
        spotlight.open();
        return;
      }
      // Record before running so commands that reset history ("Clear recent") win.
      setRecentIds((ids) =>
        [command.id, ...ids.filter((id) => id !== command.id)].slice(0, 5),
      );
      command.run();
      spotlight.close();
    },
    [setRecentIds],
  );

  useHotkeys(
    commands
      .filter((command) => command.shortcut)
      .map((command) => [
        command.shortcut!,
        () => execute(command),
        { usePhysicalKeys: true },
      ]),
  );

  const shortcutRows: Array<{ label: string; shortcut: Shortcut }> = [
    { label: "Open Command Pallete", shortcut: "mod+K" },
    { label: "Open Command Pallete", shortcut: "/" },
    ...commands
      .filter((command) => command.shortcut)
      .map((command) => ({
        label: command.label,
        shortcut: command.shortcut!,
      })),
  ];

  return (
    <Stack>
      {mode === "compound" ? (
        <CompoundPalette
          commands={commands}
          viewCommands={viewCommands}
          recent={recent}
          view={view}
          onViewChange={setView}
          query={query}
          onQueryChange={setQuery}
          execute={execute}
        />
      ) : (
        <SimplePalette commands={commands} execute={execute} />
      )}

      <Modal
        opened={shortcutsOpened}
        onClose={shortcuts.close}
        title="Keyboard shortcuts"
      >
        <Table verticalSpacing="xs">
          <Table.Tbody>
            {shortcutRows.map((row) => (
              <Table.Tr key={row.label + row.shortcut}>
                <Table.Td>{row.label}</Table.Td>
                <Table.Td>
                  <Group justify="flex-end">
                    <CommandKey shortcut={row.shortcut} />
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Modal>
    </Stack>
  );
}
