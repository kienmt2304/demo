import { Link, Outlet } from "react-router";
import type { Route } from "./+types/home";
import {
  Badge,
  Card,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { PAGES } from "~/const";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "React Router + Mantine Demo" },
    { name: "description", content: "React Router + Mantine Demo" },
  ];
}

export default function Home() {
  return (
    <>
      <Container size="lg" py="md">
        <Stack gap={4} mb="xl">
          <Title order={1}>React Router + Mantine Demo</Title>
        </Stack>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
          {PAGES.map((demo) => (
            <Card
              key={demo.link}
              component={Link}
              to={demo.link}
              withBorder
              padding="lg"
            >
              <Group justify="space-between" mb="xs">
                <Text fw={600}>{demo.title}</Text>
                <Badge variant="light">#{demo.number}</Badge>
              </Group>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
      <Outlet />
    </>
  );
}
