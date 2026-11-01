import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

describe('ProtectedRoute Component (Route Guard Seam)', () => {
  it('redirects unauthenticated user without token to /login', () => {
    renderWithProviders(
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <div>Protected Admin Content</div>
            </ProtectedRoute>
          }
        />
      </Routes>,
      {
        initialEntries: ['/admin'],
        preloadedState: {
          auth: { isAuthenticated: false, token: null, user: null },
        },
      }
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Admin Content')).not.toBeInTheDocument();
  });

  it('allows access to children when user is authenticated with allowed role', () => {
    renderWithProviders(
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <div>Protected Admin Content</div>
            </ProtectedRoute>
          }
        />
      </Routes>,
      {
        initialEntries: ['/admin'],
        preloadedState: {
          auth: {
            isAuthenticated: true,
            token: 'valid-token',
            user: { id: 1, role: 'admin' },
          },
        },
      }
    );

    expect(screen.getByText('Protected Admin Content')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('redirects authenticated user with unauthorized role to /login', () => {
    renderWithProviders(
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <div>Protected Admin Content</div>
            </ProtectedRoute>
          }
        />
      </Routes>,
      {
        initialEntries: ['/admin'],
        preloadedState: {
          auth: {
            isAuthenticated: true,
            token: 'valid-token',
            user: { id: 2, role: 'student' },
          },
        },
      }
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Admin Content')).not.toBeInTheDocument();
  });
});
