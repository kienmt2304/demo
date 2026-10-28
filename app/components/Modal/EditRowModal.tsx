import {
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm, type FormValidateInput } from "@mantine/form";

import { useMemo } from "react";

type EditRowModalProps<
  Keys extends string,
  T extends { id: string } & Record<Keys, any>,
> = {
  row: T | null;
  onClose: () => void;
  onSave: (_row: any) => void;
  keys: Keys[];
  validate: FormValidateInput<Pick<T, Keys>>;
  roles: string[];
  statuses: string[];
};

export function EditRowModal<
  Keys extends string,
  T extends { id: string } & Record<Keys, any>,
>({
  row,
  onClose,
  onSave,
  keys,
  validate,
  roles,
  statuses,
}: EditRowModalProps<Keys, T>) {
  return (
    <Modal opened={row !== null} onClose={onClose} title="Edit user">
      {row && (
        <EditRowForm
          key={row.id}
          row={row}
          onCancel={onClose}
          onSave={onSave}
          keys={keys}
          validate={validate}
          roles={roles}
          statuses={statuses}
        />
      )}
    </Modal>
  );
}

type EditRowFormProps<Keys extends string, T extends Record<Keys, any>> = {
  row: T;
  keys: Keys[];
  onCancel: () => void;
  onSave: (row: T) => void;
  validate: FormValidateInput<Pick<T, Keys>>;
  roles: string[];
  statuses: string[];
};

function EditRowForm<Keys extends string, T extends Record<Keys, any>>({
  row,
  onCancel,
  onSave,
  keys,
  validate,
  roles,
  statuses,
}: EditRowFormProps<Keys, T>) {
  type FormValues = Pick<T, Keys>;
  const initialValues = useMemo<FormValues>(() => {
    let ini: Partial<FormValues> = {};
    for (const key of Object.values(keys)) {
      ini[key] = row[key];
    }
    return ini as FormValues;
  }, []);
  const form = useForm<FormValues>({
    mode: "uncontrolled",
    initialValues,
    validate,
    validateInputOnBlur: true,
  });

  return (
    <form onSubmit={form.onSubmit((values) => onSave({ ...row, ...values }))}>
      <Stack>
        <TextInput
          label="Name"
          withAsterisk
          key={form.key("name")}
          {...form.getInputProps("name")}
        />
        <TextInput
          label="Email"
          withAsterisk
          key={form.key("email")}
          {...form.getInputProps("email")}
        />
        <Group grow>
          <Select
            label="Role"
            data={roles}
            allowDeselect={false}
            key={form.key("role")}
            {...form.getInputProps("role")}
          />
          <Select
            label="Status"
            data={statuses.map((s: string) => ({
              value: s,
              label: s[0].toUpperCase() + s.slice(1),
            }))}
            allowDeselect={false}
            key={form.key("status")}
            {...form.getInputProps("status")}
          />
        </Group>
        <NumberInput
          label="Amount"
          prefix="$"
          decimalScale={2}
          thousandSeparator=","
          min={0}
          key={form.key("amount")}
          {...form.getInputProps("amount")}
        />
        <Group justify="flex-end" mt="sm">
          <Button variant="default" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save changes</Button>
        </Group>
      </Stack>
    </form>
  );
}
