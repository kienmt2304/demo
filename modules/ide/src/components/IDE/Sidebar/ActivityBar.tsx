import { ActionIcon, Stack, Tooltip } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { IconFiles, IconSearch } from "@tabler/icons-react";
import { ActionButton } from "@demo/shared";
import useIDEContext from "#hooks/useIDEContext";

const Items = [
  {
    label: "Explorer (Ctrl + Shift + E)",
    Icon: IconFiles,
  },
  {
    label: "Search (Ctrl + Shift + F)",
    Icon: IconSearch,
  },
];

export default function ActivityBar() {
  const [focused, setFocused] = useLocalStorage<number | null>({
    key: "ide:activitybar:focused",
    defaultValue: 0,
  });
  const { sidebar } = useIDEContext();

  return (
    <Stack
      styles={{
        root: { borderRight: "1px solid var(--mantine-color-default-border)" },
      }}
      h="full"
      w={56}
      align="center"
      justify="flex-start"
      p={8}
      gap={8}
    >
      {Items.map((item, index) => (
        <ActionButton
          tooltip={item.label}
          focused={focused === index}
          onClick={() => {
            if (focused === index) {
              sidebar.toggle();
              setFocused(null);
              return;
            }
            sidebar.open();
            setFocused(index);
          }}
          Icon={item.Icon}
          key={index}
        />
      ))}
    </Stack>
  );
}
