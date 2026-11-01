import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import ViewTimetablePage from '../pages/ViewTimetablePage';
import CreateTimetablePage from '../pages/CreateTimetablePage';
import * as XLSX from 'xlsx';

jest.mock('xlsx', () => {
  const original = jest.requireActual('xlsx');
  return {
    ...original,
    writeFile: jest.fn(),
  };
});

describe('Timetable Management Pages (Timetable Seams)', () => {
  describe('ViewTimetablePage', () => {
    it('renders master timetable grid and KPI cards', () => {
      renderWithProviders(<ViewTimetablePage />);

      expect(screen.getByText('Master Timetable Grid')).toBeInTheDocument();
      expect(screen.getByText('Total Allocated Slots')).toBeInTheDocument();
      expect(screen.getByText('Room Utilization')).toBeInTheDocument();
      expect(screen.getByText('Collision Status')).toBeInTheDocument();

      // Days of the week in header
      expect(screen.getByText('Monday')).toBeInTheDocument();
      expect(screen.getByText('Friday')).toBeInTheDocument();

      // Recess text
      expect(screen.getAllByText(/common recess & lunch break/i)[0]).toBeInTheDocument();
    });

    it('triggers XLSX export on export button click', () => {
      renderWithProviders(<ViewTimetablePage />);

      const exportBtn = screen.getByRole('button', { name: /export master schedule/i });
      fireEvent.click(exportBtn);

      expect(XLSX.writeFile).toHaveBeenCalled();
    });
  });

  describe('CreateTimetablePage', () => {
    it('renders timetable generation controls and manual assignment', () => {
      renderWithProviders(<CreateTimetablePage />);

      expect(screen.getByText('Timetable Generation Engine')).toBeInTheDocument();
      expect(screen.getByText('Manual Slot Assignment')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /auto-generate for cohort/i })).toBeInTheDocument();
    });

    it('prevents collision when assigning duplicate room in the same slot', () => {
      renderWithProviders(<CreateTimetablePage />, {
        preloadedState: {
          admin: {
            timetable: [
              {
                id: 'existing-1',
                day: 'Monday',
                time: '08:30 - 09:30',
                room: 'LH-101',
                faculty: 'Dr. Arvind Sharma',
                course: 'CS-301: OS',
                group: 'CSE-2024-B',
              },
            ],
            courses: [{ courseCode: 'CS-301', courseName: 'OS' }],
            faculty: [{ name: 'Dr. Arvind Sharma' }],
            rooms: [{ roomNumber: 'LH-101', type: 'Lecture', capacity: 100 }],
            studentGroups: [{ groupCode: 'CSE-2024-A' }],
          },
        },
      });

      const assignBtn = screen.getByRole('button', { name: /assign slot/i });
      fireEvent.click(assignBtn);

      // Warning alert should render
      expect(screen.getByText('Scheduling Collision Prevented')).toBeInTheDocument();
      expect(screen.getByText(/already booked on Monday during 08:30 - 09:30/i)).toBeInTheDocument();
    });
  });
});
