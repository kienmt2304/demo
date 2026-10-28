import type { RangeData, TimeRange } from "~/service/analytics";

export default async function getAnalytics(range: TimeRange) {
  const res = await fetch(`/analytics/${range}`);
  const data = await res.json();
  return data as RangeData;
}
