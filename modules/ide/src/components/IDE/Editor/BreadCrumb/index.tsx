import { Breadcrumbs, Flex, Popover, UnstyledButton } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useCallback, useRef, useState } from "react";
import classes from "../../ide.module.css";
import FileIcon from "../../FileIcon";

type Path = {
  label: string;
  path: string;
};

function splitPath(path: string) {
  const splitted = path.split("/");
  const paths: string[] = [];
  const result: Path[] = [];
  splitted.forEach((split) => {
    paths.push(split);
    result.push({ label: split, path: paths.join("/") });
  });
  return result;
}

export default function EditorBreadCrumb() {
  const [activeFile] = useLocalStorage<{
    prev?: string[];
    current?: string;
  }>({
    key: "ide:editor:active",
  });

  const [opened, setOpened] = useState(false);
  const [offset, setOffset] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const renderItem = useCallback((item: Path, index: number, items: Path[]) => {
    return (
      <UnstyledButton
        onClick={(event) => {
          setOpened(true);
          if (!ref.current) return;
          setOffset(
            event.currentTarget.getBoundingClientRect().left -
              ref.current.getBoundingClientRect().left,
          );
        }}
      >
        <Flex gap={4} align="center" justify="center">
          {index === items.length - 1 ? <FileIcon file={item.label} /> : null}
          {item.label}
        </Flex>
      </UnstyledButton>
    );
  }, []);

  if (!activeFile?.current) return <></>;

  return (
    <Popover
      opened={opened}
      position="bottom-start"
      offset={{ crossAxis: offset }}
      onChange={setOpened}
    >
      <Popover.Target>
        <Breadcrumbs
          ref={ref}
          separator=">"
          p={8}
          separatorMargin="2px"
          bg="var(--mantine-color-gray-light)"
          styles={{
            separator: {
              color: "var(--mantine-color-dimmed)",
            },
          }}
          style={{
            borderBottom: "1px solid var(--mantine-color-default-border)",
          }}
          classNames={{
            breadcrumb: classes.breadcrumb,
          }}
        >
          {splitPath(activeFile.current).map(renderItem)}
        </Breadcrumbs>
      </Popover.Target>
      <Popover.Dropdown>Dropdown</Popover.Dropdown>
    </Popover>
  );
}
