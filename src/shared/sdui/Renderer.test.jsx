import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import DashboardRenderer from './Renderer';

describe('DashboardRenderer (SDUI Seam)', () => {
  it('renders null when components array is empty', () => {
    const { container } = renderWithProviders(<DashboardRenderer components={[]} />);
    expect(container.querySelector('.mantine-Stack-root')).not.toBeInTheDocument();
  });

  it('renders stats component when passed in SDUI schema', () => {
    const schema = [
      {
        type: 'stats',
        data: {
          courses: 45,
          faculty: 70,
          students: 1500,
          rooms: 350,
        },
      },
    ];

    renderWithProviders(<DashboardRenderer components={schema} />);

    expect(screen.getByText('Courses')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText('Faculty')).toBeInTheDocument();
    expect(screen.getByText('70')).toBeInTheDocument();
    expect(screen.getByText('Students')).toBeInTheDocument();
    expect(screen.getByText('1500')).toBeInTheDocument();
    expect(screen.getByText('Rooms')).toBeInTheDocument();
    expect(screen.getByText('350')).toBeInTheDocument();
  });

  it('renders recursive row container with grid children', () => {
    const schema = [
      {
        type: 'row',
        data: {
          children: [
            {
              type: 'pie-chart',
              span: 4,
              data: {
                title: 'Classroom Availability',
                data: [
                  { label: 'Occupied', value: 20 },
                  { label: 'Free', value: 10 },
                ],
              },
            },
            {
              type: 'bar-chart',
              span: 8,
              data: {
                title: 'Department Distribution',
                xKey: 'dept',
                dataKey: 'count',
                data: [{ dept: 'CS', count: 12 }],
              },
            },
          ],
        },
      },
    ];

    renderWithProviders(<DashboardRenderer components={schema} />);

    expect(screen.getByText('Classroom Availability')).toBeInTheDocument();
    expect(screen.getByText('Department Distribution')).toBeInTheDocument();
  });

  it('renders scheduling status and table items', () => {
    const schema = [
      {
        type: 'scheduling-status',
        data: {
          items: [
            {
              title: 'Timetable Status',
              current: 10,
              total: 20,
              description: '10 slots pending',
            },
          ],
        },
      },
      {
        type: 'table',
        data: {
          title: 'Active Cohorts',
          columns: [
            { key: 'cohort', label: 'Cohort' },
            { key: 'status', label: 'Status', format: { type: 'badge' } },
          ],
          rows: [
            { id: 1, cohort: 'Batch A', status: 'Active' },
          ],
        },
      },
    ];

    renderWithProviders(<DashboardRenderer components={schema} />);

    expect(screen.getByText('Timetable Status')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('10 of 20')).toBeInTheDocument();
    expect(screen.getByText('Active Cohorts')).toBeInTheDocument();
    expect(screen.getByText('Batch A')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('gracefully skips unknown component types with a warning', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const schema = [
      {
        type: 'non-existent-widget',
        data: { foo: 'bar' },
      },
    ];

    renderWithProviders(<DashboardRenderer components={schema} />);

    expect(warnSpy).toHaveBeenCalledWith('Unknown dashboard component: non-existent-widget');
    warnSpy.mockRestore();
  });
});
