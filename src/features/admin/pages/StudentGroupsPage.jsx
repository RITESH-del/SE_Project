import { useSelector, useDispatch } from 'react-redux';
import { Users, GraduationCap, School, Layers } from 'lucide-react';
import EntityManagementPage from '../components/EntityManagementPage';
import {
  addEntityItem,
  updateEntityItem,
  deleteEntityItem,
  batchImportEntityItems,
} from '../slices/adminSlice';

export default function StudentGroupsPage() {
  const dispatch = useDispatch();
  const rows = useSelector((state) => state.admin?.studentGroups || []);

  const totalStrength = rows.reduce((sum, r) => sum + (Number(r.studentCount) || 0), 0);
  const programCount = new Set(rows.map((r) => r.program)).size;
  const avgStrength = rows.length > 0 ? Math.round(totalStrength / rows.length) : 0;

  const kpiStats = [
    {
      label: 'Total student groups',
      value: `${rows.length} ${rows.length === 1 ? 'Cohort' : 'Cohorts'}`,
      helper: 'Active section divisions',
      icon: <Users size={24} color="var(--mantine-color-blue-5)" />,
    },
    {
      label: 'Cumulative strength',
      value: `${totalStrength} ${totalStrength === 1 ? 'Student' : 'Students'}`,
      helper: 'Allocated across sections',
      icon: <GraduationCap size={24} color="var(--mantine-color-teal-5)" />,
    },
    {
      label: 'Academic programs',
      value: `${programCount} ${programCount === 1 ? 'Program' : 'Programs'}`,
      helper: 'B.Tech, M.Tech, MBA',
      icon: <School size={24} color="var(--mantine-color-indigo-5)" />,
    },
    {
      label: 'Average cohort size',
      value: `${avgStrength} per group`,
      helper: 'Classroom size baseline',
      icon: <Layers size={24} color="var(--mantine-color-orange-5)" />,
    },
  ];

  const columns = [
    { key: 'groupCode', label: 'Group code', required: true, example: 'CSE-2024-C', placeholder: 'e.g. CSE-2024-A' },
    {
      key: 'program',
      label: 'Academic program',
      type: 'select',
      options: [
        'B.Tech Computer Science',
        'B.Tech Electronics & Comm',
        'B.Tech Mechanical Eng',
        'M.Tech Computer Science',
        'MBA',
      ],
      required: true,
      example: 'B.Tech Computer Science',
      defaultValue: 'B.Tech Computer Science',
    },
    {
      key: 'semester',
      label: 'Semester',
      type: 'select',
      options: ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'],
      required: true,
      example: 'Semester 4',
      defaultValue: 'Semester 4',
    },
    { key: 'studentCount', label: 'Student strength', type: 'number', required: true, min: 1, max: 200, example: 60, defaultValue: 60 },
    { key: 'mentor', label: 'Faculty mentor', required: true, example: 'Dr. Arvind Sharma', placeholder: 'e.g. Dr. Arvind Sharma' },
    {
      key: 'status',
      label: 'Status',
      type: 'badge',
      required: false,
      example: 'Active',
      defaultValue: 'Active',
    },
  ];

  return (
    <EntityManagementPage
      title="Student Groups & Cohorts"
      subtitle="Configure academic cohorts, section divisions, and student capacities for scheduling."
      entityName="Student Groups"
      entitySingular="Student Group"
      columns={columns}
      rows={rows}
      kpiStats={kpiStats}
      onAddRow={(item) => dispatch(addEntityItem({ entity: 'studentGroups', item }))}
      onUpdateRow={(item) => dispatch(updateEntityItem({ entity: 'studentGroups', item }))}
      onDeleteRow={(id) => dispatch(deleteEntityItem({ entity: 'studentGroups', id }))}
      onBatchImport={(items) => dispatch(batchImportEntityItems({ entity: 'studentGroups', items }))}
    />
  );
}
