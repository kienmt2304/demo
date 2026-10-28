import { Flex } from "@mantine/core";
import {
  IconFilePlus,
  IconFolderPlus,
  IconLibraryMinus,
} from "@tabler/icons-react";
import { ActionButton } from "@demo/shared";

const Actions = [
  {
    label: "New file...",
    Icon: IconFilePlus,
  },
  {
    label: "New Folder...",
    Icon: IconFolderPlus,
  },
  {
    label: "Collapse folders",
    Icon: IconLibraryMinus,
  },
];

export default function ActionMenu() {
  return (
    <Flex align="center" justify="flex-end" gap={2}>
      {Actions.map((action) => (
        <ActionButton
          tooltip={action.label}
          tooltipPosition="bottom"
          onClick={() => {}}
          Icon={action.Icon}
          size={16}
          iconSize={16}
          key={action.label}
        />
      ))}
    </Flex>
  );
}
