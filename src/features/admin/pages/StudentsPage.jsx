import { useSelector, useDispatch } from 'react-redux';
import { User, Users, CheckCircle, Calendar } from 'lucide-react';
import EntityManagementPage from '../components/EntityManagementPage';
import {
  addEntityItem,
  updateEntityItem,
  deleteEntityItem,
  batchImportEntityItems,
} from '../slices/adminSlice';

export default function StudentsPage() {
  const dispatch = useDispatch();
  const rows = useSelector((state) => state.admin?.students || []);
  const studentGroups = useSelector((state) => state.admin?.studentGroups || []);

  const groupOptions = studentGroups.map((g) => g.groupCode);
  const enrolledCount = rows.filter((r) => String(r.status).toLowerCase().includes('enrolled')).length;
  const groupsRepresented = new Set(rows.map((r) => r.group)).size;
  const semesterCount = new Set(rows.map((r) => r.semester)).size;

  const kpiStats = [
    {
      label: 'Enrolled students',
      value: `${rows.length} ${rows.length === 1 ? 'Student' : 'Students'}`,
      helper: 'Active matriculations',
      icon: <User size={24} color="var(--mantine-color-blue-5)" />,
    },
    {
      label: 'Assigned cohorts',
      value: `${groupsRepresented} ${groupsRepresented === 1 ? 'Group' : 'Groups'}`,
      helper: 'Active cohort mappings',
      icon: <Users size={24} color="var(--mantine-color-teal-5)" />,
    },
    {
      label: 'Active enrollment rate',
      value: `${rows.length > 0 ? Math.round((enrolledCount / rows.length) * 100) : 100}%`,
      helper: 'Good standing status',
      icon: <CheckCircle size={24} color="var(--mantine-color-indigo-5)" />,
    },
    {
      label: 'Semesters covered',
      value: `${semesterCount} ${semesterCount === 1 ? 'Semester' : 'Semesters'}`,
      helper: 'Current terms active',
      icon: <Calendar size={24} color="var(--mantine-color-orange-5)" />,
    },
  ];

  const columns = [
    { key: 'studentId', label: 'Roll number / ID', required: true, example: 'STU-2024-005', placeholder: 'e.g. STU-2024-001' },
    { key: 'name', label: 'Student name', required: true, example: 'Tanvi Iyer', placeholder: 'e.g. Jane Doe' },
    { key: 'email', label: 'Student email', required: true, example: 'tanvi.i@campus.edu', placeholder: 'student@campus.edu' },
    {
      key: 'group',
      label: 'Assigned group',
      type: 'select',
      options: groupOptions.length > 0 ? groupOptions : ['CSE-2024-A', 'CSE-2024-B', 'ECE-2024-A', 'MECH-2024-A'],
      required: true,
      example: 'CSE-2024-A',
      defaultValue: groupOptions[0] || 'CSE-2024-A',
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
    { key: 'status', label: 'Enrollment status', type: 'badge', required: false, example: 'Enrolled', defaultValue: 'Enrolled' },
  ];

  return (
    <EntityManagementPage
      title="Student Admissions & Enrollment"
      subtitle="Register students, assign them to academic cohort sections, and batch ingest student rolls."
      entityName="Students"
      entitySingular="Student"
      columns={columns}
      rows={rows}
      kpiStats={kpiStats}
      onAddRow={(item) => dispatch(addEntityItem({ entity: 'students', item }))}
      onUpdateRow={(item) => dispatch(updateEntityItem({ entity: 'students', item }))}
      onDeleteRow={(id) => dispatch(deleteEntityItem({ entity: 'students', id }))}
      onBatchImport={(items) => dispatch(batchImportEntityItems({ entity: 'students', items }))}
    />
  );
}
