import { createSlice } from '@reduxjs/toolkit';
import { fetchDashboard } from '../thunks/adminThunks.js';

const initialStudentGroups = [
  {
    id: 1,
    groupCode: 'CSE-2024-A',
    program: 'B.Tech Computer Science',
    semester: 'Semester 4',
    studentCount: 65,
    mentor: 'Dr. Arvind Sharma',
    status: 'Active',
  },
  {
    id: 2,
    groupCode: 'CSE-2024-B',
    program: 'B.Tech Computer Science',
    semester: 'Semester 4',
    studentCount: 62,
    mentor: 'Dr. Neha Kumar',
    status: 'Active',
  },
  {
    id: 3,
    groupCode: 'ECE-2024-A',
    program: 'B.Tech Electronics & Comm',
    semester: 'Semester 4',
    studentCount: 58,
    mentor: 'Dr. Rajesh Singh',
    status: 'Active',
  },
  {
    id: 4,
    groupCode: 'MECH-2024-A',
    program: 'B.Tech Mechanical Eng',
    semester: 'Semester 6',
    studentCount: 45,
    mentor: 'Dr. Vikram Patel',
    status: 'Active',
  },
];

const initialFaculty = [
  {
    id: 1,
    facultyId: 'FAC-101',
    name: 'Dr. Arvind Sharma',
    department: 'Computer Science',
    designation: 'Professor',
    maxWeeklyHours: 18,
    email: 'a.sharma@campus.edu',
    status: 'Active',
  },
  {
    id: 2,
    facultyId: 'FAC-102',
    name: 'Dr. Neha Kumar',
    department: 'Computer Science',
    designation: 'Associate Professor',
    maxWeeklyHours: 16,
    email: 'n.kumar@campus.edu',
    status: 'Active',
  },
  {
    id: 3,
    facultyId: 'FAC-103',
    name: 'Dr. Rajesh Singh',
    department: 'Electronics',
    designation: 'Assistant Professor',
    maxWeeklyHours: 14,
    email: 'r.singh@campus.edu',
    status: 'Active',
  },
  {
    id: 4,
    facultyId: 'FAC-104',
    name: 'Dr. Sunita Gupta',
    department: 'Mathematics',
    designation: 'Professor',
    maxWeeklyHours: 16,
    email: 's.gupta@campus.edu',
    status: 'Active',
  },
];

const initialStudents = [
  {
    id: 1,
    studentId: 'STU-2024-001',
    name: 'Aarav Patel',
    email: 'aarav.p@campus.edu',
    group: 'CSE-2024-A',
    semester: 'Semester 4',
    status: 'Enrolled',
  },
  {
    id: 2,
    studentId: 'STU-2024-002',
    name: 'Diya Sen',
    email: 'diya.s@campus.edu',
    group: 'CSE-2024-A',
    semester: 'Semester 4',
    status: 'Enrolled',
  },
  {
    id: 3,
    studentId: 'STU-2024-003',
    name: 'Rohan Verma',
    email: 'rohan.v@campus.edu',
    group: 'CSE-2024-B',
    semester: 'Semester 4',
    status: 'Enrolled',
  },
  {
    id: 4,
    studentId: 'STU-2024-004',
    name: 'Ananya Roy',
    email: 'ananya.r@campus.edu',
    group: 'ECE-2024-A',
    semester: 'Semester 4',
    status: 'Enrolled',
  },
];

const initialRooms = [
  {
    id: 1,
    roomNumber: 'LH-101',
    building: 'Engineering Block A',
    type: 'Lecture Hall',
    capacity: 120,
    department: 'Common',
    status: 'Operational',
  },
  {
    id: 2,
    roomNumber: 'LH-102',
    building: 'Engineering Block A',
    type: 'Lecture Hall',
    capacity: 80,
    department: 'Common',
    status: 'Operational',
  },
  {
    id: 3,
    roomNumber: 'CS-LAB-1',
    building: 'IT Tower 2nd Floor',
    type: 'Computer Lab',
    capacity: 40,
    department: 'Computer Science',
    status: 'Operational',
  },
  {
    id: 4,
    roomNumber: 'EC-LAB-2',
    building: 'Science Annex',
    type: 'Hardware Lab',
    capacity: 35,
    department: 'Electronics',
    status: 'Operational',
  },
];

const initialCourses = [
  {
    id: 1,
    courseCode: 'CS-301',
    courseName: 'Operating Systems',
    department: 'Computer Science',
    credits: 4,
    hoursPerWeek: 4,
    type: 'Lecture + Lab',
    status: 'Active',
  },
  {
    id: 2,
    courseCode: 'CS-302',
    courseName: 'Database Management Systems',
    department: 'Computer Science',
    credits: 4,
    hoursPerWeek: 4,
    type: 'Lecture + Lab',
    status: 'Active',
  },
  {
    id: 3,
    courseCode: 'EC-201',
    courseName: 'Signals & Systems',
    department: 'Electronics',
    credits: 3,
    hoursPerWeek: 3,
    type: 'Lecture',
    status: 'Active',
  },
  {
    id: 4,
    courseCode: 'MA-201',
    courseName: 'Discrete Mathematics',
    department: 'Mathematics',
    credits: 3,
    hoursPerWeek: 3,
    type: 'Lecture',
    status: 'Active',
  },
];

const initialTimetableSlots = [
  {
    id: 'slot-1',
    day: 'Monday',
    time: '08:30 - 09:30',
    course: 'CS-301: Operating Systems',
    faculty: 'Dr. Arvind Sharma',
    room: 'LH-101',
    group: 'CSE-2024-A',
    color: 'blue',
  },
  {
    id: 'slot-2',
    day: 'Monday',
    time: '09:30 - 10:30',
    course: 'MA-201: Discrete Mathematics',
    faculty: 'Dr. Sunita Gupta',
    room: 'LH-102',
    group: 'CSE-2024-A',
    color: 'teal',
  },
  {
    id: 'slot-3',
    day: 'Tuesday',
    time: '10:30 - 11:30',
    course: 'CS-302: DBMS Lab',
    faculty: 'Dr. Neha Kumar',
    room: 'CS-LAB-1',
    group: 'CSE-2024-B',
    color: 'indigo',
  },
  {
    id: 'slot-4',
    day: 'Wednesday',
    time: '08:30 - 09:30',
    course: 'EC-201: Signals & Systems',
    faculty: 'Dr. Rajesh Singh',
    room: 'LH-101',
    group: 'ECE-2024-A',
    color: 'orange',
  },
  {
    id: 'slot-5',
    day: 'Thursday',
    time: '01:30 - 02:30',
    course: 'CS-301: OS Lab',
    faculty: 'Dr. Arvind Sharma',
    room: 'CS-LAB-1',
    group: 'CSE-2024-A',
    color: 'blue',
  },
];

const initialSettings = {
  academicYear: '2024-2025',
  currentSemester: 'Even Semester (Spring)',
  workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  dayStartTime: '08:30',
  dayEndTime: '16:30',
  slotDurationMinutes: 60,
  lunchStartTime: '12:30',
  lunchDurationMinutes: 60,
  maxDailyHoursPerFaculty: 4,
  enforceCapacityBufferPercent: 10,
  preventConsecutiveLabs: true,
};

const initialState = {
  loading: false,
  error: null,
  dashboard: [],
  studentGroups: initialStudentGroups,
  faculty: initialFaculty,
  students: initialStudents,
  rooms: initialRooms,
  courses: initialCourses,
  timetable: initialTimetableSlots,
  settings: initialSettings,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
    resetAdminDashboard: (state) => {
      state.dashboard = [];
      state.error = null;
      state.loading = false;
    },
    // Generic Entity Mutators
    addEntityItem: (state, action) => {
      const { entity, item } = action.payload;
      if (Array.isArray(state[entity])) {
        state[entity].unshift(item);
      }
    },
    updateEntityItem: (state, action) => {
      const { entity, item } = action.payload;
      if (Array.isArray(state[entity])) {
        const index = state[entity].findIndex((i) => i.id === item.id);
        if (index !== -1) {
          state[entity][index] = item;
        }
      }
    },
    deleteEntityItem: (state, action) => {
      const { entity, id } = action.payload;
      if (Array.isArray(state[entity])) {
        state[entity] = state[entity].filter((i) => i.id !== id);
      }
    },
    batchImportEntityItems: (state, action) => {
      const { entity, items } = action.payload;
      if (Array.isArray(state[entity])) {
        state[entity] = [...items, ...state[entity]];
      }
    },
    // Timetable Actions
    addTimetableSlot: (state, action) => {
      state.timetable.push(action.payload);
    },
    removeTimetableSlot: (state, action) => {
      state.timetable = state.timetable.filter((s) => s.id !== action.payload);
    },
    updateTimetableSlot: (state, action) => {
      const index = state.timetable.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.timetable[index] = action.payload;
      }
    },
    setTimetable: (state, action) => {
      state.timetable = action.payload;
    },
    // Settings Mutators
    updateSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload?.components || [];
        state.error = null;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || 'Failed to load dashboard.';
      });
  },
});

export const {
  clearAdminError,
  resetAdminDashboard,
  addEntityItem,
  updateEntityItem,
  deleteEntityItem,
  batchImportEntityItems,
  addTimetableSlot,
  removeTimetableSlot,
  updateTimetableSlot,
  setTimetable,
  updateSettings,
} = adminSlice.actions;

export default adminSlice.reducer;
