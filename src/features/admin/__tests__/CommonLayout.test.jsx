import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import { Routes, Route } from 'react-router-dom';
import CommonLayout from '../CommonLayout';

describe('CommonLayout Administrative Shell', () => {
  it('renders Sidebar and Header alongside child route outlet', () => {
    renderWithProviders(
      <Routes>
        <Route path="/admin" element={<CommonLayout />}>
          <Route index element={<div>Admin Home Page Content</div>} />
        </Route>
      </Routes>,
      {
        initialEntries: ['/admin'],
        preloadedState: {
          auth: {
            user: { name: 'Super Admin', role: 'admin' },
            isAuthenticated: true,
          },
        },
      }
    );

    // Sidebar and Header both present
    const adminTexts = screen.getAllByText('Admin');
    expect(adminTexts.length).toBeGreaterThanOrEqual(1);

    expect(screen.getAllByText('Dashboard').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Campus Configuration')).toBeInTheDocument();

    // Outlet renders active child content
    expect(screen.getByText('Admin Home Page Content')).toBeInTheDocument();
  });
});
