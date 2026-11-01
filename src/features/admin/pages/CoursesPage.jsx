import { useSelector, useDispatch } from 'react-redux';
import { BookOpen, Award, Clock, FlaskConical } from 'lucide-react';
import EntityManagementPage from '../components/EntityManagementPage';
import {
  addEntityItem,
  updateEntityItem,
  deleteEntityItem,
  batchImportEntityItems,
} from '../slices/adminSlice';

export default function CoursesPage() {
  const dispatch = useDispatch();
  const rows = useSelector((state) => state.admin?.courses || []);

  const totalCredits = rows.reduce((sum, r) => sum + (Number(r.credits) || 0), 0);
  const totalWeeklyHours = rows.reduce((sum, r) => sum + (Number(r.hoursPerWeek) || 0), 0);
  const practicalCount = rows.filter((r) => String(r.type).toLowerCase().includes('lab')).length;

  const kpiStats = [
    {
      label: 'Total curriculum courses',
      value: `${rows.length} ${rows.length === 1 ? 'Subject' : 'Subjects'}`,
      helper: 'Active courses in catalogue',
      icon: <BookOpen size={24} color="var(--mantine-color-blue-5)" />,
    },
    {
      label: 'Cumulative credits',
      value: `${totalCredits} Credits`,
      helper: 'Awarded across courses',
      icon: <Award size={24} color="var(--mantine-color-teal-5)" />,
    },
    {
      label: 'Weekly contact load',
      value: `${totalWeeklyHours} Hours`,
      helper: 'Scheduled instructional time',
      icon: <Clock size={24} color="var(--mantine-color-indigo-5)" />,
    },
    {
      label: 'Laboratory courses',
      value: `${practicalCount} ${practicalCount === 1 ? 'Practical' : 'Practicals'}`,
      helper: 'Hands-on lab modules',
      icon: <FlaskConical size={24} color="var(--mantine-color-orange-5)" />,
    },
  ];

  const columns = [
    { key: 'courseCode', label: 'Course code', required: true, example: 'CS-401', placeholder: 'e.g. CS-301' },
    { key: 'courseName', label: 'Course title', required: true, example: 'Machine Learning', placeholder: 'e.g. Operating Systems' },
    {
      key: 'department',
      label: 'Department',
      type: 'select',
      options: ['Computer Science', 'Electronics', 'Mechanical', 'Mathematics', 'Physics', 'Humanities'],
      required: true,
      example: 'Computer Science',
      defaultValue: 'Computer Science',
    },
    { key: 'credits', label: 'Credits', type: 'number', required: true, min: 1, max: 10, example: 4, defaultValue: 3 },
    { key: 'hoursPerWeek', label: 'Weekly hours', type: 'number', required: true, min: 1, max: 20, example: 4, defaultValue: 3 },
    {
      key: 'type',
      label: 'Course nature',
      type: 'select',
      options: ['Lecture', 'Lab', 'Lecture + Lab', 'Seminar', 'Project'],
      required: true,
      example: 'Lecture + Lab',
      defaultValue: 'Lecture',
    },
    { key: 'status', label: 'Status', type: 'badge', required: false, example: 'Active', defaultValue: 'Active' },
  ];

  return (
    <EntityManagementPage
      title="Course Catalogue & Curriculum"
      subtitle="Define academic subjects, credit allocations, contact hours, and instructional requirements."
      entityName="Courses"
      entitySingular="Course"
      columns={columns}
      rows={rows}
      kpiStats={kpiStats}
      onAddRow={(item) => dispatch(addEntityItem({ entity: 'courses', item }))}
      onUpdateRow={(item) => dispatch(updateEntityItem({ entity: 'courses', item }))}
      onDeleteRow={(id) => dispatch(deleteEntityItem({ entity: 'courses', id }))}
      onBatchImport={(items) => dispatch(batchImportEntityItems({ entity: 'courses', items }))}
    />
  );
}
