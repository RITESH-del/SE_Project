import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import AdminSettingsPage from '../pages/AdminSettingsPage';

describe('AdminSettingsPage Component (Settings Seam)', () => {
  it('renders all configuration sections and saves settings', () => {
    renderWithProviders(<AdminSettingsPage />);

    expect(screen.getByText('System & Scheduling Settings')).toBeInTheDocument();
    expect(screen.getByText('Academic Calendar & Term Structure')).toBeInTheDocument();
    expect(screen.getByText('Daily Operational Timing & Slot Architecture')).toBeInTheDocument();
    expect(screen.getByText('Collision Prevention & Workload Constraints')).toBeInTheDocument();

    expect(screen.getByLabelText(/academic session \/ year/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/campus day start/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/standard slot length/i)).toBeInTheDocument();

    const saveButtons = screen.getAllByRole('button', { name: /save all changes/i });
    fireEvent.click(saveButtons[0]);

    expect(screen.getByText('Settings Updated')).toBeInTheDocument();
    expect(screen.getByText(/institutional timing parameters and collision rules saved successfully/i)).toBeInTheDocument();
  });
});
