import { Container } from "@mantine/core";
import { AnalyticsDashboard } from "~/components/Analytics";

export default function AnalyticsPage() {
  return (
    <Container size="lg" py="md">
      <AnalyticsDashboard />
    </Container>
  );
}
