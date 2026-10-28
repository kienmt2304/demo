import type { ReactElementWithChildren } from "@demo/shared";
import IDEContext, { type Toggle } from "./context";
import { createRef, useCallback, useMemo, useRef } from "react";
import { useLocalStorage, type UseSplitterReturnValue } from "@mantine/hooks";
import IDESearch, {
  type IDESearchHandle,
} from "#components/IDE/Headings/Search";

const mainSplitterRef = createRef<UseSplitterReturnValue>();
const verticalSplitterRef = createRef<UseSplitterReturnValue>();

export default function IDEProvider({ children }: ReactElementWithChildren) {
  const [, setExplorerCollapsed] = useLocalStorage({
    key: "ide:explorer:collapsed",
    defaultValue: false,
  });
  const [, setTerminalCollapsed] = useLocalStorage({
    key: "ide:terminal:collapsed",
    defaultValue: false,
  });

  const toggleSidebar = useCallback(() => {
    setExplorerCollapsed((collapsed) => !collapsed);
    mainSplitterRef?.current?.toggleCollapse(0);
  }, []);

  const openSidebar = useCallback(() => {
    setExplorerCollapsed(false);
    mainSplitterRef.current?.expand(0);
  }, []);

  const sidebar = useMemo<Toggle>(
    () => ({
      toggle: toggleSidebar,
      open: openSidebar,
      close: () => {},
    }),
    [toggleSidebar, openSidebar],
  );

  const toggleTerminal = useCallback(() => {
    setTerminalCollapsed((collapsed) => !collapsed);
    verticalSplitterRef.current?.toggleCollapse(1);
  }, []);

  const terminal = useMemo<Toggle>(
    () => ({
      toggle: toggleTerminal,
      open: () => {},
      close: () => {},
    }),
    [toggleTerminal],
  );

  const searchRef = useRef<IDESearchHandle>(null);

  return (
    <IDEContext.Provider
      value={{
        mainSplitterRef,
        verticalSplitterRef,
        sidebar,
        terminal,
        openSearch: searchRef.current?.openSearch,
      }}
    >
      {children}
      <IDESearch ref={searchRef} />
    </IDEContext.Provider>
  );
}
