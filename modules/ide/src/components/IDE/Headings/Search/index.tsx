import {
  Autocomplete,
  Popover,
  Portal,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./search.module.css";
import { IconSearch } from "@tabler/icons-react";
import {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type Ref,
} from "react";

export type IDESearchHandle = {
  openSearch: () => void;
};

export default function IDESearch({ ref }: { ref?: Ref<IDESearchHandle> }) {
  const [dropdownOpened, { open, toggle }] = useDisclosure();
  const [opened, setOpened] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!dropdownOpened) {
      return;
    }
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [dropdownOpened]);

  const openSearch = () => {
    setOpened(true);
    open();
  };

  useImperativeHandle(ref, () => {
    return {
      openSearch,
    };
  });

  return (
    <Popover
      width="target"
      offset={-30}
      position="bottom"
      withArrow
      shadow="md"
      opened={opened}
      onChange={(opened) => {
        setOpened(opened);
        toggle();
      }}
    >
      <Popover.Target>
        <Portal
          target={
            typeof document !== "undefined"
              ? (document.getElementById("#ide-search") ?? undefined)
              : undefined
          }
        >
          <UnstyledButton
            className={classes.trigger}
            aria-label="Open command palette"
            onClick={openSearch}
          >
            <IconSearch size={16} stroke={1.5} />
            <Text className={classes.label}>Search…</Text>
          </UnstyledButton>
        </Portal>
      </Popover.Target>
      <Popover.Dropdown p={0}>
        <Autocomplete
          ref={inputRef}
          data={["React", "Angular", "Vue", "Svelte"]}
          comboboxProps={{ withinPortal: false }}
          dropdownOpened={dropdownOpened}
        />
      </Popover.Dropdown>
    </Popover>
  );
}
