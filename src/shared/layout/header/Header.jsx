// import {
//   Bell,
//   CalendarDays,
//   LogOut,
//   Search,
//   Settings,
//   User,
// } from 'lucide-react';

// import {
//   ActionIcon,
//   Avatar,
//   Burger,
//   Group,
//   Menu,
//   Text,
//   TextInput,
// } from '@mantine/core';

// import { useDisclosure } from '@mantine/hooks';
// import classes from './HeaderSearch.module.css';

// export function Header() {
//   const [opened, { toggle }] = useDisclosure(false);

//   return (
//     <header className={classes.header}>
//       <div className={classes.inner}>
//         {/* Left side */}
//         <Group gap="sm">
//           <Burger
//             opened={opened}
//             onClick={toggle}
//             size="sm"
//             hiddenFrom="sm"
//             aria-label="Toggle navigation"
//           />

//           <Group gap="xs">
//             <CalendarDays size={24} strokeWidth={1.8} />

//             <Text fw={700} size="lg">
//               Timetable
//             </Text>
//           </Group>
//         </Group>

//         {/* Right side */}
//         <Group gap="sm">
//           <TextInput
//             className={classes.search}
//             placeholder="Search..."
//             leftSection={
//               <Search size={16} strokeWidth={1.5} />
//             }
//             visibleFrom="xs"
//           />

//           {/* <ActionIcon
//             variant="subtle"
//             size="lg"
//             aria-label="Notifications"
//           >
//             <Bell size={20} strokeWidth={1.8} />
//           </ActionIcon> */}

//           <Menu shadow="md" width={200}>
//             <Menu.Target>
//               <ActionIcon
//                 variant="subtle"
//                 size="lg"
//                 radius="xl"
//               >
//                 <Avatar size={30} radius="xl">
//                   RK
//                 </Avatar>
//               </ActionIcon>
//             </Menu.Target>

//             <Menu.Dropdown>
//               <Menu.Label>Account</Menu.Label>

//               <Menu.Item leftSection={<User size={16} />}>
//                 Profile
//               </Menu.Item>

//               <Menu.Item leftSection={<Settings size={16} />}>
//                 Settings
//               </Menu.Item>

//               <Menu.Divider />

//               <Menu.Item
//                 color="red"
//                 leftSection={<LogOut size={16} />}
//               >
//                 Logout
//               </Menu.Item>
//             </Menu.Dropdown>
//           </Menu>
//         </Group>
//       </div>
//     </header>
//   );
// }



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
  Bell,
  ChevronRight,
  LogOut,
  Search,
  Settings,
  User,
} from 'lucide-react';

import { useParams } from 'react-router-dom';

import ToggleModeBtn from '../../components/ToggleModeBtn.jsx';
import classes from './HeaderSearch.module.css';

export function Header({ location }) {
 

  const params = useParams();
  const paramValues = Object.values(params);

  const items = location
    .split('/')
    .filter(Boolean)
    .filter((segment) => !paramValues.includes(segment))
    .map((segment) => (
      <Text key={segment} size="sm">
        {segment
          .split('-')
          .map(
            (word) =>
              word.charAt(0).toUpperCase() + word.slice(1)
          )
          .join(' ')}
      </Text>
    ));

  return (
    <header className={classes.header}>
      {/* Left side */}
      <Group gap="md" wrap="nowrap">
        <Breadcrumbs
          c="dimmed"
          separator={<ChevronRight size={15} />}
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

      {/* Right side */}
      <Group gap="sm" wrap="nowrap">

        <TextInput
          placeholder="Search..."
          leftSection={<Search size={16} strokeWidth={1.5} />}
          w={240}
          visibleFrom="sm"
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
                RK
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
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </header>
  );
}