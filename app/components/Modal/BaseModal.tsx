import { Drawer, Modal } from "@mantine/core";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import { useEffect } from "react";
import type { BaseModalProps } from "./types";

export default function BaseModal({
  ModalComponent,
  useDrawerOnSmallScreen,
  onClose,
  title,
}: BaseModalProps) {
  const { width } = useViewportSize();
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    const id = requestAnimationFrame(open);
    return () => cancelAnimationFrame(id);
  }, []);

  if (width <= 720 && useDrawerOnSmallScreen) {
    return (
      <Drawer
        opened={opened}
        onClose={close}
        onExitTransitionEnd={onClose}
        position="right"
        title={title}
      >
        <ModalComponent />
      </Drawer>
    );
  }
  return (
    <Modal
      opened={opened}
      onClose={close}
      onExitTransitionEnd={onClose}
      title={title}
      size="70%"
      centered
    >
      <ModalComponent />
    </Modal>
  );
}
