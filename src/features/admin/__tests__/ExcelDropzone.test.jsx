import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import ExcelDropzone from '../components/ExcelDropzone';
import * as XLSX from 'xlsx';

jest.mock('xlsx', () => {
  const original = jest.requireActual('xlsx');
  return {
    ...original,
    writeFile: jest.fn(),
  };
});

describe('ExcelDropzone Component (Excel Ingestion Seam)', () => {
  const columns = [
    { key: 'code', label: 'Course Code', required: true, example: 'CS-101' },
    { key: 'title', label: 'Course Title', required: true, example: 'Intro to CS' },
    { key: 'credits', label: 'Credits', required: false, example: 3 },
  ];

  it('renders dropzone container and download template button', () => {
    renderWithProviders(
      <ExcelDropzone entityName="Courses" columns={columns} onImport={jest.fn()} />
    );

    expect(screen.getByText('Batch Ingestion: Courses')).toBeInTheDocument();
    expect(screen.getByText('Download Courses Template')).toBeInTheDocument();
    expect(screen.getByText(/drag spreadsheet here/i)).toBeInTheDocument();
  });

  it('generates and downloads workbook when template button is clicked', () => {
    renderWithProviders(
      <ExcelDropzone entityName="Courses" columns={columns} onImport={jest.fn()} />
    );

    const downloadBtn = screen.getByRole('button', { name: /download courses template/i });
    fireEvent.click(downloadBtn);

    expect(XLSX.writeFile).toHaveBeenCalled();
  });

  it('processes valid file drop and triggers onImport callback', async () => {
    const onImportMock = jest.fn();

    renderWithProviders(
      <ExcelDropzone entityName="Courses" columns={columns} onImport={onImportMock} />
    );

    // Create a real test workbook buffer
    const testData = [
      { 'Course Code': 'CS-201', 'Course Title': 'Data Structures', Credits: 4 },
      { 'Course Code': 'CS-202', 'Course Title': '', Credits: 3 }, // Missing required Course Title
    ];
    const ws = XLSX.utils.json_to_sheet(testData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const u8 = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });

    const file = new File([u8], 'courses_batch.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const dropzoneInput = document.querySelector('input[type="file"]');
    if (dropzoneInput) {
      fireEvent.change(dropzoneInput, { target: { files: [file] } });
    }

    await waitFor(() => {
      expect(onImportMock).toHaveBeenCalled();
    });

    const result = onImportMock.mock.calls[0][0];
    expect(result.validRows.length).toBe(1);
    expect(result.validRows[0].code).toBe('CS-201');
    expect(result.invalidRows.length).toBe(1);
    expect(result.invalidRows[0].reason).toContain('Missing required field(s): Course Title');
  });
});
