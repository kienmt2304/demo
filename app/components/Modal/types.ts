import type { MODAL_STATE } from "~/const";

export type WithModalState = typeof MODAL_STATE;

export enum ModalTargetEnum {
  settings = "settings",
}

export type TargetMappingType = Record<
  ModalTargetEnum,
  () => React.JSX.Element
>;

export type BaseModalProps = {
  ModalComponent: () => React.JSX.Element;
  useDrawerOnSmallScreen: boolean;
  onClose: () => void;
  title: string;
};
