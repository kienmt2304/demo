import {
  ActionIcon,
  Box,
  Button,
  Container,
  Text,
  Title,
  UnstyledButton,
  useMantineColorScheme,
} from "@mantine/core";
import classes from "./header.module.css";
import { useEventListener } from "@mantine/hooks";
import useNavigate from "~/hooks/useNavigate";
import {
  IconBrandReact,
  IconMoon,
  IconSearch,
  IconSun,
} from "@tabler/icons-react";
import { CommandKey as Command } from "@demo/shared";
import { spotlight } from "@mantine/spotlight";
import { useMemo } from "react";

export default function Header() {
  const navigate = useNavigate();
  const logoRef = useEventListener("click", () => navigate("/"));
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const light = useMemo(() => colorScheme === "light", [colorScheme]);

  return (
    <Box
      size="100vw"
      pos="fixed"
      top={0}
      left={0}
      right={0}
      h={60}
      bg="var(--mantine-color-body)"
      className={classes.container}
    >
      <Container className={classes.navbar} size="90rem">
        <Box>
          <Button
            component={() => (
              <Box className={classes.logo} ref={logoRef}>
                <IconBrandReact size={40} color="#61DBFB" />
                <Title order={2} pl="1rem">
                  React Router + Mantine Demo
                </Title>
              </Box>
            )}
          />
        </Box>
        <Box className={classes.rightnav}>
          <UnstyledButton
            className={classes.trigger}
            onClick={spotlight.open}
            aria-label="Open command palette"
          >
            <IconSearch size={16} stroke={1.5} />
            <Text className={classes.label}>Search…</Text>
            <Command modifiers={["meta"]} command="K" />
          </UnstyledButton>
          <ActionIcon
            variant="default"
            onClick={() => setColorScheme(light ? "dark" : "light")}
            size="lg"
          >
            {light ? <IconSun size={20} /> : <IconMoon size={20} />}
          </ActionIcon>
        </Box>
      </Container>
    </Box>
  );
}
