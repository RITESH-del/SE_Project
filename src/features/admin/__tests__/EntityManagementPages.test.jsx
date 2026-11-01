import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import StudentGroupsPage from '../pages/StudentGroupsPage';
import FacultyPage from '../pages/FacultyPage';
import StudentsPage from '../pages/StudentsPage';
import RoomsPage from '../pages/RoomsPage';
import CoursesPage from '../pages/CoursesPage';

describe('Campus Entity Management Pages (Entity Seams)', () => {
  describe('StudentGroupsPage', () => {
    it('renders student groups table and opens create drawer', async () => {
      renderWithProviders(<StudentGroupsPage />);

      expect(screen.getByText('Student Groups & Cohorts')).toBeInTheDocument();
      expect(screen.getByText('CSE-2024-A')).toBeInTheDocument();
      expect(screen.getAllByText('B.Tech Computer Science')[0]).toBeInTheDocument();

      const addBtn = screen.getByRole('button', { name: /add student group/i });
      fireEvent.click(addBtn);

      expect(await screen.findByText('Add New Student Group')).toBeInTheDocument();
      expect(screen.getByLabelText(/group code/i)).toBeInTheDocument();
    });

    it('opens edit drawer on table row action click', async () => {
      renderWithProviders(<StudentGroupsPage />);

      const actionButtons = screen.getAllByRole('button', { name: /^actions for /i });
      fireEvent.click(actionButtons[0]);

      const editOption = await screen.findByText(/^edit$/i);
      fireEvent.click(editOption);

      expect(await screen.findByText('Edit Student Group')).toBeInTheDocument();
    });

    it('renders KPI operational strip and opens Import Spreadsheet modal', async () => {
      renderWithProviders(<StudentGroupsPage />);

      // KPI strip cards
      expect(screen.getByText('Total student groups')).toBeInTheDocument();
      expect(screen.getByText('Cumulative strength')).toBeInTheDocument();
      expect(screen.getByText('Academic programs')).toBeInTheDocument();

      // Open Import Modal
      const importBtn = screen.getByRole('button', { name: /import spreadsheet/i });
      fireEvent.click(importBtn);

      expect(await screen.findByText('Import Student Groups from Spreadsheet')).toBeInTheDocument();
    });
  });

  describe('FacultyPage', () => {
    it('renders faculty table with names and max loads', async () => {
      renderWithProviders(<FacultyPage />);

      expect(screen.getByText('Faculty & Instructors')).toBeInTheDocument();
      expect(screen.getByText('Dr. Arvind Sharma')).toBeInTheDocument();
      expect(screen.getByText('a.sharma@campus.edu')).toBeInTheDocument();

      const addBtn = screen.getByRole('button', { name: /add faculty member/i });
      fireEvent.click(addBtn);

      expect(await screen.findByText('Add New Faculty Member')).toBeInTheDocument();
    });
  });

  describe('StudentsPage', () => {
    it('renders students roster and cohort mappings', () => {
      renderWithProviders(<StudentsPage />);

      expect(screen.getByText('Student Admissions & Enrollment')).toBeInTheDocument();
      expect(screen.getByText('Aarav Patel')).toBeInTheDocument();
      expect(screen.getByText('aarav.p@campus.edu')).toBeInTheDocument();
    });
  });

  describe('RoomsPage', () => {
    it('renders classrooms and capacities', () => {
      renderWithProviders(<RoomsPage />);

      expect(screen.getByText('Classrooms & Laboratories')).toBeInTheDocument();
      expect(screen.getByText('LH-101')).toBeInTheDocument();
      expect(screen.getAllByText('Engineering Block A')[0]).toBeInTheDocument();
      expect(screen.getByText('120')).toBeInTheDocument();
    });
  });

  describe('CoursesPage', () => {
    it('renders course catalogue and credits', () => {
      renderWithProviders(<CoursesPage />);

      expect(screen.getByText('Course Catalogue & Curriculum')).toBeInTheDocument();
      expect(screen.getByText('CS-301')).toBeInTheDocument();
      expect(screen.getByText('Operating Systems')).toBeInTheDocument();
    });
  });
});
