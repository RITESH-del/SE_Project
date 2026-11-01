import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

import {
  Paper,
  Text,
  Stack,
  useMantineTheme,
} from '@mantine/core';

export default function BarChart({
  title,
  data = [],
  xKey,
  dataKey,
  xLabel,
  yLabel,
}) {
  const theme = useMantineTheme();
  const barColor = theme.colors?.blue?.[6] || '#228be6';

  return (
    <Paper p="md" m="xs" withBorder radius="md">
      <Stack gap="md">
        {title && (
          <Text fw={600} size="lg">
            {title}
          </Text>
        )}

        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={data}
              margin={{
                top: 10,
                right: 20,
                left: 10,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey={xKey}
                tick={{ fontSize: 12 }}
                label={
                  xLabel
                    ? {
                        value: xLabel,
                        position: 'insideBottom',
                        offset: -10,
                      }
                    : undefined
                }
              />

              <YAxis
                allowDecimals={false}
                label={
                  yLabel
                    ? {
                        value: yLabel,
                        angle: -90,
                        position: 'insideLeft',
                      }
                    : undefined
                }
              />

              <Tooltip />

              <Bar
                dataKey={dataKey}
                fill={barColor}
                maxBarSize={20}
                radius={[4, 4, 0, 0]}
              />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </Stack>
    </Paper>
  );
}
