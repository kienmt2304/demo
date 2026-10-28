import { Card, Skeleton, Stack } from "@mantine/core";

export default function LineChartSkeleton() {
  return (
    <Card withBorder padding="md" h="100%">
      <Stack gap={4} mb="md">
        <Skeleton h={16} w={120} radius="lg" />
        <Skeleton h={12} w={180} radius="lg" />
      </Stack>
      <Skeleton h={240} radius="md" />
    </Card>
  );
}
