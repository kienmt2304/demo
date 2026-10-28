import {
  ColorInput,
  SegmentedControl,
  Slider,
  Stack,
  Title,
  type MantineColorScheme,
  type MantineRadius,
} from "@mantine/core";
import {
  Marks,
  ScaleOptions,
  accentSwatches,
  transformNumberToRadius,
  transformPxToScale,
  transformRadiusToNumber,
  transformScaleToPx,
  useSettings,
} from "@demo/shared";
import Section from "./Section";

export default function AppearanceSettings() {
  const [settings, updateSettings] = useSettings(true);

  return (
    <Stack px="xl" pb={16}>
      <Title order={3}>Appearance</Title>
      <Section title="Color scheme" description="Applies to the whole app">
        <SegmentedControl
          fullWidth
          value={settings.colorScheme}
          onChange={(value) => {
            updateSettings({ colorScheme: value as MantineColorScheme });
          }}
          styles={{
            label: {
              padding: 8,
            },
          }}
          data={[
            { label: "Light", value: "light" },
            { label: "Dark", value: "dark" },
            { label: "System", value: "auto" },
          ]}
        />
      </Section>
      <ColorInput
        label="Accent color"
        description="Used for buttons, badges and links"
        value={settings.primaryColor}
        onChange={(value) => updateSettings({ primaryColor: value })}
        swatches={accentSwatches}
        swatchesPerRow={10}
        format="hex"
      />
      <Section
        title="Border radius"
        description={`${2 ** transformRadiusToNumber(settings.defaultRadius)}px`}
      >
        <Slider
          defaultValue={transformRadiusToNumber(settings.defaultRadius)}
          onChange={(value) => {
            updateSettings({
              defaultRadius: transformNumberToRadius(value),
            });
          }}
          marks={Marks}
          restrictToMarks
          mb="lg"
          scale={(v) => 2 ** v}
          min={1}
          max={5}
        />
      </Section>
      <Section
        title="Font size"
        description={`${transformScaleToPx(settings.scale)}px`}
      >
        <Slider
          min={8}
          max={32}
          step={4}
          defaultValue={transformScaleToPx(settings.scale)}
          onChange={(value) =>
            updateSettings({ scale: transformPxToScale(value) })
          }
          marks={ScaleOptions}
          restrictToMarks
          mb="lg"
        />
      </Section>
    </Stack>
  );
}
