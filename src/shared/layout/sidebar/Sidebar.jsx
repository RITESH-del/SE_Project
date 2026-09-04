import {
  SlidersHorizontal,
  CalendarDays,
  FileChartColumn,
  Gauge,
  Lock,
  Notebook,
  Presentation,
  UserShield
} from 'lucide-react';

import { Code, Group, ScrollArea, Text } from '@mantine/core';
import { LinksGroup } from './NavbarLinksGroup';
import { Logo } from './Logo';
import classes from './Sidebar.module.css';

const mockdata = [
  { label: 'Dashboard', icon: Gauge },

  {
    label: 'Market news',
    icon: Notebook,
    initiallyOpened: true,
    links: [
      { label: 'Overview', link: '/' },
      { label: 'Forecasts', link: '/' },
      { label: 'Outlook', link: '/' },
      { label: 'Real time', link: '/' },
    ],
  },

  {
    label: 'Releases',
    icon: CalendarDays,
    links: [
      { label: 'Upcoming releases', link: '/' },
      { label: 'Previous releases', link: '/' },
      { label: 'Releases schedule', link: '/' },
    ],
  },

  { label: 'Analytics', icon: Presentation },
  { label: 'Contracts', icon: FileChartColumn },
  { label: 'Settings', icon: SlidersHorizontal },

  {
    label: 'Security',
    icon: Lock,
    links: [
      { label: 'Enable 2FA', link: '/' },
      { label: 'Change password', link: '/' },
      { label: 'Recovery codes', link: '/' },
    ],
  },
];

export function Sidebar({SidebarConfigs}) {
  const links = SidebarConfigs.map((item) => <LinksGroup {...item} key={item.label} />);

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <Group gap="md">
          {/* <Logo style={{ width: 120 }} /> */}
          <UserShield size={32}/>
          <Text size="xl"fw={700}>Admin</Text>
        </Group>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
      </ScrollArea>

{/* 4 */}
    </nav>
  );
}