import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import AdminDashboard from '../pages/AdminDashBoard';
import StatsGroup from '../components/StatsGroup';
import ProgressCard from '../components/ProgressCard';
import SchedulingStatus from '../components/SchedulingStatus';
import BarChart from '../components/BarChart';
import PieChart from '../components/PieChart';
import { apiClient } from '../../../shared/api/apiClient';

jest.mock('../../../shared/api/apiClient', () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

describe('Admin Components (Admin Presentation Seam)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('AdminDashboard Page', () => {
    it('shows Spinner when initially loading dashboard', () => {
      // Mock apiClient.get to never resolve immediately during this test
      apiClient.get.mockImplementationOnce(() => new Promise(() => {}));

      renderWithProviders(<AdminDashboard />);

      // Spinner renders Mantine Loader while request is in-flight
      expect(document.querySelector('.mantine-Loader-root')).toBeInTheDocument();
    });

    it('renders dashboard widgets when loading succeeds with custom data', async () => {
      apiClient.get.mockResolvedValueOnce({
        data: {
          components: [
            {
              type: 'stats',
              data: { courses: 99, faculty: 55, students: 800, rooms: 120 },
            },
          ],
        },
      });

      renderWithProviders(<AdminDashboard />);

      await waitFor(() => {
        expect(screen.getByText('Courses')).toBeInTheDocument();
      });
      expect(screen.getByText('99')).toBeInTheDocument();
    });

    it('renders mock dashboard fallback when backend call fails', async () => {
      apiClient.get.mockRejectedValueOnce(new Error('Backend offline'));

      renderWithProviders(<AdminDashboard />);

      await waitFor(() => {
        expect(screen.getAllByText('Courses').length).toBeGreaterThanOrEqual(1);
      });
      // Fallback data has 42 courses
      expect(screen.getByText('42')).toBeInTheDocument();
    });
  });

  describe('StatsGroup', () => {
    it('displays counts for courses, faculty, students, and rooms', () => {
      renderWithProviders(
        <StatsGroup courses={15} faculty={25} students={600} rooms={40} />
      );

      expect(screen.getByText('15')).toBeInTheDocument();
      expect(screen.getByText('Courses')).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();
      expect(screen.getByText('Faculty')).toBeInTheDocument();
      expect(screen.getByText('600')).toBeInTheDocument();
      expect(screen.getByText('Students')).toBeInTheDocument();
      expect(screen.getByText('40')).toBeInTheDocument();
      expect(screen.getByText('Rooms')).toBeInTheDocument();
    });
  });

  describe('ProgressCard', () => {
    it('calculates and displays percentage for current and total values', () => {
      renderWithProviders(
        <ProgressCard
          title="Curriculum Completion"
          current={75}
          total={100}
          description="25 courses left"
        />
      );

      expect(screen.getByText('Curriculum Completion')).toBeInTheDocument();
      expect(screen.getByText('75%')).toBeInTheDocument();
      expect(screen.getByText('75 of 100')).toBeInTheDocument();
      expect(screen.getByText('25 courses left')).toBeInTheDocument();
    });

    it('renders value badge when total is omitted', () => {
      renderWithProviders(
        <ProgressCard
          title="Scheduling Conflicts"
          value={5}
          description="5 room conflicts detected"
          status="warning"
        />
      );

      expect(screen.getByText('Scheduling Conflicts')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('5 room conflicts detected')).toBeInTheDocument();
      expect(screen.queryByText(/of/)).not.toBeInTheDocument();
    });
  });

  describe('SchedulingStatus', () => {
    it('renders title and collection of status items', () => {
      const items = [
        { title: 'Room Allocation', current: 30, total: 30, description: 'All allocated' },
        { title: 'Lab Conflicts', value: 2, description: '2 conflicts', status: 'warning' },
      ];

      renderWithProviders(
        <SchedulingStatus title="Overview Status" items={items} />
      );

      expect(screen.getByText('Overview Status')).toBeInTheDocument();
      expect(screen.getByText('Room Allocation')).toBeInTheDocument();
      expect(screen.getByText('100%')).toBeInTheDocument();
      expect(screen.getByText('Lab Conflicts')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  describe('BarChart and PieChart', () => {
    it('renders BarChart with title and chart container without crashing on empty data', () => {
      renderWithProviders(
        <BarChart
          title="Weekly Hours"
          data={[]}
          xKey="day"
          dataKey="hours"
        />
      );

      expect(screen.getByText('Weekly Hours')).toBeInTheDocument();
    });

    it('renders PieChart with title and chart container without crashing on empty data', () => {
      renderWithProviders(
        <PieChart
          title="Resource Breakdown"
          data={[]}
        />
      );

      expect(screen.getByText('Resource Breakdown')).toBeInTheDocument();
    });
  });
});
