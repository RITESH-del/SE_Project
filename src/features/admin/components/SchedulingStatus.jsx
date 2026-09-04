import { Paper, Text, Stack } from '@mantine/core';
import ProgressCard from './ProgressCard';

export default function SchedulingStatus({ items }) {
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
        {/* <Text fw={600} size="lg">
          Scheduling Status
        </Text> */}

        {items.map((item) => (
          <ProgressCard
            key={item.title}
            {...item}
          />
        ))}
      </Stack>
    </Paper>
  );
}