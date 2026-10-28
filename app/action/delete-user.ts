export default async function deleteUsers(ids: string[]) {
  return fetch(`/users`, {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
}
