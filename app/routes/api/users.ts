import getRows, {
  deleteUser,
  deleteUsers,
  editUser,
  findUserIndex,
} from "~/service/table";
import type { Route } from "./+types/users";
import { data } from "react-router";
import waitTime from "~/utils/waitTime";

export async function loader({ url }: Route.LoaderArgs) {
  const searchParams = url.searchParams;
  const sort = searchParams.get("sort");
  const searchProps = {
    ...Object.fromEntries(searchParams),
    sort: sort ? JSON.parse(sort) : null,
  };
  const rows = await getRows(searchProps);
  return new Response(JSON.stringify(rows), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function action({ params, request }: Route.ActionArgs) {
  await waitTime();
  if (request.method === "POST" && params.id) {
    return data({ error: "Bad request 1" }, { status: 400 });
  }
  if (request.method !== "POST" && !params.id) {
    return data({ error: "Bad request 2" }, { status: 400 });
  }
  if (request.method === "POST" && !params.id) {
    const body = (await request.json()) as { ids: string[] };
    if (!Array.isArray(body.ids) || !body.ids.length)
      return data({ error: "Bad request 3" }, { status: 400 });
    deleteUsers(body.ids);
    return data({ message: "Deleted" }, { status: 200 });
  }
  const id = decodeURIComponent(params.id ?? "");
  const userIndex = findUserIndex(id);
  if (userIndex === -1) {
    return data({ error: "User not found" }, { status: 404 });
  }
  switch (request.method) {
    case "PATCH": {
      const body = await request.json();
      editUser(userIndex, body);
      return data({ message: "Updated" }, { status: 200 });
    }
    case "DELETE": {
      deleteUser(userIndex);
      return data({ message: "Deleted" }, { status: 204 });
    }
    default: {
      return data({ error: "Invalid method" }, { status: 405 });
    }
  }
}
