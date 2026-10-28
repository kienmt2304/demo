import type { UseTreeReturnType } from "@mantine/core";
import { createContext } from "react";

type TreeContext = {
  tree: UseTreeReturnType;
};

const noop = () => {};

const defaultTree: UseTreeReturnType = {
  checkStrictly: false,
  multiple: false,
  expandedState: {},
  selectedState: [],
  checkedState: [],
  anchorNode: null,
  initialize: noop,
  toggleExpanded: noop,
  collapse: noop,
  expand: noop,
  expandAllNodes: noop,
  collapseAllNodes: noop,
  setExpandedState: noop,
  toggleSelected: noop,
  select: noop,
  deselect: noop,
  clearSelected: noop,
  setSelectedState: noop,
  checkNode: noop,
  uncheckNode: noop,
  checkAllNodes: noop,
  uncheckAllNodes: noop,
  setCheckedState: noop,
  getCheckedNodes: () => [],
  isNodeChecked: () => false,
  isNodeIndeterminate: () => false,
  isNodeLoading: () => false,
  getNodeLoadError: () => null,
  loadNode: () => Promise.resolve(),
  invalidateNode: noop,
};

const TreeContext = createContext<TreeContext>({
  tree: defaultTree,
});

export default TreeContext;
