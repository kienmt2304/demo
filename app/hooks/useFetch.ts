import { useSessionStorage } from "@mantine/hooks";
import { useEffect, useMemo, useState } from "react";

type UseFetchOptions = {
  params: Partial<Record<string, any>>;
};

type UseFetchReturnValue<T> = [T | null, boolean];

export default function useFetch<T extends Object>(
  endpoint: string,
  options?: UseFetchOptions,
  deps: any[] = [],
): UseFetchReturnValue<T> {
  const finalEndpoint = useMemo(
    () =>
      endpoint +
      Object.entries(options?.params ?? []).reduce(
        (prev, [key, value], index) =>
          prev +
          (index !== 0 ? "&" : "?") +
          `${key}=${encodeURIComponent(value)}`,
        "",
      ),
    [endpoint, options?.params],
  );
  const [data, setData] = useSessionStorage<T | null>({
    key: `usefetch:${encodeURIComponent(finalEndpoint)}`,
    defaultValue: null,
  });
  const [loading, setLoading] = useSessionStorage({
    key: `usefetch:loading:${encodeURIComponent(finalEndpoint)}`,
    defaultValue: false,
  });
  useEffect(() => {
    setLoading(true);
    const finalEndpoint =
      endpoint +
      Object.entries(options?.params ?? []).reduce(
        (prev, [key, value], index) =>
          prev +
          (index !== 0 ? "&" : "?") +
          `${key}=${encodeURIComponent(value)}`,
        "",
      );
    fetch(finalEndpoint)
      .then((res) => res.json())
      .then((res) => {
        setData(res as T);
        setLoading(false);
      });
  }, deps);

  return [data, loading];
}
