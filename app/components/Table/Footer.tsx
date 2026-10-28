import { Group, Pagination, Select, Skeleton, Text } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { rangeLabel } from "~/service/table/utils";

type TableFooterProps = {
  sortedCount?: number;
};

export default function TableFooter({ sortedCount }: TableFooterProps) {
  const [pageSize, setPageSize] = useLocalStorage({
    key: "data-table:pageSize",
    defaultValue: 10,
  });
  const [page, setPage] = useLocalStorage({
    key: "data-table:page",
    defaultValue: 1,
  });

  const totalPages = Math.max(1, Math.ceil((sortedCount ?? 0) / pageSize));
  const currentPage = Math.min(page, totalPages);
  return (
    <Group justify="space-between">
      {typeof sortedCount !== "undefined" ? (
        <Text size="sm" c="dimmed">
          {rangeLabel(currentPage, pageSize, sortedCount)}
        </Text>
      ) : (
        <Skeleton height={20} my={4} width={150} radius={"xl"} />
      )}
      <Group>
        <Group gap="xs">
          <Text size="sm">Rows per page</Text>
          <Select
            w={80}
            size="xs"
            allowDeselect={false}
            value={String(pageSize)}
            onChange={(value) => {
              setPageSize(Number(value));
              setPage(1);
            }}
            data={["10", "25", "50"]}
          />
        </Group>
        {typeof sortedCount !== "undefined" ? (
          <Pagination
            total={totalPages}
            value={currentPage}
            onChange={setPage}
            size="sm"
          />
        ) : (
          <Skeleton h={28} width={200} />
        )}
      </Group>
    </Group>
  );
}
