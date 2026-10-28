import { Paper, Text, Timeline, Title } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import {
  IconCalendar,
  IconCheck,
  IconClock,
  IconListDetails,
} from "@tabler/icons-react";
import { formatDate, formatRange, services } from "~/service/booking";

export default function BookingInfo() {
  const [date] = useLocalStorage<string | null>({
    key: "booking:date",
    defaultValue: null,
  });
  const [time] = useLocalStorage<string | null>({
    key: "booking:time",
    defaultValue: null,
  });
  const [serviceValue] = useLocalStorage({
    key: "booking:serviceValue",
    defaultValue: services[1].value,
  });

  const step = time ? 2 : date ? 1 : 0;
  const service = services.find((s) => s.value === serviceValue)!;
  return (
    <Paper withBorder p="md">
      <Title order={5} mb="md">
        Your booking
      </Title>
      <Timeline active={step} bulletSize={26} lineWidth={2}>
        <Timeline.Item bullet={<IconListDetails size={14} />} title="Service">
          <Text size="xs" c="dimmed">
            {service.label} · {service.minutes} min
          </Text>
        </Timeline.Item>
        <Timeline.Item bullet={<IconCalendar size={14} />} title="Date">
          <Text size="xs" c="dimmed">
            {date ? formatDate(date) : "Not selected"}
          </Text>
        </Timeline.Item>
        <Timeline.Item bullet={<IconClock size={14} />} title="Time">
          <Text size="xs" c="dimmed">
            {date && time
              ? formatRange(date, time, service.minutes)
              : "Not selected"}
          </Text>
        </Timeline.Item>
        <Timeline.Item bullet={<IconCheck size={14} />} title="Confirm">
          <Text size="xs" c="dimmed">
            {service.price
              ? `$${service.price} due at the appointment`
              : "Free"}
          </Text>
        </Timeline.Item>
      </Timeline>
    </Paper>
  );
}
