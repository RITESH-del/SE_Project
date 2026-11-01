import { useSelector, useDispatch } from 'react-redux';
import { UserCheck, Clock, Award, Building2 } from 'lucide-react';
import EntityManagementPage from '../components/EntityManagementPage';
import {
  addEntityItem,
  updateEntityItem,
  deleteEntityItem,
  batchImportEntityItems,
} from '../slices/adminSlice';

export default function FacultyPage() {
  const dispatch = useDispatch();
  const rows = useSelector((state) => state.admin?.faculty || []);

  const totalLoadCapacity = rows.reduce((sum, r) => sum + (Number(r.maxWeeklyHours) || 0), 0);
  const deptCount = new Set(rows.map((r) => r.department)).size;
  const professorCount = rows.filter((r) => String(r.designation).includes('Professor')).length;

  const kpiStats = [
    {
      label: 'Total faculty',
      value: `${rows.length} ${rows.length === 1 ? 'Instructor' : 'Instructors'}`,
      helper: 'Teaching roster active',
      icon: <UserCheck size={24} color="var(--mantine-color-blue-5)" />,
    },
    {
      label: 'Weekly teaching capacity',
      value: `${totalLoadCapacity} Hours`,
      helper: 'Institutional contact load',
      icon: <Clock size={24} color="var(--mantine-color-teal-5)" />,
    },
    {
      label: 'Academic departments',
      value: `${deptCount} ${deptCount === 1 ? 'Discipline' : 'Disciplines'}`,
      helper: 'Faculty allocations',
      icon: <Building2 size={24} color="var(--mantine-color-indigo-5)" />,
    },
    {
      label: 'Professorial staff',
      value: `${professorCount} ${professorCount === 1 ? 'Senior Staff' : 'Senior Staff'}`,
      helper: 'Professors & Associates',
      icon: <Award size={24} color="var(--mantine-color-orange-5)" />,
    },
  ];

  const columns = [
    { key: 'facultyId', label: 'Faculty ID', required: true, example: 'FAC-105', placeholder: 'e.g. FAC-101' },
    { key: 'name', label: 'Full name', required: true, example: 'Dr. Meera Nambiar', placeholder: 'e.g. Dr. John Doe' },
    {
      key: 'department',
      label: 'Department',
      type: 'select',
      options: ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Mathematics', 'Physics', 'Humanities'],
      required: true,
      example: 'Computer Science',
      defaultValue: 'Computer Science',
    },
    {
      key: 'designation',
      label: 'Designation',
      type: 'select',
      options: ['Professor', 'Associate Professor', 'Assistant Professor', 'Adjunct Faculty'],
      required: true,
      example: 'Professor',
      defaultValue: 'Assistant Professor',
    },
    { key: 'maxWeeklyHours', label: 'Max weekly load (hrs)', type: 'number', required: true, min: 1, max: 40, example: 16, defaultValue: 16 },
    { key: 'email', label: 'Official email', required: true, example: 'm.nambiar@campus.edu', placeholder: 'faculty@campus.edu' },
    { key: 'status', label: 'Status', type: 'badge', required: false, example: 'Active', defaultValue: 'Active' },
  ];

  return (
    <EntityManagementPage
      title="Faculty & Instructors"
      subtitle="Manage university faculty members, maximum teaching workloads, and department assignments."
      entityName="Faculty"
      entitySingular="Faculty Member"
      columns={columns}
      rows={rows}
      kpiStats={kpiStats}
      onAddRow={(item) => dispatch(addEntityItem({ entity: 'faculty', item }))}
      onUpdateRow={(item) => dispatch(updateEntityItem({ entity: 'faculty', item }))}
      onDeleteRow={(id) => dispatch(deleteEntityItem({ entity: 'faculty', id }))}
      onBatchImport={(items) => dispatch(batchImportEntityItems({ entity: 'faculty', items }))}
    />
  );
}
