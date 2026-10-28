import type { MantineRadius } from "@mantine/core";
import { createContext, type Dispatch, type SetStateAction } from "react";

export type CustomThemeProps = {
  primaryColor: string;
  defaultRadius: MantineRadius;
  scale: number;
  fontSmoothing: boolean;
  respectReducedMotion: boolean;
  autoContrast: boolean;
};

export type ThemeContextProps = {
  props: CustomThemeProps;
  setProps: Dispatch<SetStateAction<Partial<CustomThemeProps>>>;
};

export const DEFAULT_CUSTOM_THEME_PROPS: CustomThemeProps = {
  primaryColor: "#ee0033",
  defaultRadius: "md",
  scale: 1,
  fontSmoothing: true,
  respectReducedMotion: true,
  autoContrast: true,
};

const DEFAULT_CONTEXT_VALUE: ThemeContextProps = {
  props: DEFAULT_CUSTOM_THEME_PROPS,
  setProps: () => {},
};

export function isSetStateFunction<T>(
  val: SetStateAction<T>,
): val is (prevState: T) => T {
  return typeof val === "function";
}

const ThemeContext = createContext<ThemeContextProps>(DEFAULT_CONTEXT_VALUE);

export default ThemeContext;
