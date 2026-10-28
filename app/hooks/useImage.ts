import { useInfiniteQuery } from "@tanstack/react-query";
import type { FetchImage } from "~/service/infinite-scroll/type";

async function fetchItems({ pageParam = 0 }: { pageParam: number }) {
  const data = await fetch(`/images?from=${pageParam}`);
  const { images, next } = (await data.json()) as FetchImage;
  return { items: images, next };
}

export default function useInfiniteImages() {
  return useInfiniteQuery({
    queryKey: ["images"],
    queryFn: fetchItems,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
  });
}
