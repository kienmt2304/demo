export type DigestFrequency = "daily" | "weekly" | "never";

export const accentSwatches = [
  "#4c6ef5",
  "#228be6",
  "#15aabf",
  "#12b886",
  "#40c057",
  "#fab005",
  "#fd7e14",
  "#ee0033",
  "#e64980",
  "#7950f2",
];

export const PREFERENCES_KEY = "settings:preferences";

export const formatHour = (hour: number) =>
  `${hour.toString().padStart(2, "0")}:00`;
