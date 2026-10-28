import type { MantineRadius } from "@mantine/core";

export const transformRadiusToNumber = (radiusText: MantineRadius) => {
  switch (radiusText) {
    case "xs":
      return 1;
    case "sm":
      return 2;
    case "lg":
      return 4;
    case "xl":
      return 5;
    case "md":
    default:
      return 3;
  }
};

export const Marks = [
  { value: 1, label: "xs" },
  { value: 2, label: "sm" },
  { value: 3, label: "md" },
  {
    value: 4,
    label: "lg",
  },
  {
    value: 5,
    label: "xl",
  },
];

export const transformNumberToRadius = (number: number) => {
  return Marks.find((val) => val.value === number)?.label ?? "md";
};

const Scales = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export const ScaleOptions = Scales.map((scale) => ({
  value: 16 * scale,
  label: `${16 * scale}px`,
}));

export const transformScaleToPx = (scale: number) => 16 * scale;

export const transformPxToScale = (px: number) => px / 16;
