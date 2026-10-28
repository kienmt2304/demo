import { Group, ScrollArea } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useCallback, useEffect, useRef } from "react";
import { removeDups } from "#service/IDE";
import EditorMenuItem from "./EditorMenuItem";
import type { ContextMenuItem } from "#service/IDE/type";
import ContextMenu from "../ContextMenu";

export default function EditorMenu() {
  const [openedFiles, setOpenedFiles] = useLocalStorage<string[]>({
    key: "ide:editor:openedFiles",
    defaultValue: [],
  });
  const [dirtyFiles] = useLocalStorage<string[]>({
    key: "ide:editor:dirty",
    defaultValue: [],
  });
  const [activeFiles, setActiveFiles] = useLocalStorage<{
    prev?: string[];
    current?: string;
  }>({
    key: "ide:editor:active",
  });
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const index = openedFiles?.findIndex(
      (file) => file === activeFiles?.current,
    );
    if (!index) return;
    viewportRef.current
      ?.querySelectorAll("[data-list-item]")
      ?.item(index)
      ?.scrollIntoView();
  }, [openedFiles, activeFiles]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      const atStart = el.scrollLeft <= 0 && e.deltaY < 0;
      const atEnd =
        el.scrollLeft + el.clientWidth >= el.scrollWidth - 1 && e.deltaY > 0;
      if (atStart || atEnd) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const closeFile = useCallback(
    (item: string) => {
      if (!openedFiles?.includes(item)) return;
      setOpenedFiles((opened) => opened?.filter((file) => file !== item));
      setActiveFiles((active) => {
        const filtered = removeDups(
          active?.prev?.filter((prev) => prev !== item) ?? [],
        );
        return {
          prev: filtered.slice(0, -1),
          current: filtered.at(-1),
        };
      });
    },
    [openedFiles],
  );

  const activateFile = useCallback(
    (item: string) => {
      if (!openedFiles?.includes(item)) return;
      if (activeFiles?.current === item) return;
      setActiveFiles((current) => ({
        prev: [...(current?.prev ?? []), current?.current ?? ""].filter(
          Boolean,
        ),
        current: item,
      }));
    },
    [openedFiles, activeFiles],
  );

  const items: ContextMenuItem[] = [
    { type: "item", label: "New text file", action: () => {} },
    { type: "item", label: "Open file...", action: () => {} },
  ];

  return (
    <ContextMenu items={items}>
      <ScrollArea
        offsetScrollbars={false}
        type="hover"
        viewportRef={viewportRef}
        style={{
          borderBottom: "1px solid var(--mantine-color-default-border)",
        }}
        bg="var(--mantine-color-gray-light)"
      >
        <Group
          align="center"
          wrap="nowrap"
          role="tablist"
          justify="flex-start"
          data-list-item
          gap={0}
        >
          {openedFiles?.map((openedFile) => {
            return (
              <EditorMenuItem
                key={openedFile}
                item={openedFile}
                onClick={activateFile}
                onClose={closeFile}
                isDirty={dirtyFiles.includes(openedFile)}
                active={activeFiles?.current === openedFile}
                tooltipPosition="bottom"
              />
            );
          })}
        </Group>
      </ScrollArea>
    </ContextMenu>
  );
}
