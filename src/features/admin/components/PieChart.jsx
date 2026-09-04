import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { Paper, Text, Stack, useMantineTheme } from '@mantine/core';

export default function PieChart({ title, data }) {
  const theme = useMantineTheme();

  const colors = [
    theme.colors.blue[6],
    theme.colors.green[6],
    theme.colors.orange[6],
    theme.colors.red[6],
    theme.colors.violet[6],
  ];

  return (
    <Paper p="md" m="xs" withBorder radius="md">
      <Stack gap="md">
        <Text fw={600} size="lg">
          {title}
        </Text>

        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={80}
                paddingAngle={2}
                label
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>

              <Tooltip />

              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </Stack>
    </Paper>
  );
}