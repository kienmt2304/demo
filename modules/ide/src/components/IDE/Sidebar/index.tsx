import { useLocalStorage } from "@mantine/hooks";
import { useCallback } from "react";
import Explorer from "./Explorer";
import SearchTab from "./Search";

export default function Sidebar() {
  const [focused] = useLocalStorage({
    key: "ide:activitybar:focused",
    defaultValue: 0,
  });

  const renderSidebar = useCallback(() => {
    switch (focused) {
      case 1: {
        return <SearchTab />;
      }
      case 0:
      default: {
        return <Explorer />;
      }
    }
  }, [focused]);

  return renderSidebar();
}
