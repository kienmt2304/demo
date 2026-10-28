import { Button, Group, Modal, type ModalProps } from "@mantine/core";
import type { ReactNode } from "react";

type ConfirmModalProps = {
  opened: ModalProps["opened"];
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  onConfirm?: () => void;
  formId?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColor?: string;
  confirmDisabled?: boolean;
  confirmAutoFocus?: boolean;
};

export default function ConfirmModal({
  opened,
  onClose,
  title,
  children,
  onConfirm,
  formId,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmColor = "teal",
  confirmDisabled = false,
  confirmAutoFocus = false,
}: ConfirmModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title={title} centered>
      {children}
      <Group justify="flex-end" mt="lg">
        <Button variant="default" onClick={onClose}>
          {cancelLabel}
        </Button>
        <Button
          color={confirmColor}
          disabled={confirmDisabled}
          type={formId ? "submit" : "button"}
          form={formId}
          onClick={formId ? undefined : onConfirm}
          data-autofocus={confirmAutoFocus || undefined}
        >
          {confirmLabel}
        </Button>
      </Group>
    </Modal>
  );
}
