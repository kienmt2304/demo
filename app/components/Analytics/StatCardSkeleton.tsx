import { Box, Card, Group, Skeleton, Stack } from "@mantine/core";

export default function StatCardSkeleton() {
  return (
    <Card withBorder padding="md">
      <Group justify="space-between" wrap="nowrap" align="flex-start">
        <Stack gap={5}>
          <Skeleton h={16} w={50} radius={"lg"} />
          <Skeleton h={24} w={120} radius={"lg"} />
          <Skeleton h={24} w={80} radius={"lg"} />
          <Skeleton h={16} w={60} radius={"lg"} />
        </Stack>
        <Skeleton circle h={60} w={60} />
      </Group>
    </Card>
  );
}
