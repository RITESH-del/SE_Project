import { useSelector, useDispatch } from 'react-redux';
import { Building, Users, Laptop, Presentation } from 'lucide-react';
import EntityManagementPage from '../components/EntityManagementPage';
import {
  addEntityItem,
  updateEntityItem,
  deleteEntityItem,
  batchImportEntityItems,
} from '../slices/adminSlice';

export default function RoomsPage() {
  const dispatch = useDispatch();
  const rows = useSelector((state) => state.admin?.rooms || []);

  const totalCapacity = rows.reduce((sum, r) => sum + (Number(r.capacity) || 0), 0);
  const lectureCount = rows.filter((r) => String(r.type).toLowerCase().includes('lecture')).length;
  const labCount = rows.filter((r) => String(r.type).toLowerCase().includes('lab')).length;

  const kpiStats = [
    {
      label: 'Total instructional spaces',
      value: `${rows.length} ${rows.length === 1 ? 'Room' : 'Rooms'}`,
      helper: 'Active campus facilities',
      icon: <Building size={24} color="var(--mantine-color-blue-5)" />,
    },
    {
      label: 'Campus seating capacity',
      value: `${totalCapacity} Seats`,
      helper: 'Cumulative student capacity',
      icon: <Users size={24} color="var(--mantine-color-teal-5)" />,
    },
    {
      label: 'Lecture halls',
      value: `${lectureCount} ${lectureCount === 1 ? 'Hall' : 'Halls'}`,
      helper: 'Large format theoretical rooms',
      icon: <Presentation size={24} color="var(--mantine-color-indigo-5)" />,
    },
    {
      label: 'Specialized laboratories',
      value: `${labCount} ${labCount === 1 ? 'Laboratory' : 'Laboratories'}`,
      helper: 'Hardware and computing spaces',
      icon: <Laptop size={24} color="var(--mantine-color-orange-5)" />,
    },
  ];

  const columns = [
    { key: 'roomNumber', label: 'Room identifier', required: true, example: 'LH-103', placeholder: 'e.g. LH-101 or LAB-2' },
    { key: 'building', label: 'Campus building', required: true, example: 'Engineering Block B', placeholder: 'e.g. Block A' },
    {
      key: 'type',
      label: 'Space category',
      type: 'select',
      options: ['Lecture Hall', 'Computer Lab', 'Hardware Lab', 'Seminar Room', 'Auditorium', 'Workshop'],
      required: true,
      example: 'Lecture Hall',
      defaultValue: 'Lecture Hall',
    },
    { key: 'capacity', label: 'Seating capacity', type: 'number', required: true, min: 1, max: 500, example: 90, defaultValue: 60 },
    {
      key: 'department',
      label: 'Department allocation',
      type: 'select',
      options: ['Common', 'Computer Science', 'Electronics', 'Mechanical', 'Sciences'],
      required: true,
      example: 'Common',
      defaultValue: 'Common',
    },
    { key: 'status', label: 'Availability status', type: 'badge', required: false, example: 'Operational', defaultValue: 'Operational' },
  ];

  return (
    <EntityManagementPage
      title="Classrooms & Laboratories"
      subtitle="Configure physical learning environments, seating limits, and departmental access rights."
      entityName="Rooms"
      entitySingular="Room"
      columns={columns}
      rows={rows}
      kpiStats={kpiStats}
      onAddRow={(item) => dispatch(addEntityItem({ entity: 'rooms', item }))}
      onUpdateRow={(item) => dispatch(updateEntityItem({ entity: 'rooms', item }))}
      onDeleteRow={(id) => dispatch(deleteEntityItem({ entity: 'rooms', id }))}
      onBatchImport={(items) => dispatch(batchImportEntityItems({ entity: 'rooms', items }))}
    />
  );
}
