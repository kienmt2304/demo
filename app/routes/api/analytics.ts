import { generateRangeData, type TimeRange } from "~/service/analytics";
import type { Route } from "./+types/analytics";
import waitTime from "~/utils/waitTime";

export async function loader({ params }: Route.LoaderArgs) {
  const range = params.range as TimeRange;
  const data = generateRangeData(range);
  await waitTime();

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
