import type { Row } from "~/service/table/types";

export default async function editUser(id: string, data: Partial<Row>) {
  return fetch(`/users/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}
