import waitTime from "~/utils/waitTime";
import { generateRows } from "./mock";
import type { GetRowProps, GetRowReturnType, Row, Status } from "./types";
import { filterRows, paginate, sortRows } from "./utils";
import { deepMerge } from "@mantine/core";

let rows = generateRows();

export default async function getRows({
  search = "",
  status = "all",
  sort = null,
  pageSize = 10,
  page = 1,
}: GetRowProps): Promise<GetRowReturnType> {
  const filtered = filterRows(rows, search, status);
  const sorted = sortRows(filtered, sort);
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = paginate(sorted, currentPage, pageSize);
  await waitTime();
  return { pageRows, sortedCount: sorted.length };
}

export function findUserIndex(id: string) {
  return rows.findIndex((row) => row.id === id);
}

export function editUser(index: number, data: Partial<Row>) {
  if (index === -1) return;
  const user = rows.at(index);
  if (!user) return;
  const updatedUser = deepMerge(user, data);
  rows.splice(index, 1, updatedUser);
  return updatedUser;
}

export function deleteUser(index: number) {
  if (index === -1) return;
  const user = rows.at(index);
  if (!user) return;
  rows.splice(index, 1);
  return;
}

export function deleteUsers(ids: string[]) {
  rows = rows.filter((row) => !ids.includes(row.id));
  return;
}

export const STATUSES = ["active", "invited", "suspended"] as const;

export function editStatusOfUsers(ids: string[], newStatus: Status) {
  rows = rows.map((row) =>
    ids.includes(row.id) ? { ...row, status: newStatus } : row,
  );
  return;
}
