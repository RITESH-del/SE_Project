import { Badge, Group, Paper, Progress, Stack, Text } from '@mantine/core';

export default function ProgressCard({
  title,
  current,
  total,
  value,
  description,
  status,
}) {
  const isProgress = total !== undefined && total !== null;
  const percentage = isProgress && total > 0
    ? Math.min(100, Math.max(0, Math.round(((current || 0) / total) * 100)))
    : 0;

  const statusColor = status === 'warning' ? 'yellow' : status === 'error' ? 'red' : 'blue';

  return (
    <Paper w="100%">
      <Stack gap="sm">
        <Group justify="space-between">
          <Text fw={600} size="md">
            {title}
          </Text>

          {isProgress ? (
            <Text fw={700} size="md">
              {percentage}%
            </Text>
          ) : value !== undefined && value !== null ? (
            <Badge color={statusColor} variant="light" size="md">
              {value}
            </Badge>
          ) : null}
        </Group>

        {isProgress && (
          <Progress
            value={percentage}
            size="xs"
            radius="xl"
            color={percentage === 100 ? 'teal' : 'blue'}
          />
        )}

        <Group justify="space-between">
          {isProgress && (
            <Text size="xs" c="dimmed">
              {current ?? 0} of {total}
            </Text>
          )}

          {description && (
            <Text size="xs" c="dimmed">
              {description}
            </Text>
          )}
        </Group>
      </Stack>
    </Paper>
  );
}
