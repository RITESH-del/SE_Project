import { useState, useMemo } from 'react';
import cx from 'clsx';
import {
  Badge,
  Group,
  Paper,
  Progress,
  ScrollArea,
  Table,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import classes from './TableScrollArea.module.css';

function getBadgeColor(value, configuredColor) {
  if (configuredColor) return configuredColor;
  if (typeof value !== 'string') return 'blue';
  const lower = value.toLowerCase();
  if (lower.includes('complete') || lower.includes('active') || lower.includes('success')) return 'teal';
  if (lower.includes('progress') || lower.includes('pending')) return 'blue';
  if (lower.includes('attention') || lower.includes('warning')) return 'orange';
  if (lower.includes('danger') || lower.includes('error') || lower.includes('fail')) return 'red';
  return 'blue';
}

function renderCell(value, format) {
  switch (format?.type) {
    case 'progress': {
      const numValue = Number(value) || 0;
      return (
        <Group gap="sm" wrap="nowrap">
          <Progress
            value={numValue}
            w={100}
            size="sm"
            radius="xl"
            color={numValue === 100 ? 'teal' : 'blue'}
          />
          <Text size="sm" fw={500} w={40}>
            {numValue}%
          </Text>
        </Group>
      );
    }

    case 'badge':
      return (
        <Badge
          variant="light"
          color={getBadgeColor(value, format.color)}
        >
          {value ?? '-'}
        </Badge>
      );

    default:
      return value ?? '-';
  }
}

export function DataTable({ title, columns = [], rows = [] }) {
  const [scrolled, setScrolled] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const handleSort = (columnKey) => {
    if (sortBy === columnKey) {
      setReverseSortDirection((prev) => !prev);
    } else {
      setSortBy(columnKey);
      setReverseSortDirection(false);
    }
  };

  const sortedRows = useMemo(() => {
    if (!sortBy) return rows;

    return [...rows].sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];

      if (valA === valB) return 0;
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;

      const comparison =
        typeof valA === 'number' && typeof valB === 'number'
          ? valA - valB
          : String(valA).localeCompare(String(valB), undefined, { numeric: true });

      return reverseSortDirection ? -comparison : comparison;
    });
  }, [rows, sortBy, reverseSortDirection]);

  return (
    <Paper p="sm" m="sm" withBorder radius="md">
      {title && (
        <Text fw={600} size="lg" mb="sm">
          {title}
        </Text>
      )}

      <ScrollArea
        h={350}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      >
        <Table
          highlightOnHover
          verticalSpacing="sm"
          miw={700}
        >
          <Table.Thead
            className={cx(classes.header, {
              [classes.scrolled]: scrolled,
            })}
          >
            <Table.Tr>
              {columns.map((column) => (
                <Table.Th key={column.key}>
                  <UnstyledButton
                    onClick={() => handleSort(column.key)}
                    style={{ width: '100%', cursor: 'pointer' }}
                  >
                    <Group justify="space-between" wrap="nowrap" gap="xs">
                      <Text fw={600} size="sm">
                        {column.label}
                      </Text>
                      {sortBy === column.key ? (
                        reverseSortDirection ? (
                          <ArrowDown size={14} />
                        ) : (
                          <ArrowUp size={14} />
                        )
                      ) : (
                        <ArrowUpDown size={14} opacity={0.3} />
                      )}
                    </Group>
                  </UnstyledButton>
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {sortedRows.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={Math.max(columns.length, 1)}>
                  <Text ta="center" c="dimmed" py="md">
                    No data available
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              sortedRows.map((row, rowIndex) => (
                <Table.Tr key={row.id ? `${row.id}-${rowIndex}` : rowIndex}>
                  {columns.map((column) => (
                    <Table.Td key={column.key}>
                      {renderCell(row[column.key], column.format)}
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Paper>
  );
}

export { DataTable as TableSort };
export default DataTable;
