import type { Route } from "./+types/settings";
import Settings from "~/components/Settings";
import { useNavigate } from "react-router";
import BaseModal from "~/components/Modal/BaseModal";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "React Router + Mantine Demo" },
    { name: "description", content: "React Router + Mantine Demo" },
  ];
}

export async function loader() {
  return true;
}

export default function SettingsPage() {
  const navigate = useNavigate();

  return (
    <BaseModal
      ModalComponent={Settings}
      onClose={() => navigate("/", { replace: true })}
      useDrawerOnSmallScreen
      title="Settings"
    />
  );
}
