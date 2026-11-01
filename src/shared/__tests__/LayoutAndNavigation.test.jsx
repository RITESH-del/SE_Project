import { screen, fireEvent, act } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import { Routes, Route } from 'react-router-dom';
import { Header } from '../layout/header/Header';
import { Sidebar } from '../layout/sidebar/Sidebar';
import { LinksGroup } from '../layout/sidebar/NavbarLinksGroup';
import ToggleModeBtn from '../components/ToggleModeBtn';
import ErrorPage from '../components/ErrorPage';
import App from '../../App';
import * as authThunks from '../../features/auth/thunks/authThunks';

describe('Layout and Navigation Components (Shell Seam)', () => {
  describe('Header Component', () => {
    it('parses pathname segments into capitalized breadcrumbs', () => {
      renderWithProviders(<Header location="/admin/campus/student-groups" />, {
        preloadedState: {
          auth: {
            user: { name: 'Dr. Jane Smith', role: 'admin' },
            isAuthenticated: true,
          },
        },
      });

      expect(screen.getByText('Campus')).toBeInTheDocument();
      expect(screen.getByText('Student Groups')).toBeInTheDocument();
      // Avatar shows first two letters uppercase
      expect(screen.getByText('DR')).toBeInTheDocument();
    });

    it('handles logout action from dropdown menu', async () => {
      const logoutSpy = jest.spyOn(authThunks, 'logoutUser').mockReturnValue({
        type: 'auth/logoutUser/fulfilled',
      });

      renderWithProviders(
        <Routes>
          <Route path="/admin" element={<Header location="/admin" />} />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>,
        {
          initialEntries: ['/admin'],
          preloadedState: {
            auth: {
              user: { name: 'Admin User', role: 'admin' },
              isAuthenticated: true,
            },
          },
        }
      );

      // Open account menu
      const accountMenuBtn = screen.getByRole('button', { name: /account menu/i });
      fireEvent.click(accountMenuBtn);
      // Wait or check for Logout in document.body
      const logoutBtn = await screen.findByText(/logout/i);
      await act(async () => {
        fireEvent.click(logoutBtn);
      });
      logoutSpy.mockRestore();
    });
  });

  describe('Sidebar and NavbarLinksGroup', () => {
    it('renders sidebar groups and toggles collapsible links', () => {
      const configs = [
        {
          label: 'Academic Resources',
          initiallyOpened: false,
          links: [
            { label: 'Schedules', link: '/admin/schedules' },
            { label: 'Classrooms', link: '/admin/classrooms' },
          ],
        },
      ];

      renderWithProviders(<Sidebar SidebarConfigs={configs} />);

      expect(screen.getByText('Admin')).toBeInTheDocument();
      expect(screen.getByText('Academic Resources')).toBeInTheDocument();

      // Click to expand
      fireEvent.click(screen.getByText('Academic Resources'));

      expect(screen.getByText('Schedules')).toBeInTheDocument();
      expect(screen.getByText('Classrooms')).toBeInTheDocument();
    });

    it('marks active link and auto-opens parent group when current route matches', () => {
      const configs = [
        {
          label: 'Academic Resources',
          initiallyOpened: false,
          links: [
            { label: 'Schedules', link: '/admin/schedules' },
            { label: 'Classrooms', link: '/admin/classrooms' },
          ],
        },
      ];

      renderWithProviders(<Sidebar SidebarConfigs={configs} />, {
        initialEntries: ['/admin/classrooms'],
      });

      const classroomLink = screen.getByText('Classrooms');
      expect(classroomLink).toBeInTheDocument();
      expect(classroomLink).toHaveAttribute('data-active', 'true');
    });

    it('marks top-level item active when current route matches', () => {
      renderWithProviders(
        <LinksGroup label="Analytics" link="/admin/analytics" />,
        { initialEntries: ['/admin/analytics'] }
      );

      const controlBtn = screen.getByRole('button', { name: /analytics/i });
      expect(controlBtn).toHaveAttribute('data-active', 'true');
    });
  });

  describe('ToggleModeBtn Component', () => {
    it('renders toggle color scheme button', () => {
      renderWithProviders(<ToggleModeBtn />);

      const toggleBtn = screen.getByRole('button', { name: /toggle color scheme/i });
      expect(toggleBtn).toBeInTheDocument();

      // Click to toggle
      fireEvent.click(toggleBtn);
      expect(toggleBtn).toBeInTheDocument();
    });
  });

  describe('App Root Redirection', () => {
    it('redirects authenticated user to /admin', () => {
      renderWithProviders(
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/admin" element={<div>Admin Landing View</div>} />
          <Route path="/login" element={<div>Login Landing View</div>} />
        </Routes>,
        {
          initialEntries: ['/'],
          preloadedState: {
            auth: { isAuthenticated: true },
          },
        }
      );

      expect(screen.getByText('Admin Landing View')).toBeInTheDocument();
      expect(screen.queryByText('Login Landing View')).not.toBeInTheDocument();
    });

    it('redirects unauthenticated user to /login', () => {
      renderWithProviders(
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/admin" element={<div>Admin Landing View</div>} />
          <Route path="/login" element={<div>Login Landing View</div>} />
        </Routes>,
        {
          initialEntries: ['/'],
          preloadedState: {
            auth: { isAuthenticated: false },
          },
        }
      );

      expect(screen.getByText('Login Landing View')).toBeInTheDocument();
      expect(screen.queryByText('Admin Landing View')).not.toBeInTheDocument();
    });
  });

  describe('ErrorPage Component', () => {
    it('renders 404 message and Go Back button', () => {
      renderWithProviders(<ErrorPage />);

      expect(screen.getByText('Something is not right...')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
    });
  });
});
