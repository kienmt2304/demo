import type { Image } from "./type";

export async function fetchImages(url: URL) {
  const searchParams = url.searchParams;
  const from = Number(searchParams.get("from")) ?? 0;
  const data = await fetch("https://jsonplaceholder.typicode.com/photos");
  const images = (await data.json()) as Image[];
  const someImages = images.slice(from, from + 50);
  const next = from + 50 < 5000 ? from + 50 : null;
  return { images: someImages, next: next };
}
