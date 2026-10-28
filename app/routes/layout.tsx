import { Box, Container, Stack } from "@mantine/core";
import { Outlet, useLocation } from "react-router";
import Header from "~/components/Header";

export default function Layout() {
  return (
    <Box mih="100dvh">
      <Header />
      <Stack h="100dvh" pt={60}>
        <Outlet />
      </Stack>
    </Box>
  );
}
