import {
  ActionIcon,
  Badge,
  Button,
  Center,
  Checkbox,
  Collapse,
  Menu,
  SimpleGrid,
  Skeleton,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconChevronRight,
  IconDots,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import { Fragment, useState } from "react";
import {
  columns,
  currency,
  dateFormat,
  type Column,
} from "~/service/table/column";
import { statusColors } from "~/service/table/mock";
import type { Row, SortState, StatusFilter } from "~/service/table/types";
import { nextSort } from "~/service/table/utils";
import Detail from "./Detail";
import { SortableTHead } from "./SortableTHead";

type DataTableProps<PageRow extends Row> = {
  pageRows?: PageRow[];
};

export default function DataTable<PageRow extends Row>({
  pageRows,
}: DataTableProps<PageRow>) {
  const [density] = useLocalStorage<"compact" | "comfortable">({
    key: "data-table:density",
    defaultValue: "comfortable",
  });
  const [selected, setSelected] = useLocalStorage<Row[]>({
    key: "data-table:selected",
    defaultValue: [],
  });
  const [sort, setSort] = useLocalStorage<SortState>({
    key: "data-table:sort",
    defaultValue: null,
  });
  const [, setEditing] = useLocalStorage<Row | null>({
    key: "data-table:editing",
    defaultValue: null,
  });
  const [, setPendingDelete] = useLocalStorage<Row[]>({
    key: "data-table:pendingDelete",
    defaultValue: [],
  });
  const [hiddenColumns] = useLocalStorage<string[]>({
    key: "data-table:hidden-columns",
    defaultValue: [],
  });
  const [, setSearch] = useLocalStorage({
    key: "data-table:search",
    defaultValue: "",
  });
  const [, setStatus] = useLocalStorage<StatusFilter>({
    key: "data-table:status",
    defaultValue: "all",
  });
  const [, setPage] = useLocalStorage({
    key: "data-table:page",
    defaultValue: 1,
  });

  const visibleColumns = columns.filter(
    (column) => !hiddenColumns.includes(column.key),
  );

  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setPage(1);
    notifications.show({
      title: "Filters cleared",
      message: "Showing all users.",
    });
  };

  const toggleRow = (row: Row) =>
    setSelected((current) => {
      if (current.find((item) => item.id === row.id)) {
        return current.filter((item) => item.id !== row.id);
      }
      return [...current, row];
    });

  const toggleExpanded = (id: string) =>
    setExpanded((current) => {
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const colSpan = visibleColumns.length + 3;

  const renderCell = (row: Row, column: Column) => {
    switch (column.key) {
      case "name":
        return (
          <Text size="sm" fw={500}>
            {row.name}
          </Text>
        );
      case "status":
        return (
          <Badge variant="light" color={statusColors[row.status]}>
            {row.status}
          </Badge>
        );
      case "createdAt":
        dateFormat.format;
        return dateFormat.format(new Date(row.createdAt));
      case "amount":
        return currency.format(row.amount);
      default:
        return row[column.key];
    }
  };

  const selectedOnPage =
    pageRows?.filter((row) => selected.find((item) => item.id === row.id))
      .length ?? 0;
  const allOnPageSelected =
    (pageRows?.length ?? 0) > 0 && selectedOnPage === pageRows?.length;
  const someOnPageSelected = selectedOnPage > 0 && !allOnPageSelected;

  const togglePage = () =>
    setSelected((current) => {
      let next: Row[] = [...current];
      if (allOnPageSelected) {
        next = next.filter(
          (item) => !pageRows.map((row) => row.id).includes(item.id),
        );
      } else {
        next.push(...(pageRows ?? []));
      }
      return next;
    });

  return (
    <Table.ScrollContainer minWidth={900}>
      <Table
        stickyHeader
        highlightOnHover
        verticalSpacing={density === "compact" ? 4 : "sm"}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th w={40}>
              <Checkbox
                aria-label="Select all rows on this page"
                checked={allOnPageSelected}
                indeterminate={someOnPageSelected}
                onChange={togglePage}
                disabled={pageRows?.length === 0}
              />
            </Table.Th>
            <Table.Th w={40} />
            {visibleColumns.map((column) => (
              <SortableTHead
                key={column.key}
                column={column}
                sort={sort}
                onSort={() =>
                  setSort((current) => nextSort(current, column.key))
                }
              />
            ))}
            <Table.Th w={48} />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {pageRows ? (
            <>
              {pageRows.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={colSpan}>
                    <Center py="xl">
                      <Stack align="center" gap="xs">
                        <Text fw={500}>No results</Text>
                        <Text size="sm" c="dimmed">
                          Nothing matches the current search and filter.
                        </Text>
                        <Button
                          variant="light"
                          size="xs"
                          onClick={clearFilters}
                        >
                          Clear filters
                        </Button>
                      </Stack>
                    </Center>
                  </Table.Td>
                </Table.Tr>
              )}
              {pageRows.map((row) => {
                const isSelected = !!selected.find(
                  (item) => item.id === row.id,
                );
                const isExpanded = expanded.has(row.id);
                return (
                  <Fragment key={row.id}>
                    <Table.Tr
                      bg={
                        isSelected
                          ? "var(--mantine-primary-color-light)"
                          : undefined
                      }
                    >
                      <Table.Td>
                        <Checkbox
                          aria-label={`Select ${row.name}`}
                          checked={isSelected}
                          onChange={() => toggleRow(row)}
                        />
                      </Table.Td>
                      <Table.Td>
                        <ActionIcon
                          variant="subtle"
                          color="gray"
                          size="sm"
                          aria-label={
                            isExpanded ? "Hide details" : "Show details"
                          }
                          aria-expanded={isExpanded}
                          onClick={() => toggleExpanded(row.id)}
                        >
                          <IconChevronRight
                            size={16}
                            style={{
                              transform: isExpanded
                                ? "rotate(90deg)"
                                : undefined,
                              transition: "transform 150ms ease",
                            }}
                          />
                        </ActionIcon>
                      </Table.Td>
                      {visibleColumns.map((column) => (
                        <Table.Td
                          key={column.key}
                          ta={"align" in column ? column.align : "left"}
                        >
                          {renderCell(row, column)}
                        </Table.Td>
                      ))}
                      <Table.Td>
                        <Menu position="bottom-end" withinPortal>
                          <Menu.Target>
                            <ActionIcon
                              variant="subtle"
                              color="gray"
                              aria-label="Row actions"
                            >
                              <IconDots size={16} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item
                              leftSection={<IconPencil size={14} />}
                              onClick={() => setEditing(row)}
                            >
                              Edit
                            </Menu.Item>
                            <Menu.Item
                              color="red"
                              leftSection={<IconTrash size={14} />}
                              onClick={() => setPendingDelete([row])}
                            >
                              Delete
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr
                      style={isExpanded ? undefined : { borderBottom: "none" }}
                    >
                      <Table.Td colSpan={colSpan} p={0}>
                        <Collapse expanded={isExpanded}>
                          <SimpleGrid cols={{ base: 2, sm: 4 }} px="xl" py="sm">
                            <Detail label="User ID" value={row.id} />
                            <Detail label="Email" value={row.email} />
                            <Detail
                              label="Member since"
                              value={dateFormat.format(new Date(row.createdAt))}
                            />
                            <Detail
                              label="Lifetime spend"
                              value={currency.format(row.amount)}
                            />
                          </SimpleGrid>
                        </Collapse>
                      </Table.Td>
                    </Table.Tr>
                  </Fragment>
                );
              })}
            </>
          ) : (
            <>
              {Array.from({ length: 10 }).map((_, i) => (
                <Table.Tr key={i}>
                  <Table.Td>
                    <Skeleton height={28} radius="xl" />
                  </Table.Td>
                  <Table.Td></Table.Td>
                  {visibleColumns.map((column) => (
                    <Table.Td
                      key={column.key}
                      ta={"align" in column ? column.align : "left"}
                    >
                      <Skeleton height={20} my={4} radius="xl" />
                    </Table.Td>
                  ))}
                  <Table.Td></Table.Td>
                </Table.Tr>
              ))}
            </>
          )}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
