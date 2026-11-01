import { Grid, Stack } from '@mantine/core';

import { StatsGroup } from '../../features/admin/components/StatsGroup';
import PieChart from '../../features/admin/components/PieChart';
import BarChart from '../../features/admin/components/BarChart';
import ProgressCard from '../../features/admin/components/ProgressCard';
import SchedulingStatus from '../../features/admin/components/SchedulingStatus';
import { DataTable } from '../components/TableSort';

const componentRegistry = {
  stats: StatsGroup,
  'pie-chart': PieChart,
  'bar-chart': BarChart,
  'progress': ProgressCard,
  'scheduling-status': SchedulingStatus,
  'table': DataTable,
};

function renderComponent(item, index) {
  if (!item || typeof item !== 'object') {
    return null;
  }

  // Layout: row
  if (item.type === 'row') {
    const children = Array.isArray(item.data?.children) ? item.data.children : [];
    return (
      <Grid key={`row-${index}`} gutter="md">
        {children.map((child, childIndex) => (
          <Grid.Col
            key={`${child?.type || 'col'}-${childIndex}`}
            span={{
              base: 12,
              md: child?.span ?? 4,
            }}
          >
            {renderComponent(child, childIndex)}
          </Grid.Col>
        ))}
      </Grid>
    );
  }

  // Leaf component
  const Component = componentRegistry[item.type];

  if (!Component) {
    console.warn(`Unknown dashboard component: ${item.type}`);
    return null;
  }

  const componentData = item.data && typeof item.data === 'object' ? item.data : {};

  return (
    <Component
      key={`${item.type}-${index}`}
      {...componentData}
    />
  );
}

export default function DashboardRenderer({ components = [] }) {
  if (!Array.isArray(components) || components.length === 0) {
    return null;
  }

  return (
    <Stack gap="md">
      {components.map((item, index) => renderComponent(item, index))}
    </Stack>
  );
}
