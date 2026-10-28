import { useLocalStorage } from "@mantine/hooks";
import type { History } from "./types";
import { useCallback } from "react";

export default function useCommandHistory(): [
  History[],
  (_next: History) => void,
] {
  const [history, setHistory] = useLocalStorage<History[]>({
    key: "history",
    defaultValue: [],
  });

  const push = useCallback((next: History) => {
    setHistory((history) => {
      const filteredHistory = history.filter((item) => item.id !== next.id);
      return [...filteredHistory, next].slice(-5);
    });
  }, []);

  return [history, push];
}
