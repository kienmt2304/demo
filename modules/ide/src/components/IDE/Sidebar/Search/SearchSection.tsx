import { ActionIcon, Flex, Stack, TextInput } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react";
import { useRef, useState } from "react";

export default function SearchSection() {
  const [expanded, setExpanded] = useLocalStorage<boolean>({
    key: "ide:search:expanded",
    defaultValue: false,
  });

  const [focused, setFocused] = useState(false);

  const [history, setHistory] = useLocalStorage<string[]>({
    key: "ide:search:history",
    defaultValue: [],
  });

  const [value, setValue] = useState("");
  const index = useRef(0);
  const draft = useRef("");

  const onChangeInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;

    if (e.key === "Enter" && value.trim()) {
      if (history[history.length - 1] !== value)
        setHistory((prev) => [...prev, value]);
      index.current = history.length;
      draft.current = "";
      setValue("");
    } else if (e.key === "ArrowUp" && index.current > 0) {
      e.preventDefault();
      if (index.current === history.length) draft.current = value;
      setValue(history[--index.current]);
    } else if (e.key === "ArrowDown" && index.current < history.length) {
      e.preventDefault();
      index.current++;
      setValue(
        index.current === history.length
          ? draft.current
          : history[index.current],
      );
    }
  };

  return (
    <Flex w="100%" align={"center"} gap={2} p={2}>
      <ActionIcon
        h={"100%"}
        w={10}
        onClick={() => setExpanded((expanded) => !expanded)}
      >
        {expanded ? (
          <IconChevronDown size={8} />
        ) : (
          <IconChevronRight size={8} />
        )}
      </ActionIcon>
      <Stack flex={1}>
        <TextInput
          w={"100%"}
          placeholder={`Search${focused ? " (⇅ for history)" : ""}`}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={onChangeInput}
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
        />
      </Stack>
    </Flex>
  );
}
