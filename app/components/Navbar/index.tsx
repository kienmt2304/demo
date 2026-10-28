import { Badge, NavLink, Stack } from "@mantine/core";
import { IconHome } from "@tabler/icons-react";
import { Link, useLocation, type Location } from "react-router";
import styles from "./navbar.module.css";
import { PAGES } from "~/const";
import MaskedLink from "../MaskedLink";

function findActiveRoute(location: Location) {
  if (location.mask) {
    return location.mask.pathname;
  }
  return location.pathname;
}

export default function Navbar() {
  const location = useLocation();
  return (
    <Stack className={styles.container} p="xs" gap="0">
      <NavLink
        component={Link}
        to="/"
        label="Back to Home"
        leftSection={<IconHome size={16} />}
      />
      {PAGES.map((page) => (
        <NavLink
          key={page.name}
          renderRoot={(props) =>
            page.mask ? (
              <MaskedLink mask={page.link} {...props} />
            ) : (
              <Link to={page.link} {...props} />
            )
          }
          label={page.title}
          active={findActiveRoute(location).startsWith(page.link)}
          leftSection={
            <Badge size="xs" variant="light" w={28} px={0}>
              {page.number}
            </Badge>
          }
        />
      ))}
    </Stack>
  );
}
