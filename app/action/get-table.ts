import type { GetRowProps, GetRowReturnType } from "~/service/table/types";

function normalizeProps(params: Record<string, any>): Record<string, string> {
  return Object.entries(params).reduce<Record<string, string>>(
    (acc, [key, val]) => {
      if (val === undefined || val === null) return acc;
      if (key === "sort") {
        acc[key] = JSON.stringify(val);
        return acc;
      }
      acc[key] = String(val);
      return acc;
    },
    {},
  );
}

export default async function getTable(params: GetRowProps) {
  const normalizedParams = normalizeProps(params);
  const searchParams = new URLSearchParams(normalizedParams);
  const res = await fetch("/users?" + searchParams.toString(), {
    method: "GET",
  });
  const data = await res.json();
  return data as GetRowReturnType;
}
