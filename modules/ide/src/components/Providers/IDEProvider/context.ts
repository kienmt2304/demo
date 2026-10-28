import type { UseSplitterReturnValue } from "@mantine/hooks";
import { createContext, type RefObject } from "react";

export type Toggle = {
  open: () => void;
  close: () => void;
  toggle: () => void;
};

type IDEContextType = {
  mainSplitterRef: RefObject<UseSplitterReturnValue | null>;
  verticalSplitterRef: RefObject<UseSplitterReturnValue | null>;
  sidebar: Toggle;
  terminal: Toggle;
  openSearch?: () => void;
};

const createNullRef = <T>(): RefObject<T | null> => ({ current: null });

const DEFAULT_TOGGLE: Toggle = {
  open: () => {},
  close: () => {},
  toggle: () => {},
};

const DEFAULT_IDE_CONTEXT: IDEContextType = {
  mainSplitterRef: createNullRef<UseSplitterReturnValue>(),
  verticalSplitterRef: createNullRef<UseSplitterReturnValue>(),
  sidebar: DEFAULT_TOGGLE,
  terminal: DEFAULT_TOGGLE,
  openSearch: () => {},
};

const IDEContext = createContext<IDEContextType>(DEFAULT_IDE_CONTEXT);

export default IDEContext;
