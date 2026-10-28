import { Box, Text } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useLocalStorage } from "@mantine/hooks";
import dayjs from "dayjs";
import { BOOKING_WINDOW_DAYS, isDateExcluded } from "~/service/booking";

export default function Date() {
  const [date, setDate] = useLocalStorage<string | null>({
    key: "booking:date",
    defaultValue: null,
  });
  const [, setTime] = useLocalStorage<string | null>({
    key: "booking:time",
    defaultValue: null,
  });
  return (
    <Box>
      <Text fw={500} size="sm" mb={6}>
        Date
      </Text>
      <DatePicker
        value={date}
        onChange={(value) => {
          setDate(value);
          setTime(null);
        }}
        minDate={dayjs().format("YYYY-MM-DD")}
        maxDate={dayjs().add(BOOKING_WINDOW_DAYS, "day").format("YYYY-MM-DD")}
        excludeDate={isDateExcluded}
      />
      <Text size="xs" c="dimmed" mt={6}>
        Weekends and fully booked days are unavailable.
      </Text>
    </Box>
  );
}
