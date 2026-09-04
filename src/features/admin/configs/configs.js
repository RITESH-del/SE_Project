import {
  CalendarDays,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Users,
  Building2,
  BookOpen,
} from 'lucide-react';

 export const SidebarConfigs = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    link: '/admin',
  },
   {
    label: 'Campus Configuration',
    icon: Building2,
    initiallyOpened: true,
    links: [
      {
        label: 'Student Groups',
        link: '/admin/campus/student-groups'
      },
      {
        label: 'Faculty',
        link: '/admin/campus/faculty/create'
      },
      {
        label: 'Students',
        link: '/admin/campus/student/create'
      },
      {
        label: 'Rooms',
        link: '/admin/campus/room/create'
      },
      {
        label: 'Courses',
        link: '/admin/campus/course/create'
      },
    ],
  },


  {
    label: 'Timetable',
    icon: CalendarDays,
    initiallyOpened: true,
    links: [
      {
        label: 'View Timetable',
        link: '/admin/timetable',
      },
      {
        label: 'Create Timetable',
        link: '/admin/timetable/create',
      },
    ],
  },
  {
    label: 'Settings',
    icon: Settings,
    link: '/admin/settings',
  },
];