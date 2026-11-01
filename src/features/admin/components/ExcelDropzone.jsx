import { useState } from 'react';
import { Group, Text, Button, Paper, Stack, Badge } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { FileSpreadsheet, Upload, Download, CheckCircle, FileCheck } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function ExcelDropzone({
  entityName,
  columns = [],
  onImport,
}) {
  const [loading, setLoading] = useState(false);
  const [lastUploadedFile, setLastUploadedFile] = useState(null);

  const handleDownloadTemplate = (e) => {
    e.stopPropagation();
    const templateRow = {};
    columns.forEach((col) => {
      templateRow[col.label] = col.example ?? '';
    });

    const worksheet = XLSX.utils.json_to_sheet([templateRow]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, entityName);
    XLSX.writeFile(workbook, `${entityName.toLowerCase().replace(/\s+/g, '_')}_template.xlsx`);
  };

  const handleFileDrop = async (files) => {
    const file = files[0];
    if (!file) return;

    setLoading(true);
    setLastUploadedFile(file.name);

    try {
      const buffer = typeof file.arrayBuffer === 'function'
        ? await file.arrayBuffer()
        : await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
          });
      const workbook = XLSX.read(buffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rawRows = XLSX.utils.sheet_to_json(worksheet);

      const validRows = [];
      const invalidRows = [];

      // Map labels back to keys
      const labelToKey = {};
      columns.forEach((col) => {
        labelToKey[col.label.toLowerCase().trim()] = col.key;
        labelToKey[col.key.toLowerCase().trim()] = col.key;
      });

      rawRows.forEach((row, index) => {
        const normalizedRow = {};
        Object.entries(row).forEach(([colHeader, val]) => {
          const matchedKey = labelToKey[String(colHeader).toLowerCase().trim()];
          if (matchedKey) {
            normalizedRow[matchedKey] = val;
          }
        });

        // Validate required fields
        const missingFields = columns
          .filter((col) => col.required && (normalizedRow[col.key] === undefined || normalizedRow[col.key] === ''))
          .map((col) => col.label);

        if (missingFields.length > 0) {
          invalidRows.push({
            rowNumber: index + 2, // Excel 1-based header + 1
            data: row,
            reason: `Missing required field(s): ${missingFields.join(', ')}`,
          });
        } else {
          validRows.push({
            id: Date.now() + index + Math.random(),
            ...normalizedRow,
          });
        }
      });

      if (onImport) {
        onImport({ validRows, invalidRows, totalProcessed: rawRows.length });
      }
    } catch (err) {
      if (onImport) {
        onImport({
          validRows: [],
          invalidRows: [{ rowNumber: 1, data: {}, reason: `File parse error: ${err.message}` }],
          totalProcessed: 0,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper p="md" withBorder radius="md" style={{ backgroundColor: 'var(--mantine-color-dark-8, #111827)' }}>
      <Stack gap="sm">
        <Group justify="space-between" wrap="wrap">
          <Group gap="xs">
            <FileSpreadsheet size={20} color="var(--mantine-color-blue-4)" />
            <Text fw={600} size="sm">
              Batch Ingestion: {entityName}
            </Text>
            <Badge variant="outline" size="sm" color="blue">
              .xlsx, .xls, .csv
            </Badge>
          </Group>

          <Button
            variant="default"
            size="xs"
            leftSection={<Download size={14} />}
            onClick={handleDownloadTemplate}
          >
            Download {entityName} Template
          </Button>
        </Group>

        <Dropzone
          onDrop={handleFileDrop}
          loading={loading}
          accept={[
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
            'text/csv',
          ]}
          maxFiles={1}
          radius="sm"
          styles={{
            root: {
              borderStyle: 'dashed',
              borderWidth: 1.5,
              borderColor: 'var(--mantine-color-dark-4, #374151)',
              backgroundColor: 'var(--mantine-color-dark-9, #0B0F17)',
              padding: '16px',
            },
          }}
        >
          <Group justify="center" gap="md" style={{ minHeight: 60, pointerEvents: 'none' }}>
            <Dropzone.Accept>
              <Upload size={32} color="var(--mantine-color-blue-6)" />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <CheckCircle size={32} color="var(--mantine-color-red-6)" />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <FileCheck size={28} color="var(--mantine-color-dimmed)" />
            </Dropzone.Idle>

            <Stack gap={2} align="center">
              <Text size="sm" inline fw={500}>
                Drag spreadsheet here or click to select file
              </Text>
              <Text size="xs" c="dimmed" inline>
                Valid entries will be automatically verified and added to the roster
              </Text>
              {lastUploadedFile && (
                <Text size="xs" c="blue" fw={500} mt={4}>
                  Last uploaded: {lastUploadedFile}
                </Text>
              )}
            </Stack>
          </Group>
        </Dropzone>
      </Stack>
    </Paper>
  );
}
