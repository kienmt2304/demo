import {
  ActionIcon,
  Checkbox,
  CloseButton,
  Group,
  Loader,
  Popover,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useDebouncedValue, useLocalStorage } from "@mantine/hooks";
import { IconColumns3, IconSearch } from "@tabler/icons-react";
import { columns } from "~/service/table/column";
import { statuses } from "~/service/table/mock";
import type { StatusFilter } from "~/service/table/types";

const capitalize = (value: string) => value[0].toUpperCase() + value.slice(1);

export default function Toolbar() {
  const [search, setSearch] = useLocalStorage({
    key: "data-table:search",
    defaultValue: "",
  });
  const [status, setStatus] = useLocalStorage<StatusFilter>({
    key: "data-table:status",
    defaultValue: "all",
  });
  const [page, setPage] = useLocalStorage({
    key: "data-table:page",
    defaultValue: 1,
  });
  const [density, setDensity] = useLocalStorage<"compact" | "comfortable">({
    key: "data-table:density",
    defaultValue: "comfortable",
  });
  const [hiddenColumns, setHiddenColumns] = useLocalStorage<string[]>({
    key: "data-table:hidden-columns",
    defaultValue: [],
  });

  const [debouncedSearch] = useDebouncedValue(search, 300);

  return (
    <Group justify="space-between" align="flex-end">
      <Group align="flex-end">
        <TextInput
          placeholder="Search name or email"
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          rightSection={
            search !== debouncedSearch ? (
              <Loader size={14} />
            ) : search ? (
              <CloseButton
                size="sm"
                aria-label="Clear search"
                onClick={() => setSearch("")}
              />
            ) : null
          }
          w={260}
        />
        <SegmentedControl
          value={status}
          onChange={(value) => {
            setStatus(value as StatusFilter);
            setPage(1);
          }}
          data={[
            { label: "All", value: "all" },
            ...statuses.map((s) => ({ label: capitalize(s), value: s })),
          ]}
        />
      </Group>
      <Group gap="xs">
        <SegmentedControl
          size="xs"
          value={density}
          onChange={(value) => setDensity(value as typeof density)}
          data={[
            { label: "Comfortable", value: "comfortable" },
            { label: "Compact", value: "compact" },
          ]}
        />
        <Popover position="bottom-end" shadow="md">
          <Popover.Target>
            <ActionIcon variant="default" size="lg" aria-label="Toggle columns">
              <IconColumns3 size={18} />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown>
            <Text size="xs" fw={600} c="dimmed" mb="xs">
              Visible columns
            </Text>
            <Stack gap="xs">
              {columns.map((column) => (
                <Checkbox
                  key={column.key}
                  size="xs"
                  label={column.label}
                  checked={!hiddenColumns.includes(column.key)}
                  disabled={column.locked}
                  onChange={(event) => {
                    const visible = event.currentTarget.checked;
                    setHiddenColumns((current) =>
                      visible
                        ? current.filter((key) => key !== column.key)
                        : [...current, column.key],
                    );
                  }}
                />
              ))}
            </Stack>
          </Popover.Dropdown>
        </Popover>
      </Group>
    </Group>
  );
}
