import {
  Box,
  Button,
  RangeSlider,
  SegmentedControl,
  Stack,
  Switch,
  Text,
  Title,
} from "@mantine/core";
import classes from "./settings.module.css";
import { notifications } from "@mantine/notifications";
import { useCallback } from "react";
import { formatHour, useSettings } from "@demo/shared";
import Section from "./Section";

const awaitedPromise = (success = true) => {
  const delay = 1000 * (1 + Math.random());
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (success) {
        resolve("Resolved");
      } else reject("Rejected");
    }, delay);
  });
};

export default function NotificationSettings() {
  const [settings, updateSettings] = useSettings(true);
  const save = useCallback((success = true) => {
    notifications.promise(awaitedPromise(success), {
      loading: {
        title: "Loading",
        message: "Awaiting promise",
      },
      success: {
        title: "Success",
        message: "Promise success",
      },
      error: {
        title: "Error",
        message: "Promise error",
      },
    });
  }, []);

  return (
    <Stack px="xl" pb={16}>
      <Title order={3}>Notifications</Title>
      <Switch
        label="Email notifications"
        checked={settings.emailNotifications}
        onChange={(event) =>
          updateSettings({ emailNotifications: event.currentTarget.checked })
        }
      />
      <Section
        title="Email digest"
        description="Summary of activity you missed"
      >
        <SegmentedControl
          fullWidth
          disabled={!settings.emailNotifications}
          value={settings.digest}
          onChange={(value) => updateSettings({ digest: value })}
          styles={{
            label: {
              padding: 8,
            },
          }}
          data={[
            { label: "Daily", value: "daily" },
            { label: "Weekly", value: "weekly" },
            { label: "Never", value: "never" },
          ]}
        />
      </Section>
      <Switch
        label="Push notifications"
        checked={settings.pushNotification}
        onChange={(event) => {
          notifications.clean();
          updateSettings({ pushNotification: event.currentTarget.checked });
        }}
      />
      <Box className={classes.section}>
        <Button
          onClick={() =>
            notifications.show({
              title: "Notification",
              message: "Test notification",
            })
          }
        >
          Test notification
        </Button>
        <Button onClick={() => save(true)}>Success notification</Button>
        <Button onClick={() => save(false)}>Failed notification</Button>
      </Box>
      <Section
        title="Delivery window"
        description={`Between ${formatHour(settings.deliveryHours?.[0] ?? 8)} and ${formatHour(settings.deliveryHours?.[1] ?? 18)}`}
      >
        <RangeSlider
          min={0}
          max={24}
          minRange={1}
          value={settings.deliveryHours ?? [8, 18]}
          onChange={(value) => {
            updateSettings({ deliveryHours: value });
          }}
          label={formatHour}
          marks={[0, 6, 12, 18, 24].map((value) => ({
            value,
            label: formatHour(value),
          }))}
          mb="lg"
        />
      </Section>
    </Stack>
  );
}
