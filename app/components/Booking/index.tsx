import { Button, Grid, Group, Paper, Stack } from "@mantine/core";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import Service from "./Service";
import DateSection from "./Date";
import Time from "./Time";
import BookingInfo from "./BookingInfo";
import YourBookings from "./YourBookings";
import ConfirmBookingModal from "./ConfirmBookingModal";

export function Booking() {
  const [date] = useLocalStorage<string | null>({
    key: "booking:date",
    defaultValue: null,
  });
  const [time] = useLocalStorage<string | null>({
    key: "booking:time",
    defaultValue: null,
  });
  const [confirmOpened, confirm] = useDisclosure(false);

  return (
    <Grid gap="lg">
      <Grid.Col span={{ base: 12, md: 8 }}>
        <Paper withBorder p="md">
          <Stack>
            <Service />

            <Group align="flex-start" gap="xl" wrap="wrap">
              <DateSection />

              <Time />
            </Group>

            <Group justify="flex-end">
              <Button disabled={!date || !time} onClick={confirm.open}>
                Continue
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 4 }}>
        <Stack>
          <BookingInfo />

          <YourBookings />
        </Stack>
      </Grid.Col>

      <ConfirmBookingModal opened={confirmOpened} onClose={confirm.close} />
    </Grid>
  );
}
