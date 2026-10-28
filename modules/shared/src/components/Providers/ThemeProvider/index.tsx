import {
  createTheme,
  MantineProvider,
  useMantineTheme,
  type MantineColorShade,
} from "@mantine/core";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
  type SetStateAction,
} from "react";
import { generateColors } from "./color-generator";
import ThemeContext, {
  DEFAULT_CUSTOM_THEME_PROPS,
  type CustomThemeProps,
} from "./context";
import compact from "../../../service/settings/compact";

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [props, setProps] = useState(DEFAULT_CUSTOM_THEME_PROPS);

  const theme = useMemo(() => {
    const colors = generateColors(props.primaryColor);
    return createTheme({
      colors: {
        brand: colors.colors,
      },
      primaryColor: "brand",
      primaryShade: {
        light: colors.baseIndex,
        dark: Math.min(colors.baseIndex + 1, 9) as MantineColorShade,
      },
      autoContrast: props.autoContrast,
      defaultRadius: props.defaultRadius,
      scale: props.scale,
      fontSmoothing: props.fontSmoothing,
      respectReducedMotion: props.respectReducedMotion,
    });
  }, [props.primaryColor, props.defaultRadius, props.scale]);

  const updateProps = useCallback(
    (val: SetStateAction<Partial<CustomThemeProps>>) => {
      setProps((prev) => ({ ...prev, ...val }));
    },
    [],
  );

  useEffect(() => {
    try {
      const data = JSON.parse(
        localStorage.getItem("settings") ?? "",
      ) as CustomThemeProps;
      const {
        scale,
        defaultRadius,
        primaryColor,
        fontSmoothing,
        respectReducedMotion,
        autoContrast,
      } = data;
      const propsToUpdate = compact({
        scale,
        defaultRadius,
        primaryColor,
        fontSmoothing,
        respectReducedMotion,
        autoContrast,
      });
      updateProps(propsToUpdate);
    } catch (_err) {
      console.debug("No settings found, skipping");
      return;
    }
  }, [updateProps]);

  return (
    <ThemeContext.Provider value={{ props, setProps: updateProps }}>
      <MantineProvider theme={theme}>{children}</MantineProvider>
    </ThemeContext.Provider>
  );
}
