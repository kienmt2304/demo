import { data } from "react-router";
import type { Route } from "./+types/user-status";
import type { Status } from "~/service/table/types";
import { editStatusOfUsers, STATUSES } from "~/service/table";
import waitTime from "~/utils/waitTime";

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return data({ error: "Invalid method" }, { status: 405 });
  }
  const body = (await request.json()) as { ids: string; status: Status };
  if (
    !body.status ||
    !STATUSES.includes(body.status) ||
    !Array.isArray(body.ids) ||
    !body.ids.length
  ) {
    return data({ error: "Bad request" }, { status: 400 });
  }
  await waitTime();
  editStatusOfUsers(body.ids, body.status);
  return data({ message: "Success" }, { status: 200 });
}
