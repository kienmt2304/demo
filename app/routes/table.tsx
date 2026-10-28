import { Container } from "@mantine/core";
import Table from "~/components/Table";
import type { Route } from "./+types/table";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Mantine Table Demo" },
    { name: "description", content: "Mantine Table Demo" },
  ];
}

export default function TablePage() {
  return <Table />;
}
