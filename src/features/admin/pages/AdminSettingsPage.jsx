import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Alert,
  Button,
  Grid,
  Group,
  MultiSelect,
  NumberInput,
  Paper,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import {
  Clock,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Save,
} from 'lucide-react';
import { updateSettings } from '../slices/adminSlice';

export default function AdminSettingsPage() {
  const dispatch = useDispatch();
  const currentSettings = useSelector((state) => state.admin?.settings || {});

  const [settings, setLocalSettings] = useState({
    academicYear: currentSettings.academicYear || '2024-2025',
    currentSemester: currentSettings.currentSemester || 'Even Semester (Spring)',
    workingDays: currentSettings.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    dayStartTime: currentSettings.dayStartTime || '08:30',
    dayEndTime: currentSettings.dayEndTime || '16:30',
    slotDurationMinutes: currentSettings.slotDurationMinutes || 60,
    lunchStartTime: currentSettings.lunchStartTime || '12:30',
    lunchDurationMinutes: currentSettings.lunchDurationMinutes || 60,
    maxDailyHoursPerFaculty: currentSettings.maxDailyHoursPerFaculty || 4,
    enforceCapacityBufferPercent: currentSettings.enforceCapacityBufferPercent || 10,
    preventConsecutiveLabs: currentSettings.preventConsecutiveLabs ?? true,
  });

  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(updateSettings(settings));
    setSavedNotice(true);
  };

  return (
    <Stack gap="lg" p="md">
      {/* Header */}
      <Group justify="space-between" align="flex-start" wrap="wrap">
        <div>
          <Title order={2} fw={700}>
            System & Scheduling Settings
          </Title>
          <Text c="dimmed" size="sm" mt={2}>
            Define academic calendar parameters, master slot intervals, and automated collision constraint rules.
          </Text>
        </div>

        <Button
          leftSection={<Save size={16} />}
          color="blue"
          onClick={handleSave}
        >
          Save All Changes
        </Button>
      </Group>

      {savedNotice && (
        <Alert
          icon={<CheckCircle2 size={16} />}
          color="teal"
          title="Settings Updated"
          withCloseButton
          onClose={() => setSavedNotice(false)}
        >
          Institutional timing parameters and collision rules saved successfully.
        </Alert>
      )}

      <form onSubmit={handleSave}>
        <Stack gap="lg">
          {/* Card 1: Academic Calendar & Term Structure */}
          <Paper p="md" withBorder radius="md">
            <Group gap="xs" mb="md">
              <Calendar size={20} color="var(--mantine-color-blue-5)" />
              <Title order={4}>Academic Calendar & Term Structure</Title>
            </Group>

            <Grid gutter="md">
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Academic Session / Year"
                  value={settings.academicYear}
                  onChange={(e) => setLocalSettings({ ...settings, academicYear: e.currentTarget.value })}
                  placeholder="e.g. 2024-2025"
                  required
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Select
                  label="Active Term / Semester"
                  data={[
                    'Even Semester (Spring)',
                    'Odd Semester (Fall)',
                    'Summer Intensive Term',
                    'Winter Remedial Term',
                  ]}
                  value={settings.currentSemester}
                  onChange={(val) => setLocalSettings({ ...settings, currentSemester: val || 'Even Semester (Spring)' })}
                  required
                />
              </Grid.Col>

              <Grid.Col span={12}>
                <MultiSelect
                  label="Institutional Working Days"
                  data={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']}
                  value={settings.workingDays}
                  onChange={(val) => setLocalSettings({ ...settings, workingDays: val })}
                  placeholder="Select working days"
                  required
                />
              </Grid.Col>
            </Grid>
          </Paper>

          {/* Card 2: Daily Timing & Slot Durations */}
          <Paper p="md" withBorder radius="md">
            <Group gap="xs" mb="md">
              <Clock size={20} color="var(--mantine-color-teal-5)" />
              <Title order={4}>Daily Operational Timing & Slot Architecture</Title>
            </Group>

            <Grid gutter="md">
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <TextInput
                  label="Campus Day Start"
                  value={settings.dayStartTime}
                  onChange={(e) => setLocalSettings({ ...settings, dayStartTime: e.currentTarget.value })}
                  placeholder="08:30"
                  required
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <TextInput
                  label="Campus Day End"
                  value={settings.dayEndTime}
                  onChange={(e) => setLocalSettings({ ...settings, dayEndTime: e.currentTarget.value })}
                  placeholder="16:30"
                  required
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <NumberInput
                  label="Standard Slot Length (Minutes)"
                  value={settings.slotDurationMinutes}
                  onChange={(val) => setLocalSettings({ ...settings, slotDurationMinutes: Number(val) || 60 })}
                  min={30}
                  max={180}
                  step={10}
                  required
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <TextInput
                  label="Common Lunch Start"
                  value={settings.lunchStartTime}
                  onChange={(e) => setLocalSettings({ ...settings, lunchStartTime: e.currentTarget.value })}
                  placeholder="12:30"
                  required
                />
              </Grid.Col>
            </Grid>
          </Paper>

          {/* Card 3: Scheduling Constraints & Conflict Safeguards */}
          <Paper p="md" withBorder radius="md">
            <Group gap="xs" mb="md">
              <ShieldCheck size={20} color="var(--mantine-color-indigo-5)" />
              <Title order={4}>Collision Prevention & Workload Constraints</Title>
            </Group>

            <Grid gutter="md">
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <NumberInput
                  label="Max Consecutive Faculty Hours / Day"
                  description="Prevents scheduling an instructor for more than N hours in a single calendar day"
                  value={settings.maxDailyHoursPerFaculty}
                  onChange={(val) => setLocalSettings({ ...settings, maxDailyHoursPerFaculty: Number(val) || 4 })}
                  min={1}
                  max={8}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <NumberInput
                  label="Classroom Capacity Safety Buffer (%)"
                  description="Ensures assigned rooms have at least X% excess seating beyond cohort strength"
                  value={settings.enforceCapacityBufferPercent}
                  onChange={(val) => setLocalSettings({ ...settings, enforceCapacityBufferPercent: Number(val) || 10 })}
                  min={0}
                  max={50}
                  suffix="%"
                />
              </Grid.Col>

              <Grid.Col span={12}>
                <Switch
                  label="Prevent consecutive lab sessions for the same student cohort"
                  description="Enforces at least one theory slot or recess break between 2+ hour intensive laboratory blocks"
                  checked={settings.preventConsecutiveLabs}
                  onChange={(e) => setLocalSettings({ ...settings, preventConsecutiveLabs: e.currentTarget.checked })}
                  size="sm"
                  color="blue"
                  mt="sm"
                />
              </Grid.Col>
            </Grid>
          </Paper>
        </Stack>
      </form>
    </Stack>
  );
}
