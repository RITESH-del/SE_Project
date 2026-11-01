import ProtectedRoute from '../../shared/components/ProtectedRoute';
import CommonLayout from './CommonLayout.jsx';
import AdminDashboard from './pages/AdminDashBoard.jsx';
import StudentGroupsPage from './pages/StudentGroupsPage.jsx';
import FacultyPage from './pages/FacultyPage.jsx';
import StudentsPage from './pages/StudentsPage.jsx';
import RoomsPage from './pages/RoomsPage.jsx';
import CoursesPage from './pages/CoursesPage.jsx';
import ViewTimetablePage from './pages/ViewTimetablePage.jsx';
import CreateTimetablePage from './pages/CreateTimetablePage.jsx';
import AdminSettingsPage from './pages/AdminSettingsPage.jsx';

const AdminRoutes = [
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <CommonLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: 'campus/student-groups',
        element: <StudentGroupsPage />,
      },
      {
        path: 'campus/faculty/create',
        element: <FacultyPage />,
      },
      {
        path: 'campus/student/create',
        element: <StudentsPage />,
      },
      {
        path: 'campus/room/create',
        element: <RoomsPage />,
      },
      {
        path: 'campus/course/create',
        element: <CoursesPage />,
      },
      {
        path: 'timetable',
        element: <ViewTimetablePage />,
      },
      {
        path: 'timetable/create',
        element: <CreateTimetablePage />,
      },
      {
        path: 'settings',
        element: <AdminSettingsPage />,
      },
    ],
  },
];

export default AdminRoutes;
