import {
  ActionIcon,
  Tooltip,
  type FloatingPosition,
  type MantineStyleProps,
} from "@mantine/core";
import type { IconProps } from "@tabler/icons-react";

type ActionButtonProps = MantineStyleProps & {
  tooltip?: string;
  focused?: boolean;
  onClick: (e: React.MouseEvent<Element, MouseEvent>) => void;
  Icon: React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >;
  iconSize?: number;
  size?: number;
  tooltipPosition?: FloatingPosition;
};

export default function ActionButton({
  tooltip,
  tooltipPosition = "right",
  focused = false,
  onClick,
  Icon,
  iconSize = 32,
  size = 40,
  ...props
}: ActionButtonProps) {
  const ActionItem = (
    <ActionIcon
      variant={focused ? "light" : "default"}
      bd={"none"}
      onClick={onClick}
      w={size}
      h={size}
      {...props}
    >
      <Icon size={iconSize} />
    </ActionIcon>
  );

  if (!!tooltip?.length) {
    return (
      <Tooltip {...props} label={tooltip} position={tooltipPosition}>
        {ActionItem}
      </Tooltip>
    );
  }

  return ActionItem;
}
