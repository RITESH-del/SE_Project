import {
  ActionIcon,
  Avatar,
  Breadcrumbs,
  Group,
  Menu,
  Text,
  TextInput,
} from '@mantine/core';
import {
  ChevronRight,
  LogOut,
  Search,
  Settings,
  User,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../../features/auth/thunks/authThunks';
import ToggleModeBtn from '../../components/ToggleModeBtn.jsx';
import classes from './HeaderSearch.module.css';

const formatBreadcrumb = (path) => {
  const routeMap = {
    '/admin': ['Dashboard'],
    '/admin/campus/student-groups': ['Campus', 'Student Groups'],
    '/admin/campus/student/create': ['Campus', 'Students'],
    '/admin/campus/faculty/create': ['Campus', 'Faculty'],
    '/admin/campus/room/create': ['Campus', 'Rooms'],
    '/admin/campus/course/create': ['Campus', 'Courses'],
    '/admin/timetable': ['Timetable', 'Master Schedule'],
    '/admin/timetable/create': ['Timetable', 'Generate Schedule'],
    '/admin/settings': ['Settings', 'Operational Parameters'],
  };

  if (routeMap[path]) {
    return routeMap[path];
  }

  // Fallback for custom or parameterized sub-routes
  const rawSegments = path
    .split('/')
    .filter(Boolean)
    .filter((s) => s !== 'admin');

  if (rawSegments.length === 0) return ['Dashboard'];

  return rawSegments.map((s) =>
    s
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
  );
};

export function Header({ location }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const { user } = useSelector((state) => state.auth);

  const currentPath = typeof location === 'string' ? location : (routerLocation?.pathname || '');

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  const breadcrumbLabels = formatBreadcrumb(currentPath);
  const items = breadcrumbLabels.map((label, idx) => (
    <Text
      key={label}
      size="sm"
      fw={idx === breadcrumbLabels.length - 1 ? 600 : 400}
      c={idx === breadcrumbLabels.length - 1 ? 'var(--mantine-color-text)' : 'dimmed'}
    >
      {label}
    </Text>
  ));

  const userInitials = user?.name
    ? user.name.slice(0, 2).toUpperCase()
    : user?.email
      ? user.email.slice(0, 2).toUpperCase()
      : 'SY';

  return (
    <header className={classes.header}>
      {/* Left side: Refined Breadcrumbs */}
      <Group gap="md" wrap="nowrap">
        <Breadcrumbs
          c="dimmed"
          separator={<ChevronRight size={14} opacity={0.6} />}
          styles={{
            separator: {
              color: 'var(--mantine-color-dimmed)',
              margin: '4px',
            },
          }}
        >
          {items}
        </Breadcrumbs>
      </Group>

      {/* Right side: Search, Theme Toggle, Account Menu */}
      <Group gap="sm" wrap="nowrap">
        <TextInput
          placeholder="Search..."
          leftSection={<Search size={16} strokeWidth={1.5} />}
          w={240}
          visibleFrom="sm"
          aria-label="Search"
        />

        <ToggleModeBtn />

        <Menu shadow="md" width={200}>
          <Menu.Target>
            <ActionIcon
              variant="subtle"
              size="lg"
              radius="xl"
              aria-label="Account menu"
            >
              <Avatar size={30} radius="xl">
                {userInitials}
              </Avatar>
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Account</Menu.Label>

            <Menu.Item leftSection={<User size={16} />}>
              Profile
            </Menu.Item>

            <Menu.Item leftSection={<Settings size={16} />}>
              Settings
            </Menu.Item>

            <Menu.Divider />

            <Menu.Item
              color="red"
              leftSection={<LogOut size={16} />}
              onClick={handleLogout}
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </header>
  );
}
