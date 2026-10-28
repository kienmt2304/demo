import { useCallback, useEffect, useMemo } from "react";
import {
  useFetcher,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router";
import Settings from "~/components/Settings";
import BaseModal from "./BaseModal";
import {
  ModalTargetEnum,
  type TargetMappingType,
  type WithModalState,
} from "./types";

const TargetMapping: TargetMappingType = {
  [ModalTargetEnum.settings]: Settings,
};

const TitleMapping: Record<ModalTargetEnum, string> = {
  [ModalTargetEnum.settings]: "Setting",
};

const modalPages: string[] = [ModalTargetEnum.settings] as const;

export default function Modal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const modal = searchParams.get("modal");
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const location = useLocation();
  const active = !!modal;

  useEffect(() => {
    if (!modal || !modalPages.includes(modal)) return;
    fetcher.load(`/${modal}?index`);
  }, [modal]);

  const close = useCallback(() => {
    if (!modal || !modalPages.includes(modal)) return;
    if ((location.state as WithModalState)?.fromModalNav) {
      navigate(-1);
    } else {
      setSearchParams("modal", undefined);
    }
  }, [modal, location.key]);

  const [ModalComponent, title] = useMemo(
    () => [
      TargetMapping[modal as ModalTargetEnum],
      TitleMapping[modal as ModalTargetEnum],
    ],
    [modal],
  );

  return fetcher.data && active ? (
    <BaseModal
      onClose={close}
      title={title}
      useDrawerOnSmallScreen
      ModalComponent={ModalComponent}
    />
  ) : null;
}
