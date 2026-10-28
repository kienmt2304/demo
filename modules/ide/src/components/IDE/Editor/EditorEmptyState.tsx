import { Center, Flex, Stack, Text } from "@mantine/core";
import { useMemo } from "react";
import { CommandKey } from "@demo/shared";
import useDataStore from "#hooks/useDataStore";
import type { Shortcut } from "@demo/shared";

const CommandsToShow: { id: string; label: string; hotkey: Shortcut }[] = [
  {
    id: "showall",
    label: "Show all Commands",
    hotkey: "ctrl+shift+P",
  },
  {
    id: "gotofile",
    label: "Go to File",
    hotkey: "ctrl+P",
  },
  {
    id: "createfile",
    label: "New file...",
    hotkey: "ctrl+N",
  },
];

export default function EditorEmptyState() {
  const [data] = useDataStore();

  const commands = useMemo(() => {
    if (data.length) {
      return CommandsToShow.filter((command) => command.id !== "createfile");
    }
    return CommandsToShow.filter((command) => command.id !== "gotofile");
  }, [data]);

  return (
    <Center w={"100%"} h={"100%"}>
      <Stack w={400}>
        {commands.map((command) => (
          <Flex key={command.id} align="center" justify="space-between">
            <Text>{command.label}</Text>
            <CommandKey shortcut={command.hotkey} />
          </Flex>
        ))}
      </Stack>
    </Center>
  );
}
