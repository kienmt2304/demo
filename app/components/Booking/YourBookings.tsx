import {
  ActionIcon,
  Card,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useState } from "react";
import { ConfirmDeleteModal } from "~/components/Modal/ConfirmDeleteModal";
import { formatDate, formatRange, type Booking } from "~/service/booking";

export default function YourBookings() {
  const [bookings, setBookings] = useLocalStorage<Booking[]>({
    key: "booking:booking",
    defaultValue: [],
  });
  const [pendingDelete, setPendingDelete] = useState<Booking | null>(null);

  const cancelBooking = (booking: Booking) => {
    setBookings((current) => current.filter((b) => b.id !== booking.id));
    notifications.show({
      color: "red",
      title: "Booking cancelled",
      message: `${booking.service.label} on ${formatDate(booking.date)} was released.`,
    });
  };

  return (
    <Paper withBorder p="md">
      <Title order={5} mb="sm">
        Upcoming ({bookings.length})
      </Title>
      {bookings.length === 0 ? (
        <Text size="sm" c="dimmed">
          No bookings yet.
        </Text>
      ) : (
        <Stack gap="xs">
          {bookings.map((booking) => (
            <Card key={booking.id} withBorder padding="xs">
              <Group justify="space-between" wrap="nowrap">
                <div>
                  <Text size="sm" fw={500}>
                    {booking.service.label}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {dayjs(booking.date).format("ddd, MMM D")} ·{" "}
                    {formatRange(
                      booking.date,
                      booking.time,
                      booking.service.minutes,
                    )}
                  </Text>
                </div>
                <Tooltip label="Cancel booking">
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    aria-label="Cancel booking"
                    onClick={() => setPendingDelete(booking)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Card>
          ))}
        </Stack>
      )}

      <ConfirmDeleteModal
        opened={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) cancelBooking(pendingDelete);
          setPendingDelete(null);
        }}
        title="Cancel booking"
        confirmLabel="Cancel booking"
      >
        {pendingDelete && (
          <Text size="sm">
            Cancel <b>{pendingDelete.service.label}</b> on{" "}
            {formatDate(pendingDelete.date)} at{" "}
            {formatRange(
              pendingDelete.date,
              pendingDelete.time,
              pendingDelete.service.minutes,
            )}
            ? This cannot be undone.
          </Text>
        )}
      </ConfirmDeleteModal>
    </Paper>
  );
}
