import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  Badge,
  Button,
  Card,
  Grid,
  Group,
  Paper,
  Select,
  Stack,
  Table,
  Text,
  Title,
  Tooltip,
  ScrollArea,
} from '@mantine/core';
import {
  CalendarDays,
  Clock,
  Download,
  AlertTriangle,
  Building,
  User,
  Users,
  CheckCircle2,
} from 'lucide-react';
import * as XLSX from 'xlsx';

const TIME_SLOTS = [
  '08:30 - 09:30',
  '09:30 - 10:30',
  '10:30 - 11:30',
  '11:30 - 12:30',
  '12:30 - 01:30', // Recess / Lunch
  '01:30 - 02:30',
  '02:30 - 03:30',
  '03:30 - 04:30',
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function ViewTimetablePage() {
  const timetable = useSelector((state) => state.admin?.timetable || []);
  const studentGroups = useSelector((state) => state.admin?.studentGroups || []);
  const rooms = useSelector((state) => state.admin?.rooms || []);
  const faculty = useSelector((state) => state.admin?.faculty || []);

  const [selectedGroup, setSelectedGroup] = useState('All');
  const [selectedRoom, setSelectedRoom] = useState('All');
  const [selectedFaculty, setSelectedFaculty] = useState('All');

  // Filter slots
  const filteredSlots = useMemo(() => {
    return timetable.filter((slot) => {
      const matchGroup = selectedGroup === 'All' || slot.group === selectedGroup;
      const matchRoom = selectedRoom === 'All' || slot.room === selectedRoom;
      const matchFaculty = selectedFaculty === 'All' || slot.faculty === selectedFaculty;
      return matchGroup && matchRoom && matchFaculty;
    });
  }, [timetable, selectedGroup, selectedRoom, selectedFaculty]);

  // Conflict auditor: find duplicate faculty or duplicate room bookings in the same slot
  const conflicts = useMemo(() => {
    const map = {};
    const conflictIds = new Set();

    timetable.forEach((slot) => {
      const roomKey = `${slot.day}-${slot.time}-room-${slot.room}`;
      const facKey = `${slot.day}-${slot.time}-fac-${slot.faculty}`;

      if (map[roomKey]) {
        conflictIds.add(slot.id);
        conflictIds.add(map[roomKey]);
      } else {
        map[roomKey] = slot.id;
      }

      if (map[facKey]) {
        conflictIds.add(slot.id);
        conflictIds.add(map[facKey]);
      } else {
        map[facKey] = slot.id;
      }
    });

    return conflictIds;
  }, [timetable]);

  const handleExportSchedule = () => {
    const exportData = filteredSlots.map((s) => ({
      Day: s.day,
      Time: s.time,
      Course: s.course,
      Faculty: s.faculty,
      Room: s.room,
      'Student Group': s.group,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Master_Timetable');
    XLSX.writeFile(workbook, `Timetable_Schedule_${Date.now()}.xlsx`);
  };

  return (
    <Stack gap="lg" p="md">
      {/* Page Header */}
      <Group justify="space-between" align="flex-start" wrap="wrap">
        <div>
          <Title order={2} fw={700}>
            Master Timetable Grid
          </Title>
          <Text c="dimmed" size="sm" mt={2}>
            Comprehensive weekly time-slot schedule across academic cohorts, faculties, and lecture spaces.
          </Text>
        </div>

        <Button
          leftSection={<Download size={16} />}
          variant="default"
          size="sm"
          onClick={handleExportSchedule}
        >
          Export Master Schedule
        </Button>
      </Group>

      {/* Operational KPI Strip */}
      <Grid gutter="md">
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Paper p="sm" withBorder radius="md">
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" fw={600} tt="uppercase">
                  Total Allocated Slots
                </Text>
                <Text size="xl" fw={700}>
                  {timetable.length} Classes
                </Text>
              </div>
              <CalendarDays size={28} color="var(--mantine-color-blue-5)" />
            </Group>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Paper p="sm" withBorder radius="md">
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" fw={600} tt="uppercase">
                  Room Utilization
                </Text>
                <Text size="xl" fw={700}>
                  {new Set(timetable.map((t) => t.room)).size} of {rooms.length} Rooms Active
                </Text>
              </div>
              <Building size={28} color="var(--mantine-color-teal-5)" />
            </Group>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Paper p="sm" withBorder radius="md">
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" fw={600} tt="uppercase">
                  Collision Status
                </Text>
                <Text size="xl" fw={700} c={conflicts.size > 0 ? 'red' : 'teal'}>
                  {conflicts.size > 0 ? `${conflicts.size} Conflicts Flagged` : '0 Conflicts Detected'}
                </Text>
              </div>
              {conflicts.size > 0 ? (
                <AlertTriangle size={28} color="var(--mantine-color-red-5)" />
              ) : (
                <CheckCircle2 size={28} color="var(--mantine-color-teal-5)" />
              )}
            </Group>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Filters Toolbar */}
      <Paper p="md" withBorder radius="md">
        <Group justify="space-between" wrap="wrap" gap="md">
          <Group gap="sm" wrap="wrap">
            <Select
              label="Filter by Cohort"
              data={['All', ...studentGroups.map((g) => g.groupCode)]}
              value={selectedGroup}
              onChange={(val) => setSelectedGroup(val || 'All')}
              w={200}
              size="xs"
              leftSection={<Users size={14} />}
            />

            <Select
              label="Filter by Room"
              data={['All', ...rooms.map((r) => r.roomNumber)]}
              value={selectedRoom}
              onChange={(val) => setSelectedRoom(val || 'All')}
              w={180}
              size="xs"
              leftSection={<Building size={14} />}
            />

            <Select
              label="Filter by Faculty"
              data={['All', ...faculty.map((f) => f.name)]}
              value={selectedFaculty}
              onChange={(val) => setSelectedFaculty(val || 'All')}
              w={220}
              size="xs"
              leftSection={<User size={14} />}
            />
          </Group>

          <Button
            variant="subtle"
            size="xs"
            onClick={() => {
              setSelectedGroup('All');
              setSelectedRoom('All');
              setSelectedFaculty('All');
            }}
          >
            Reset Filters
          </Button>
        </Group>
      </Paper>

      {/* Weekly Matrix Grid Table */}
      <Paper p="sm" withBorder radius="md">
        <ScrollArea h={600}>
          <Table highlightOnHover verticalSpacing="sm" withTableBorder withColumnBorders>
            <Table.Thead style={{ backgroundColor: 'var(--mantine-color-dark-8, #111827)' }}>
              <Table.Tr>
                <Table.Th style={{ width: 130 }}>
                  <Group gap={4}>
                    <Clock size={14} />
                    <Text fw={700} size="xs" tt="uppercase">
                      Time / Day
                    </Text>
                  </Group>
                </Table.Th>
                {DAYS.map((day) => (
                  <Table.Th key={day} style={{ minWidth: 200, textAlign: 'center' }}>
                    <Text fw={700} size="xs" tt="uppercase">
                      {day}
                    </Text>
                  </Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {TIME_SLOTS.map((slotTime) => {
                const isLunchBreak = slotTime.includes('12:30');

                return (
                  <Table.Tr key={slotTime} style={isLunchBreak ? { backgroundColor: 'rgba(255, 255, 255, 0.03)' } : {}}>
                    <Table.Td style={{ verticalAlign: 'middle', fontWeight: 600, fontSize: '12px' }}>
                      {slotTime}
                    </Table.Td>

                    {isLunchBreak ? (
                      <Table.Td colSpan={DAYS.length} style={{ textAlign: 'center', color: 'var(--mantine-color-dimmed)' }}>
                        <Text size="xs" fw={600} letterSpacing="1px">
                          COMMON RECESS & LUNCH BREAK
                        </Text>
                      </Table.Td>
                    ) : (
                      DAYS.map((day) => {
                        const cellSlots = filteredSlots.filter(
                          (s) => s.day === day && s.time === slotTime
                        );

                        return (
                          <Table.Td key={`${day}-${slotTime}`} style={{ verticalAlign: 'top', height: 90, padding: 6 }}>
                            {cellSlots.length === 0 ? (
                              <div style={{ height: '100%', minHeight: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Text size="xs" c="dimmed" opacity={0.3}>
                                  Open Slot
                                </Text>
                              </div>
                            ) : (
                              cellSlots.map((slot) => {
                                const isConflict = conflicts.has(slot.id);

                                return (
                                  <Card
                                    key={slot.id}
                                    p="xs"
                                    radius="sm"
                                    withBorder
                                    style={{
                                      backgroundColor: isConflict ? 'rgba(239, 68, 68, 0.15)' : 'rgba(37, 99, 235, 0.12)',
                                      borderColor: isConflict ? 'var(--mantine-color-red-6)' : 'var(--mantine-color-blue-7)',
                                      marginBottom: 4,
                                    }}
                                  >
                                    <Stack gap={2}>
                                      <Group justify="space-between" wrap="nowrap">
                                        <Text fw={700} size="xs" truncate>
                                          {slot.course}
                                        </Text>
                                        {isConflict && (
                                          <Tooltip label="Collision: Double-booking detected">
                                            <AlertTriangle size={14} color="var(--mantine-color-red-5)" />
                                          </Tooltip>
                                        )}
                                      </Group>

                                      <Group justify="space-between" wrap="nowrap" gap={4}>
                                        <Badge size="xs" variant="filled" color={isConflict ? 'red' : 'blue'}>
                                          {slot.room}
                                        </Badge>
                                        <Badge size="xs" variant="outline" color="gray">
                                          {slot.group}
                                        </Badge>
                                      </Group>

                                      <Text size="11px" c="dimmed" truncate>
                                        {slot.faculty}
                                      </Text>
                                    </Stack>
                                  </Card>
                                );
                              })
                            )}
                          </Table.Td>
                        );
                      })
                    )}
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Paper>
    </Stack>
  );
}
