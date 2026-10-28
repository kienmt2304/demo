import { Table } from "@mantine/core";

export default function ReviewRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <Table.Tr>
      <Table.Th w={160}>{label}</Table.Th>
      <Table.Td>{value}</Table.Td>
    </Table.Tr>
  );
}
