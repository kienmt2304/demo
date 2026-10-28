import { Alert, Box, Text } from "@mantine/core";
import { TimeGrid } from "@mantine/dates";
import { useLocalStorage } from "@mantine/hooks";
import { IconInfoCircle } from "@tabler/icons-react";
import { allSlots, unavailableSlots, type Booking } from "~/service/booking";

export default function Time() {
  const [date] = useLocalStorage<string | null>({
    key: "booking:date",
    defaultValue: null,
  });
  const [time, setTime] = useLocalStorage<string | null>({
    key: "booking:time",
    defaultValue: null,
  });
  const [bookings] = useLocalStorage<Booking[]>({
    key: "booking:booking",
    defaultValue: [],
  });

  const disabledSlots = date ? unavailableSlots(date, bookings) : [];
  const freeCount = allSlots.length - disabledSlots.length;
  return (
    <Box style={{ flex: 1, minWidth: 260 }}>
      <Text fw={500} size="sm" mb={6}>
        Time{" "}
        {date && (
          <Text span c="dimmed" size="xs">
            · {freeCount} slots free
          </Text>
        )}
      </Text>
      {date ? (
        freeCount > 0 ? (
          <TimeGrid
            data={allSlots}
            value={time}
            onChange={setTime}
            disableTime={disabledSlots}
            format="12h"
            allowDeselect
            simpleGridProps={{
              cols: { base: 2, xs: 3 },
              spacing: "xs",
            }}
          />
        ) : (
          <Alert icon={<IconInfoCircle size={16} />} color="yellow">
            No free slots left on this day. Try another date.
          </Alert>
        )
      ) : (
        <Text size="sm" c="dimmed">
          Pick a date to see available times.
        </Text>
      )}
    </Box>
  );
}
