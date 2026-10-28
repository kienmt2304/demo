import { Box, SegmentedControl, Text } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { services } from "~/service/booking";

export default function Service() {
  const [serviceValue, setServiceValue] = useLocalStorage({
    key: "booking:serviceValue",
    defaultValue: services[1].value,
  });
  return (
    <Box>
      <Text fw={500} size="sm" mb={6}>
        Service
      </Text>
      <SegmentedControl
        fullWidth
        value={serviceValue}
        onChange={(value) => {
          setServiceValue(value);
          const next = services.find((s) => s.value === value)!;
          notifications.show({
            title: next.label,
            message: `${next.minutes} minutes · ${next.price ? `$${next.price}` : "free"}`,
          });
        }}
        data={services.map((s) => ({
          value: s.value,
          label: `${s.label} · ${s.minutes}m`,
        }))}
      />
    </Box>
  );
}
