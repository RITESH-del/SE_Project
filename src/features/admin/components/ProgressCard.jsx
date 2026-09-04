import { Paper, Progress, Stack, Text, Group } from '@mantine/core';

export default function ProgressCard({
  title,
  current,
  total,
  description,
}) {
  const percentage = total > 0
    ? Math.round((current / total) * 100)
    : 0;

  return (
    <Paper w="100%"
    //  withBorder
    //  radius="md"
     >
      <Stack gap="sm">
        <Group justify="space-between">
          <Text fw={600} size="md">
            {title}
          </Text>

          <Text fw={700} size="md">
            {percentage}%
          </Text>
        </Group>

        <Progress
          value={percentage}
          size="xs"
          radius="xl"
        />

        <Group justify="space-between">
          <Text size="xs" c="dimmed">
            {current} of {total}
          </Text>

          <Text size="xs" c="dimmed">
            {description}
          </Text>
        </Group>
      </Stack>
    </Paper>
  );
}