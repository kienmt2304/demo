import { Tree, useTree, type TreeNodeData } from "@mantine/core";
import useDataStore from "#hooks/useDataStore";
import ExplorerLeaf from "./ExplorerLeaf";
import { useLocalStorage } from "@mantine/hooks";
import { useCallback, useContext, useEffect, useMemo } from "react";
import { TreeContext } from "@demo/shared";
import { deserializeData } from "#service/IDE";

export default function ExplorerTree() {
  const [data] = useDataStore();
  const [, setOpenedFiles] = useLocalStorage<string[]>({
    key: "ide:editor:openedFiles",
    defaultValue: [],
    getInitialValueInEffect: false,
  });
  const [, setActiveFiles] = useLocalStorage<{
    prev?: string[];
    current?: string;
  }>({
    key: "ide:editor:active",
    getInitialValueInEffect: false,
  });
  const [selectedState] = useLocalStorage<string[]>({
    key: "ide:tree:selectedState",
    defaultValue: [],
    getInitialValueInEffect: false,
  });
  const { tree } = useContext(TreeContext);

  const onClick = useCallback(
    (node: TreeNodeData) => {
      const selected = selectedState.at(0);
      if (selected) {
        tree.deselect(selected);
      }
      tree.select(node.value);
      if (!node.hasChildren) {
        setOpenedFiles((files) => Array.from(new Set([...files, node.value])));
        setActiveFiles((activeFile) => ({
          prev: [...(activeFile?.prev ?? []), activeFile?.current ?? ""].filter(
            Boolean,
          ),
          current: String(node.value) ?? "",
        }));
      }
    },
    [selectedState, tree],
  );

  const serializedData = useMemo(() => deserializeData(data), [data]);

  return (
    <Tree
      data={serializedData}
      tree={tree}
      renderNode={(props) => <ExplorerLeaf {...props} onClick={onClick} />}
    />
  );
}
