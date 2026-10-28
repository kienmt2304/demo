import { useCallback } from "react";
import {
  useLocation,
  useNavigate as useNavigateBase,
  type Location,
  type To,
} from "react-router";
import {
  ActionTypeEnum,
  type NavigateOptions,
} from "~/components/CommandSpotlight/types";
import useCommandHistory from "~/components/CommandSpotlight/useCommandHistory";
import { MODAL_STATE } from "~/const";
import stripSlash from "~/utils/stripSlash";

type ModalTargetProps = {
  location: Location;
  modal: string;
  useMask?: boolean;
};

function modalTarget({ location, modal, useMask = false }: ModalTargetProps) {
  const params = new URLSearchParams(location.search);
  if (useMask) {
    params.set("modal", stripSlash(modal));
    return `${location.pathname}?${params}`;
  }
  return modal;
}

export default function useNavigate() {
  const [, pushHistory] = useCommandHistory();
  const navigate = useNavigateBase();
  const location = useLocation();

  const navigateWithLog = useCallback(
    (to: To, options: NavigateOptions = {}) => {
      const { useMask, ...rest } = options;
      if (to !== "/")
        pushHistory({
          id: String(to),
          actionType: ActionTypeEnum.HISTORY,
          label: String(to),
          description: `Go to ${String(to)}`,
          to: String(to),
        });
      const opt = {
        ...rest,
        mask: String(to),
        state: useMask ? MODAL_STATE : null,
      };
      navigate(modalTarget({ location, modal: String(to), useMask }), opt);
    },
    [],
  );

  return navigateWithLog;
}
