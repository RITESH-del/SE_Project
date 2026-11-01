import { Paper, Stack, Text } from '@mantine/core';
import ProgressCard from './ProgressCard';

export default function SchedulingStatus({ title = 'Scheduling Status', items = [] }) {
  return (
    <Paper
      p="lg"
      m="sm"
      withBorder
      radius="md"
      w="100%"
      h="auto"
    >
      <Stack gap="lg">
        {title && (
          <Text fw={600} size="lg">
            {title}
          </Text>
        )}

        {items.map((item, index) => (
          <ProgressCard
            key={item.title || index}
            {...item}
          />
        ))}
      </Stack>
    </Paper>
  );
}
