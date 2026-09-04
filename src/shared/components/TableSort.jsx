import { useState } from 'react';
import cx from 'clsx';
import {
  Badge,
  Group,
  Paper,
  Progress,
  ScrollArea,
  Table,
  Text,
} from '@mantine/core';
import classes from './TableScrollArea.module.css';


function renderCell(value, format) {
  switch (format?.type) {
    case 'progress':
      return (
        <Group gap="sm" wrap="nowrap">
          <Progress
            value={value}
            w={100}
            size="sm"
            radius="xl"
          />

          <Text size="sm" fw={500} w={40}>
            {value}%
          </Text>
        </Group>
      );

    case 'badge':
      return (
        <Badge
          variant="light"
          color={format.color ?? 'blue'}
        >
          {value}
        </Badge>
      );

    default:
      return value;
  }
}

export function DataTable({ title, columns, rows }) {
  const [scrolled, setScrolled] = useState(false);

  return (
    <Paper p="sm" m="sm" withBorder>
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
                  {column.label}
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {rows.map((row, rowIndex) => (
              <Table.Tr key={row.id ?? rowIndex}>
                {columns.map((column) => (
                  <Table.Td key={column.key}>
                    {renderCell(
                      row[column.key],
                      column.format
                    )}
                  </Table.Td>
                ))}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Paper>
  );
}