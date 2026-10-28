import { useDebouncedValue, useLocalStorage } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import getTable from "~/action/get-table";
import { type SortState, type StatusFilter } from "~/service/table/types";

export function useTableData() {
  const [search] = useLocalStorage({
    key: "data-table:search",
    defaultValue: "",
  });
  const [status] = useLocalStorage<StatusFilter>({
    key: "data-table:status",
    defaultValue: "all",
  });
  const [sort] = useLocalStorage<SortState>({
    key: "data-table:sort",
    defaultValue: null,
  });
  const [page, setPage] = useLocalStorage({
    key: "data-table:page",
    defaultValue: 1,
  });
  const [pageSize] = useLocalStorage({
    key: "data-table:pageSize",
    defaultValue: 10,
  });

  const [debouncedSearch] = useDebouncedValue(search, 250);

  useEffect(() => setPage(1), [debouncedSearch]);

  const {
    isPending,
    isError,
    data: pageRows,
    error,
  } = useQuery({
    queryKey: ["get-table", debouncedSearch, status, sort, page, pageSize],
    queryFn: () =>
      getTable({
        sort,
        status,
        search: debouncedSearch,
        page,
        pageSize,
      }),
  });

  return { ...pageRows, isPending, isError, error };
}
