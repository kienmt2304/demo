import { Notifications } from "@mantine/notifications";
import { pushNotiSelector, useSettings } from "@demo/shared";

export default function NotificationProvider() {
  const [pushNotification] = useSettings(false, pushNotiSelector);
  return pushNotification ? <Notifications /> : null;
}
