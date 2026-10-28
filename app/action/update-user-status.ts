import type { Status } from "~/service/table/types";

export default async function updateUserStatus(ids: string[], status: Status) {
  return fetch("users/status", {
    method: "POST",
    body: JSON.stringify({ ids, status }),
  });
}
