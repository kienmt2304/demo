import type { ReactNode } from "react";
import ConfirmModal from "./ConfirmModal";

type ConfirmDeleteModalProps = {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: ReactNode;
  confirmLabel?: string;
  children: ReactNode;
};

export function ConfirmDeleteModal({
  opened,
  onClose,
  onConfirm,
  title,
  confirmLabel = "Delete",
  children,
}: ConfirmDeleteModalProps) {
  return (
    <ConfirmModal
      opened={opened}
      onClose={onClose}
      onConfirm={onConfirm}
      title={title}
      confirmLabel={confirmLabel}
      confirmColor="red"
      confirmAutoFocus
    >
      {children}
    </ConfirmModal>
  );
}
