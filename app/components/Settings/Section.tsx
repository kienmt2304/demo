import { Box, Text } from "@mantine/core";
import type { ReactNode } from "react";

type SectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function Section({
  title,
  description,
  children,
}: SectionProps) {
  return (
    <Box>
      <Text pb={4} fw={600}>
        {title}
      </Text>
      {description ? (
        <Text pb={8} fz={14}>
          {description}
        </Text>
      ) : null}
      {children}
    </Box>
  );
}
