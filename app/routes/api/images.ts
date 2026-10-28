import { fetchImages } from "~/service/infinite-scroll";
import type { Route } from "./+types/images";

export async function loader({ url }: Route.LoaderArgs) {
  const images = await fetchImages(url);
  return new Response(JSON.stringify(images), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
