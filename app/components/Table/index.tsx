import { Stack, Text } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";

import { roles, statuses } from "~/service/table/mock";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import deleteUsers from "~/action/delete-user";
import editUser from "~/action/edit-user";
import type { Row } from "~/service/table/types";
import { validate } from "~/service/table/utils";
import { ConfirmDeleteModal } from "../Modal/ConfirmDeleteModal";
import { EditRowModal } from "../Modal/EditRowModal";
import ActionBar from "./ActionBar";
import DataTable from "./DataTable";
import TableFooter from "./Footer";
import Toolbar from "./Toolbar";
import { useTableData } from "./useTableData";

export default function Table() {
  const [editing, setEditing] = useLocalStorage<Row | null>({
    key: "data-table:editing",
    defaultValue: null,
  });
  const [, setSelected] = useLocalStorage<Row[]>({
    key: "data-table:selected",
    defaultValue: [],
  });
  const [pendingDelete, setPendingDelete] = useLocalStorage<Row[]>({
    key: "data-table:pendingDelete",
    defaultValue: [],
  });

  const queryClient = useQueryClient();
  const { pageRows, sortedCount } = useTableData();

  const confirmDelete = async () => {
    const ids = pendingDelete.map((row) => row.id);
    const label =
      pendingDelete.length === 1
        ? pendingDelete[0].name
        : `${pendingDelete.length} users`;
    await deleteUsers(ids).then(() => {
      setSelected((current) =>
        current.filter((item) => !ids.includes(item.id)),
      );
      setPendingDelete([]);
      notifications.show({
        color: "red",
        title: "Deleted",
        message: `${label} removed.`,
      });
    });
  };
  const deleteMutation = useMutation({
    mutationFn: confirmDelete,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["get-table"] });
    },
  });

  const saveRow = async (updated: Row) => {
    await editUser(updated.id, updated).then(() => {
      setEditing(null);
      notifications.show({
        color: "teal",
        title: "Saved",
        message: `${updated.name} was updated.`,
      });
    });
  };
  const editMutation = useMutation({
    mutationFn: saveRow,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["get-table"] });
    },
  });

  return (
    <Stack h="100%" p={20} pb={80}>
      <Toolbar />
      <DataTable pageRows={pageRows} />
      <TableFooter sortedCount={sortedCount} />
      <ActionBar />
      <EditRowModal
        row={editing}
        onClose={() => setEditing(null)}
        onSave={editMutation.mutate}
        keys={["name", "email", "role", "status", "amount"]}
        validate={validate}
        roles={roles}
        statuses={statuses}
      />
      <ConfirmDeleteModal
        opened={pendingDelete.length > 0}
        onClose={() => setPendingDelete([])}
        onConfirm={deleteMutation.mutate}
        title="Delete user"
      >
        <Text size="sm">
          Delete{" "}
          <b>
            {pendingDelete.length === 1
              ? pendingDelete[0].name
              : `${pendingDelete.length} users`}
          </b>
          ? This cannot be undone.
        </Text>
      </ConfirmDeleteModal>
    </Stack>
  );
}
