import { Flex, Kbd, Text } from "@mantine/core";
import { useOs, type UseOSReturnValue } from "@mantine/hooks";
import { useMemo } from "react";
import type { Shortcut } from "../../types";

type Modifier = "mod" | "meta" | "ctrl" | "alt" | "shift";

const macModifier: Record<Modifier, string> = {
  mod: "⌘",
  meta: "⌘",
  ctrl: "⌃",
  alt: "⌥",
  shift: "⇧",
};

const pcModifier: Record<Modifier, string> = {
  mod: "Win",
  meta: "Ctrl",
  ctrl: "Ctrl",
  alt: "Alt",
  shift: "Shift",
};

type CommandWithModifierProps = {
  command: string;
  modifiers: Modifier[];
  shortcut?: never;
  small?: boolean;
};

type CommandWithShortcutProps = {
  command?: never;
  modifiers?: never;
  shortcut: Shortcut;
  small?: boolean;
};

type CommandProps = CommandWithModifierProps | CommandWithShortcutProps;

const supported = ["macos", "windows", "linux", "chromeos"];

const transformShortcut = (shortcut: Shortcut) => {
  const parts = shortcut.split("+");
  if (parts.length > 3 || parts.length < 1) throw new Error("Invalid shortcut");
  if (parts.length === 1) {
    return {
      command: parts.at(0)!,
      modifiers: [],
    };
  }
  if (parts.length === 3) {
    return {
      command: parts.at(2)!,
      modifiers: parts.slice(0, 2) as Modifier[],
    };
  }
  return {
    command: parts.at(1)!,
    modifiers: parts.slice(0, 1) as Modifier[],
  };
};

function isCommand(props: CommandProps): props is CommandWithShortcutProps {
  return !!props.shortcut;
}

export default function CommandKey(props: CommandProps) {
  const os = useOs();
  const isApple = os === "macos";
  const modifier = useMemo(
    () => (isApple ? macModifier : pcModifier),
    [isApple],
  );

  const { command, modifiers } = useMemo(() => {
    if (isCommand(props)) {
      return transformShortcut(props.shortcut);
    }
    return { command: props.command, modifiers: props.modifiers };
  }, [props.command, props.modifiers, props.shortcut]);
  const small = props.small;

  return supported.includes(os) ? (
    <Flex gap={small ? 1 : 4}>
      {modifiers.map((key) => (
        <Kbd fz={small ? 8 : 12} key={key}>
          {modifier[key]}
        </Kbd>
      ))}
      <Kbd fz={small ? 8 : 12}>{command}</Kbd>
    </Flex>
  ) : null;
}
