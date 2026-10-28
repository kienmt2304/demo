import { useTree } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useEffect } from "react";
import type { ReactElementWithChildren } from "../../../types";
import TreeContext from "./context";

export default function TreeProvider({ children }: ReactElementWithChildren) {
  const [expandedState, setExpandedState] = useLocalStorage<
    Record<string, boolean>
  >({
    key: "ide:tree:expandedState",
    defaultValue: {},
    getInitialValueInEffect: false,
  });
  const [selectedState, setSelectedState] = useLocalStorage<string[]>({
    key: "ide:tree:selectedState",
    defaultValue: [],
    getInitialValueInEffect: false,
  });

  const tree = useTree({
    initialExpandedState: expandedState,
    initialSelectedState: selectedState,
    multiple: false,
  });

  useEffect(() => {
    setExpandedState(tree.expandedState);
  }, [tree.expandedState]);

  useEffect(() => {
    setSelectedState(tree.selectedState);
  }, [tree.selectedState]);

  return (
    <TreeContext.Provider value={{ tree }}>{children}</TreeContext.Provider>
  );
}
