import { Paper, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { hasLength, useForm } from "@mantine/form";
import { useLocalStorage } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import ConfirmModal from "~/components/Modal/ConfirmModal";
import { type Booking, formatDate, formatRange, services } from "~/service/booking";

type Props = {
  opened: boolean;
  onClose: () => void;
};

export default function ConfirmBookingModal({ opened, onClose }: Props) {
  const [serviceValue] = useLocalStorage({
    key: "booking:serviceValue",
    defaultValue: services[1].value,
  });
  const [date] = useLocalStorage<string | null>({
    key: "booking:date",
    defaultValue: null,
  });
  const [time, setTime] = useLocalStorage<string | null>({
    key: "booking:time",
    defaultValue: null,
  });
  const [, setBookings] = useLocalStorage<Booking[]>({
    key: "booking:booking",
    defaultValue: [],
  });

  const service = services.find((s) => s.value === serviceValue)!;

  const form = useForm({
    mode: "uncontrolled",
    initialValues: { name: "", notes: "" },
    validate: { name: hasLength({ min: 2 }, "Enter your name") },
  });

  const submit = form.onSubmit(({ name, notes }) => {
    if (!date || !time) return;
    const booking: Booking = {
      id: `${date}-${time}-${Date.now()}`,
      service,
      date,
      time,
      name,
      notes,
    };
    setBookings((current) =>
      [...current, booking].sort((a, b) =>
        `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`),
      ),
    );
    onClose();
    form.reset();
    setTime(null);
    notifications.show({
      color: "teal",
      icon: <IconCheck size={18} />,
      title: "Booking confirmed",
      message: `${service.label} on ${formatDate(date)} at ${formatRange(date, time, service.minutes)}`,
    });
  });

  return (
    <ConfirmModal
      opened={opened}
      onClose={onClose}
      title="Confirm booking"
      formId="confirm-booking-form"
      confirmLabel="Confirm booking"
      cancelLabel="Back"
    >
      {date && time && (
        <form id="confirm-booking-form" onSubmit={submit}>
          <Stack>
            <Paper withBorder p="sm" bg="var(--mantine-color-default-hover)">
              <Text fw={600}>{service.label}</Text>
              <Text size="sm">{formatDate(date)}</Text>
              <Text size="sm">
                {formatRange(date, time, service.minutes)}
              </Text>
            </Paper>
            <TextInput
              label="Your name"
              withAsterisk
              data-autofocus
              key={form.key("name")}
              {...form.getInputProps("name")}
            />
            <Textarea
              label="Notes"
              placeholder="Anything we should know?"
              autosize
              minRows={2}
              key={form.key("notes")}
              {...form.getInputProps("notes")}
            />
          </Stack>
        </form>
      )}
    </ConfirmModal>
  );
}
