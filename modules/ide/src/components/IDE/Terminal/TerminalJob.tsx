import { Box, Text } from "@mantine/core";
import type { TerminalJob as TerminalJobType } from "#service/IDE/type";

type TerminalJobProps = {
  job: TerminalJobType;
};

export default function TerminalJob({ job }: TerminalJobProps) {
  return (
    <Box>
      <Text>
        @User {job.dir} {">"} {job.command}
      </Text>
      <Text>{job.content}</Text>
    </Box>
  );
}
