import {
  Affix,
  Badge,
  Button,
  Center,
  CloseButton,
  Group,
  Menu,
  Paper,
  Text,
  Transition,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SetStateAction } from "react";
import updateUserStatus from "~/action/update-user-status";
import { statusColors, statuses } from "~/service/table/mock";
import type { Row as BaseRow, Status } from "~/service/table/types";

type ActionBarProps<Row extends BaseRow> = {
  onSave: (_prev: SetStateAction<Row[]>) => void;
  onDelete: () => void;
};

export default function ActionBar<Row extends BaseRow>() {
  const [selected, setSelected] = useLocalStorage<Row[]>({
    key: "data-table:selected",
    defaultValue: [],
  });
  const [, setPendingDelete] = useLocalStorage<Row[]>({
    key: "data-table:pendingDelete",
    defaultValue: [],
  });
  const queryClient = useQueryClient();

  const changeStatusOfSelected = async (nextStatus: Status) => {
    const count = selected.length;
    updateUserStatus(
      selected.map((item) => item.id),
      nextStatus,
    ).then(() => {
      setSelected([]);
      notifications.show({
        color: statusColors[nextStatus],
        title: "Status updated",
        message: `${count} ${count === 1 ? "user" : "users"} marked as ${nextStatus}.`,
      });
    });
  };

  const editMutation = useMutation({
    mutationFn: changeStatusOfSelected,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["get-table"] });
    },
  });

  return (
    <Affix
      position={{ bottom: 24, left: 0, right: 0 }}
      style={{ pointerEvents: "none" }}
    >
      <Transition
        mounted={selected.length > 0}
        transition="slide-up"
        duration={200}
      >
        {(styles) => (
          <Center style={styles}>
            <Paper
              shadow="lg"
              withBorder
              p="sm"
              px="md"
              style={{ pointerEvents: "auto" }}
            >
              <Group>
                <Text size="sm" fw={500}>
                  {selected.length} selected
                </Text>
                <Menu position="top">
                  <Menu.Target>
                    <Button size="xs" variant="default">
                      Change status
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    {statuses.map((s) => (
                      <Menu.Item key={s} onClick={() => editMutation.mutate(s)}>
                        <Badge variant="light" color={statusColors[s]}>
                          {s}
                        </Badge>
                      </Menu.Item>
                    ))}
                  </Menu.Dropdown>
                </Menu>
                <Button
                  size="xs"
                  color="red"
                  variant="light"
                  leftSection={<IconTrash size={14} />}
                  onClick={() => setPendingDelete(selected)}
                >
                  Delete
                </Button>
                <CloseButton
                  size="sm"
                  aria-label="Clear selection"
                  onClick={() => {
                    setSelected([]);
                    notifications.show({
                      title: "Selection cleared",
                      message: "No rows selected.",
                    });
                  }}
                />
              </Group>
            </Paper>
          </Center>
        )}
      </Transition>
    </Affix>
  );
}
