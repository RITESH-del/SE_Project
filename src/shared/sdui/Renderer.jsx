import { Grid, Stack } from '@mantine/core';

import { StatsGroup } from '../../features/admin/components/StatsGroup';
import PieChart from '../../features/admin/components/PieChart';
import BarChart from '../../features/admin/components/BarChart';
import ProgressCard from '../../features/admin/components/ProgressCard';
import SchedulingStatus from '../../features/admin/components/schedulingStatus';
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

  // Layout: row
  if (item.type === 'row') {
  return (
    <Grid key={`row-${index}`} gutter="md">
      {item.data.children.map((child, childIndex) => (
        <Grid.Col
          key={`${child.type}-${childIndex}`}
          span={{
            base: 12,
            md: child.span ?? 4,
          }}
        >
          {renderComponent(child, childIndex)}
        </Grid.Col>
      ))}
    </Grid>
  );
}

  // Normal component
  const Component = componentRegistry[item.type];

  if (!Component) {
    console.warn(`Unknown dashboard component: ${item.type}`);
    return null;
  }

  return (
    <Component
      key={`${item.type}-${index}`}
      {...item.data}
    />
  );
}

export default function DashboardRenderer({
  components = [],
}) {
  return (
    <Stack gap="md">
      {components.map((item, index) =>
        renderComponent(item, index)
      )}
    </Stack>
  );
}