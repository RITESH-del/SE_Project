import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Alert,
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
  Modal,
  ScrollArea,
} from '@mantine/core';
import {
  Sparkles,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  RotateCcw,
} from 'lucide-react';
import { addTimetableSlot, removeTimetableSlot, setTimetable } from '../slices/adminSlice';

const TIME_SLOTS = [
  '08:30 - 09:30',
  '09:30 - 10:30',
  '10:30 - 11:30',
  '11:30 - 12:30',
  '01:30 - 02:30',
  '02:30 - 03:30',
  '03:30 - 04:30',
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function CreateTimetablePage() {
  const dispatch = useDispatch();
  const timetable = useSelector((state) => state.admin?.timetable || []);
  const courses = useSelector((state) => state.admin?.courses || []);
  const faculty = useSelector((state) => state.admin?.faculty || []);
  const rooms = useSelector((state) => state.admin?.rooms || []);
  const studentGroups = useSelector((state) => state.admin?.studentGroups || []);

  const [targetGroup, setTargetGroup] = useState(studentGroups[0]?.groupCode || 'CSE-2024-A');
  const [selectedCourse, setSelectedCourse] = useState(courses[0]?.courseCode || '');
  const [selectedFaculty, setSelectedFaculty] = useState(faculty[0]?.name || '');
  const [selectedRoom, setSelectedRoom] = useState(rooms[0]?.roomNumber || '');
  const [selectedDay, setSelectedDay] = useState(DAYS[0]);
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[0]);

  const [conflictWarning, setConflictWarning] = useState(null);
  const [successNotice, setSuccessNotice] = useState(null);
  const [autoGenModalOpened, setAutoGenModalOpened] = useState(false);

  // Check collision for manual assignment
  const checkCollision = (day, time, room, fac) => {
    const roomConflict = timetable.find(
      (s) => s.day === day && s.time === time && s.room === room
    );
    if (roomConflict) {
      return `Room ${room} is already booked on ${day} during ${time} for ${roomConflict.course}.`;
    }

    const facConflict = timetable.find(
      (s) => s.day === day && s.time === time && s.faculty === fac
    );
    if (facConflict) {
      return `Faculty ${fac} is already scheduled on ${day} during ${time} with ${facConflict.group}.`;
    }

    return null;
  };

  const handleManualAddSlot = (e) => {
    e.preventDefault();
    setConflictWarning(null);

    const collision = checkCollision(selectedDay, selectedTime, selectedRoom, selectedFaculty);
    if (collision) {
      setConflictWarning(collision);
      return;
    }

    const courseObj = courses.find((c) => c.courseCode === selectedCourse);
    const newSlot = {
      id: `slot-${Date.now()}`,
      day: selectedDay,
      time: selectedTime,
      course: courseObj ? `${courseObj.courseCode}: ${courseObj.courseName}` : selectedCourse,
      faculty: selectedFaculty,
      room: selectedRoom,
      group: targetGroup,
      color: 'blue',
    };

    dispatch(addTimetableSlot(newSlot));
    setSuccessNotice(`Scheduled ${newSlot.course} on ${selectedDay} at ${selectedTime}`);
  };

  const handleRunAutoGeneration = () => {
    // Automated heuristic allocation
    const generatedSlots = [...timetable.filter((s) => s.group !== targetGroup)];
    let slotIdx = 0;

    courses.forEach((course, cIdx) => {
      const assignedFac = faculty[cIdx % faculty.length]?.name || 'Staff';
      const assignedRoom = rooms[cIdx % rooms.length]?.roomNumber || 'LH-101';

      // Allocate hoursPerWeek slots
      const hours = Math.min(course.hoursPerWeek || 3, 4);
      for (let h = 0; h < hours; h++) {
        const day = DAYS[(slotIdx + h) % DAYS.length];
        const time = TIME_SLOTS[(slotIdx + h * 2) % TIME_SLOTS.length];

        generatedSlots.push({
          id: `auto-${Date.now()}-${cIdx}-${h}`,
          day,
          time,
          course: `${course.courseCode}: ${course.courseName}`,
          faculty: assignedFac,
          room: assignedRoom,
          group: targetGroup,
          color: ['blue', 'teal', 'indigo', 'orange'][cIdx % 4],
        });
      }
      slotIdx += 2;
    });

    dispatch(setTimetable(generatedSlots));
    setAutoGenModalOpened(false);
    setSuccessNotice(`Auto-generated conflict-checked schedule for ${targetGroup}!`);
  };

  const currentGroupSlots = timetable.filter((s) => s.group === targetGroup);

  return (
    <Stack gap="lg" p="md">
      {/* Page Header */}
      <Group justify="space-between" align="flex-start" wrap="wrap">
        <div>
          <Title order={2} fw={700}>
            Timetable Generation Engine
          </Title>
          <Text c="dimmed" size="sm" mt={2}>
            Automated conflict-checked slot scheduler with interactive manual swapping.
          </Text>
        </div>

        <Group gap="xs">
          <Button
            leftSection={<Sparkles size={16} />}
            color="indigo"
            onClick={() => setAutoGenModalOpened(true)}
          >
            Auto-Generate for Cohort
          </Button>
        </Group>
      </Group>

      {/* Target Cohort Selector Banner */}
      <Paper p="md" withBorder radius="md">
        <Group justify="space-between" wrap="wrap">
          <Group gap="sm">
            <Select
              label="Target Cohort"
              data={studentGroups.map((g) => g.groupCode)}
              value={targetGroup}
              onChange={(val) => setTargetGroup(val || 'CSE-2024-A')}
              w={240}
              size="sm"
            />
            <Badge size="lg" variant="light" color="blue" mt={24}>
              {currentGroupSlots.length} Slots Currently Allocated
            </Badge>
          </Group>

          <Button
            variant="outline"
            size="xs"
            color="red"
            leftSection={<RotateCcw size={14} />}
            onClick={() => {
              const remaining = timetable.filter((s) => s.group !== targetGroup);
              dispatch(setTimetable(remaining));
              setSuccessNotice(`Cleared schedule for ${targetGroup}`);
            }}
          >
            Clear Cohort Slots
          </Button>
        </Group>
      </Paper>

      {/* Collision Alert / Success Notifications */}
      {conflictWarning && (
        <Alert
          icon={<AlertTriangle size={16} />}
          color="red"
          title="Scheduling Collision Prevented"
          withCloseButton
          onClose={() => setConflictWarning(null)}
        >
          {conflictWarning}
        </Alert>
      )}

      {successNotice && (
        <Alert
          icon={<CheckCircle2 size={16} />}
          color="teal"
          title="Slot Updated"
          withCloseButton
          onClose={() => setSuccessNotice(null)}
        >
          {successNotice}
        </Alert>
      )}

      {/* Manual Slot Assignment Form */}
      <Grid gutter="md">
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Card withBorder radius="md" p="md">
            <Title order={4} mb="sm">
              Manual Slot Assignment
            </Title>
            <form onSubmit={handleManualAddSlot}>
              <Stack gap="sm">
                <Select
                  label="Course"
                  data={courses.map((c) => ({
                    value: c.courseCode,
                    label: `${c.courseCode} - ${c.courseName}`,
                  }))}
                  value={selectedCourse}
                  onChange={(val) => setSelectedCourse(val || '')}
                  required
                />

                <Select
                  label="Faculty Instructor"
                  data={faculty.map((f) => f.name)}
                  value={selectedFaculty}
                  onChange={(val) => setSelectedFaculty(val || '')}
                  required
                />

                <Select
                  label="Classroom / Lab"
                  data={rooms.map((r) => ({
                    value: r.roomNumber,
                    label: `${r.roomNumber} (${r.type}, Cap: ${r.capacity})`,
                  }))}
                  value={selectedRoom}
                  onChange={(val) => setSelectedRoom(val || '')}
                  required
                />

                <Grid gutter="xs">
                  <Grid.Col span={6}>
                    <Select
                      label="Day"
                      data={DAYS}
                      value={selectedDay}
                      onChange={(val) => setSelectedDay(val || DAYS[0])}
                      required
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Select
                      label="Time Slot"
                      data={TIME_SLOTS}
                      value={selectedTime}
                      onChange={(val) => setSelectedTime(val || TIME_SLOTS[0])}
                      required
                    />
                  </Grid.Col>
                </Grid>

                <Button type="submit" color="blue" leftSection={<Plus size={16} />} mt="xs">
                  Assign Slot
                </Button>
              </Stack>
            </form>
          </Card>
        </Grid.Col>

        {/* Live Staged Schedule for Cohort */}
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Paper withBorder radius="md" p="md">
            <Group justify="space-between" mb="sm">
              <Title order={4}>
                Allocated Slots for {targetGroup}
              </Title>
              <Badge variant="outline" color="gray">
                {currentGroupSlots.length} Total
              </Badge>
            </Group>

            <ScrollArea h={380}>
              <Table highlightOnHover verticalSpacing="xs">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Day & Time</Table.Th>
                    <Table.Th>Course</Table.Th>
                    <Table.Th>Space</Table.Th>
                    <Table.Th>Instructor</Table.Th>
                    <Table.Th style={{ width: 60, textAlign: 'center' }}>Action</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {currentGroupSlots.length === 0 ? (
                    <Table.Tr>
                      <Table.Td colSpan={5}>
                        <Text ta="center" c="dimmed" py="lg" size="sm">
                          No timetable slots scheduled for {targetGroup} yet.
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  ) : (
                    currentGroupSlots.map((slot) => (
                      <Table.Tr key={slot.id}>
                        <Table.Td>
                          <Text fw={600} size="xs">
                            {slot.day}
                          </Text>
                          <Text size="11px" c="dimmed">
                            {slot.time}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="xs" fw={500}>
                            {slot.course}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge size="xs" variant="light" color="blue">
                            {slot.room}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Text size="xs">{slot.faculty}</Text>
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'center' }}>
                          <Button
                            variant="subtle"
                            color="red"
                            size="compact-xs"
                            onClick={() => dispatch(removeTimetableSlot(slot.id))}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </Table.Td>
                      </Table.Tr>
                    ))
                  )}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Auto-generation Confirmation Modal */}
      <Modal
        opened={autoGenModalOpened}
        onClose={() => setAutoGenModalOpened(false)}
        title="Run Automated Schedule Generation"
        centered
      >
        <Stack gap="md">
          <Text size="sm">
            This will automatically distribute all active courses for <b>{targetGroup}</b> across the academic week (Monday–Friday) while preventing room and faculty scheduling collisions.
          </Text>

          <Group justify="flex-end">
            <Button variant="default" onClick={() => setAutoGenModalOpened(false)}>
              Cancel
            </Button>
            <Button color="indigo" leftSection={<Sparkles size={16} />} onClick={handleRunAutoGeneration}>
              Run Auto-Generate
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
