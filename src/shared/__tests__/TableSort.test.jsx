import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import DataTable from '../components/TableSort';

describe('DataTable (TableSort Seam)', () => {
  const columns = [
    { key: 'name', label: 'Course Name' },
    { key: 'credits', label: 'Credits' },
    { key: 'completion', label: 'Progress', format: { type: 'progress' } },
    { key: 'status', label: 'Status', format: { type: 'badge' } },
  ];

  const rows = [
    { id: 1, name: 'Data Structures', credits: 4, completion: 90, status: 'Active' },
    { id: 2, name: 'Algorithms', credits: 3, completion: 60, status: 'In Progress' },
    { id: 3, name: 'Computer Networks', credits: 5, completion: 100, status: 'Complete' },
  ];

  it('renders table headers and row cell content', () => {
    renderWithProviders(
      <DataTable title="Curriculum Overview" columns={columns} rows={rows} />
    );

    expect(screen.getByText('Curriculum Overview')).toBeInTheDocument();
    expect(screen.getByText('Course Name')).toBeInTheDocument();
    expect(screen.getByText('Credits')).toBeInTheDocument();
    expect(screen.getByText('Data Structures')).toBeInTheDocument();
    expect(screen.getByText('Algorithms')).toBeInTheDocument();
    expect(screen.getByText('Computer Networks')).toBeInTheDocument();

    // Progress formats
    expect(screen.getByText('90%')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();

    // Badge formats
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Complete')).toBeInTheDocument();
  });

  it('sorts rows alphabetically ascending and descending on column header click', () => {
    renderWithProviders(
      <DataTable columns={columns} rows={rows} />
    );

    const nameHeader = screen.getByText('Course Name');

    // Click once -> Ascending sort: Algorithms, Computer Networks, Data Structures
    fireEvent.click(nameHeader);
    const cellsAsc = screen.getAllByRole('cell');
    expect(cellsAsc[0]).toHaveTextContent('Algorithms');

    // Click again -> Descending sort: Data Structures, Computer Networks, Algorithms
    fireEvent.click(nameHeader);
    const cellsDesc = screen.getAllByRole('cell');
    expect(cellsDesc[0]).toHaveTextContent('Data Structures');
  });

  it('sorts rows numerically on numeric column click', () => {
    renderWithProviders(
      <DataTable columns={columns} rows={rows} />
    );

    const creditsHeader = screen.getByText('Credits');

    // Click once -> Ascending: 3 (Algorithms), 4 (Data Structures), 5 (Networks)
    fireEvent.click(creditsHeader);
    const cellsAsc = screen.getAllByRole('cell');
    expect(cellsAsc[0]).toHaveTextContent('Algorithms');

    // Click again -> Descending: 5 (Networks), 4 (Data Structures), 3 (Algorithms)
    fireEvent.click(creditsHeader);
    const cellsDesc = screen.getAllByRole('cell');
    expect(cellsDesc[0]).toHaveTextContent('Computer Networks');
  });

  it('renders "No data available" message when rows array is empty', () => {
    renderWithProviders(
      <DataTable columns={columns} rows={[]} />
    );

    expect(screen.getByText('No data available')).toBeInTheDocument();
  });
});
