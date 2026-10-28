import type { HotkeyItem } from "@mantine/hooks";
import useSettings from "./useSettings";
import { useHotkeys as useHotkeysBase } from "@mantine/hooks";
import { useMemo } from "react";
import { enableHotkeysSelector } from "../service/settings/selectors";

export default function useHotkeys(hotKeys: HotkeyItem[]) {
  const [enableHotkeys] = useSettings(false, enableHotkeysSelector);

  const filteredHotkeys = useMemo(
    () => (enableHotkeys ? hotKeys : []),
    [enableHotkeys, hotKeys],
  );

  useHotkeysBase(filteredHotkeys);
}
