import { UserShield } from 'lucide-react';
import { Group, ScrollArea, Text } from '@mantine/core';
import { LinksGroup } from './NavbarLinksGroup';
import classes from './Sidebar.module.css';

export function Sidebar({ SidebarConfigs = [] }) {
  const links = SidebarConfigs.map((item) => <LinksGroup {...item} key={item.label} />);

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <Group gap="md">
          <UserShield size={32} />
          <Text size="xl" fw={700}>Admin</Text>
        </Group>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
      </ScrollArea>
    </nav>
  );
}
