import { AppShell } from '@mantine/core';
import { Outlet, useLocation } from 'react-router-dom';

import { Sidebar } from '../../shared/layout/sidebar/Sidebar.jsx';
import { Header } from '../../shared/layout/header/Header.jsx';
import { SidebarConfigs } from './configs/configs.js';

export default function CommonLayout() {
  const { pathname } = useLocation();
  return (
    <AppShell
      navbar={{
        width: 300,
        breakpoint: 'sm',
      }}
    >

      <AppShell.Navbar>
        <Sidebar SidebarConfigs={SidebarConfigs} />
      </AppShell.Navbar>

      <AppShell.Main>
        <Header location={pathname}/>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}