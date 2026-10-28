import { Grid } from "@mantine/core";
import { Outlet } from "react-router";
import Navbar from "~/components/Navbar";

export default function NavLayout() {
  return (
    <Grid
      display={"flex"}
      flex={1}
      styles={{ root: { flexDirection: "column" }, inner: { height: "100%" } }}
      w="100vw"
      gap={0}
    >
      <Grid.Col span={2}>
        <Navbar />
      </Grid.Col>
      <Grid.Col span={10}>
        <Outlet />
      </Grid.Col>
    </Grid>
  );
}
