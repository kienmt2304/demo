import type { SpotlightActionProps } from "@mantine/spotlight";
import type { NavigateOptions as NavigateOptionsBase } from "react-router";

export enum ActionTypeEnum {
  HISTORY = "history",
  HIGHLIGHT = "highlight",
}

export type History = Omit<SpotlightActionProps, "id"> & {
  id: string;
  actionType: ActionTypeEnum.HISTORY;
  to: string;
};

export type NavigateOptions = NavigateOptionsBase & {
  useMask?: boolean;
};

export type RouteToNavigate = {
  to?: string;
  options?: NavigateOptions;
};

export type Highlight = Omit<SpotlightActionProps, "id"> &
  RouteToNavigate & {
    id: string;
    actionType: ActionTypeEnum.HIGHLIGHT;
  };

export type SpotlightActionDataItem = History | Highlight;
