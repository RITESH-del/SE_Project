import { useState, useMemo } from 'react';
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Drawer,
  Grid,
  Group,
  Menu,
  Modal,
  NumberInput,
  Paper,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
  ScrollArea,
} from '@mantine/core';
import {
  AlertCircle,
  Check,
  Edit2,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  FileSpreadsheet,
  Upload,
} from 'lucide-react';
import ExcelDropzone from './ExcelDropzone';

export default function EntityManagementPage({
  title,
  subtitle,
  entityName,
  entitySingular,
  columns = [],
  rows = [],
  kpiStats = [],
  onAddRow,
  onUpdateRow,
  onDeleteRow,
  onBatchImport,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [importModalOpened, setImportModalOpened] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [formData, setFormData] = useState({});
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [invalidRowsTray, setInvalidRowsTray] = useState([]);
  const [importSuccessCount, setImportSuccessCount] = useState(null);

  // Form field state handlers
  const handleOpenCreate = () => {
    setEditingRow(null);
    const initialData = {};
    columns.forEach((col) => {
      initialData[col.key] = col.defaultValue ?? '';
    });
    setFormData(initialData);
    setDrawerOpened(true);
  };

  const handleOpenEdit = (row) => {
    setEditingRow(row);
    setFormData({ ...row });
    setDrawerOpened(true);
  };

  const handleSaveForm = (e) => {
    e.preventDefault();
    if (editingRow) {
      if (onUpdateRow) {
        onUpdateRow({ ...editingRow, ...formData });
      }
    } else {
      if (onAddRow) {
        onAddRow({
          id: Date.now() + Math.random(),
          ...formData,
        });
      }
    }
    setDrawerOpened(false);
  };

  const handleConfirmDelete = () => {
    if (rowToDelete && onDeleteRow) {
      onDeleteRow(rowToDelete.id);
    }
    setDeleteModalOpened(false);
    setRowToDelete(null);
  };

  const handleExcelImport = ({ validRows, invalidRows }) => {
    if (validRows.length > 0 && onBatchImport) {
      onBatchImport(validRows);
      setImportSuccessCount(validRows.length);
      if (invalidRows.length === 0) {
        setImportModalOpened(false);
      }
    }
    setInvalidRowsTray(invalidRows);
  };

  // Filter rows based on search
  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return rows;
    const query = searchQuery.toLowerCase();
    return rows.filter((row) =>
      columns.some((col) => {
        const val = row[col.key];
        return val !== undefined && val !== null && String(val).toLowerCase().includes(query);
      })
    );
  }, [rows, columns, searchQuery]);

  return (
    <Stack gap="lg" p="md">
      {/* 1. Header with Title & Action Buttons */}
      <Group justify="space-between" align="flex-start" wrap="wrap">
        <div>
          <Title order={2} fw={700}>
            {title}
          </Title>
          {subtitle && (
            <Text c="dimmed" size="sm" mt={3}>
              {subtitle}
            </Text>
          )}
        </div>

        <Group gap="xs">
          <Button
            variant="default"
            size="sm"
            leftSection={<Upload size={15} />}
            onClick={() => setImportModalOpened(true)}
          >
            Import Spreadsheet
          </Button>

          <Button
            leftSection={<Plus size={15} />}
            onClick={handleOpenCreate}
            size="sm"
            color="blue"
          >
            Add {entitySingular}
          </Button>
        </Group>
      </Group>

      {/* 2. Operations KPI Summary Strip */}
      {kpiStats && kpiStats.length > 0 && (
        <Grid gutter="sm">
          {kpiStats.map((stat, idx) => (
            <Grid.Col key={idx} span={{ base: 12, sm: 6, md: 12 / Math.min(kpiStats.length, 4) }}>
              <Paper p="sm" withBorder radius="md">
                <Group justify="space-between" align="center">
                  <div>
                    <Text size="xs" c="dimmed" fw={500}>
                      {stat.label}
                    </Text>
                    <Text size="xl" fw={700} mt={3}>
                      {stat.value}
                    </Text>
                    {stat.helper && (
                      <Text size="xs" c="dimmed" mt={2}>
                        {stat.helper}
                      </Text>
                    )}
                  </div>
                  {stat.icon && (
                    <div style={{ opacity: 0.85 }}>
                      {stat.icon}
                    </div>
                  )}
                </Group>
              </Paper>
            </Grid.Col>
          ))}
        </Grid>
      )}

      {/* Success Notification Alert */}
      {importSuccessCount !== null && (
        <Alert
          icon={<Check size={16} />}
          color="teal"
          title="Import Successful"
          withCloseButton
          onClose={() => setImportSuccessCount(null)}
        >
          Successfully added {importSuccessCount} {importSuccessCount === 1 ? entitySingular : entityName} to the roster.
        </Alert>
      )}

      {/* 3. Main Data Table Panel */}
      <Paper p="md" withBorder radius="md">
        <Stack gap="md">
          {/* Table Search & Status Bar */}
          <Group justify="space-between" wrap="wrap">
            <TextInput
              placeholder={`Search ${entityName.toLowerCase()}...`}
              leftSection={<Search size={15} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              w={{ base: '100%', sm: 300 }}
              size="sm"
            />

            <Group gap="xs">
              <Badge
                variant="light"
                color="gray"
                size="sm"
                radius="sm"
                styles={{ root: { textTransform: 'none', fontWeight: 500 } }}
              >
                Total: {filteredRows.length} {filteredRows.length === 1 ? entitySingular.toLowerCase() : entityName.toLowerCase()}
              </Badge>
            </Group>
          </Group>

          {/* Mantine Data Table */}
          <ScrollArea h={460}>
            <Table highlightOnHover verticalSpacing="sm" withTableBorder>
              <Table.Thead
                style={{
                  backgroundColor: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))',
                  borderBottom: '1px solid light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-5))',
                }}
              >
                <Table.Tr>
                  {columns.map((col) => (
                    <Table.Th key={col.key}>
                      <Text
                        fw={600}
                        size="xs"
                        c="light-dark(var(--mantine-color-gray-7), var(--mantine-color-gray-4))"
                      >
                        {col.label}
                      </Text>
                    </Table.Th>
                  ))}
                  <Table.Th style={{ width: 70, textAlign: 'center' }}>
                    <Text
                      fw={600}
                      size="xs"
                      c="light-dark(var(--mantine-color-gray-7), var(--mantine-color-gray-4))"
                    >
                      Action
                    </Text>
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>
                {filteredRows.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={columns.length + 1}>
                      <Stack align="center" gap="xs" py="xl">
                        <FileSpreadsheet size={32} opacity={0.3} />
                        <Text ta="center" c="dimmed" size="sm">
                          No {entityName.toLowerCase()} found matching your filter.
                        </Text>
                      </Stack>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  filteredRows.map((row, index) => (
                    <Table.Tr key={row.id ?? index}>
                      {columns.map((col) => (
                        <Table.Td key={col.key}>
                          {col.type === 'badge' ? (
                            <Badge
                              color={
                                String(row[col.key]).toLowerCase().includes('active') ||
                                String(row[col.key]).toLowerCase().includes('enrolled') ||
                                String(row[col.key]).toLowerCase().includes('operational')
                                  ? 'teal'
                                  : 'blue'
                              }
                              variant="light"
                              size="sm"
                              radius="sm"
                              styles={{
                                root: {
                                  textTransform: 'none',
                                  fontWeight: 500,
                                },
                              }}
                            >
                              <Group gap={6} wrap="nowrap">
                                <span
                                  style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    backgroundColor: 'currentColor',
                                    display: 'inline-block',
                                  }}
                                />
                                <span>{row[col.key] ?? '-'}</span>
                              </Group>
                            </Badge>
                          ) : (
                            <Text size="sm">{row[col.key] ?? '-'}</Text>
                          )}
                        </Table.Td>
                      ))}

                      {/* Action Menu */}
                      <Table.Td style={{ textAlign: 'center' }}>
                        <Menu shadow="md" width={140} position="bottom-end">
                          <Menu.Target>
                            <ActionIcon variant="subtle" size="sm" aria-label={`Actions for ${row.id}`}>
                              <MoreVertical size={16} />
                            </ActionIcon>
                          </Menu.Target>

                          <Menu.Dropdown>
                            <Menu.Item
                              leftSection={<Edit2 size={14} />}
                              onClick={() => handleOpenEdit(row)}
                            >
                              Edit
                            </Menu.Item>
                            <Menu.Item
                              color="red"
                              leftSection={<Trash2 size={14} />}
                              onClick={() => {
                                setRowToDelete(row);
                                setDeleteModalOpened(true);
                              }}
                            >
                              Delete
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Table.Td>
                    </Table.Tr>
                  ))
                )}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </Stack>
      </Paper>

      {/* 4. Excel Ingestion Modal */}
      <Modal
        opened={importModalOpened}
        onClose={() => {
          setImportModalOpened(false);
          setInvalidRowsTray([]);
        }}
        title={
          <Group gap="xs">
            <FileSpreadsheet size={18} color="var(--mantine-color-blue-4)" />
            <Text fw={700}>Import {entityName} from Spreadsheet</Text>
          </Group>
        }
        size="lg"
        centered
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Upload an Excel (.xlsx, .xls) or CSV (.csv) file to batch populate the {entityName.toLowerCase()} catalogue. You can download a pre-formatted template with all required columns.
          </Text>

          <ExcelDropzone
            entityName={entityName}
            columns={columns}
            onImport={handleExcelImport}
          />

          {/* Validation Warnings Tray inside Modal */}
          {invalidRowsTray.length > 0 && (
            <Alert
              icon={<AlertCircle size={16} />}
              color="red"
              title={`Validation Warnings: ${invalidRowsTray.length} row(s) skipped`}
            >
              <Stack gap="xs" mt="xs">
                <Text size="xs">
                  The following rows did not meet required column rules:
                </Text>
                <ScrollArea.Autosize mah={120}>
                  <Stack gap={4}>
                    {invalidRowsTray.map((inv, idx) => (
                      <Group key={idx} justify="space-between" gap="sm">
                        <Text size="xs" fw={600} c="red">
                          Row {inv.rowNumber}:
                        </Text>
                        <Text size="xs" c="dimmed">
                          {inv.reason}
                        </Text>
                      </Group>
                    ))}
                  </Stack>
                </ScrollArea.Autosize>
              </Stack>
            </Alert>
          )}

          <Group justify="flex-end" mt="sm">
            <Button
              variant="default"
              onClick={() => {
                setImportModalOpened(false);
                setInvalidRowsTray([]);
              }}
            >
              Close
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* 5. Create / Edit Drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        title={
          <Text fw={700} size="lg">
            {editingRow ? `Edit ${entitySingular}` : `Add New ${entitySingular}`}
          </Text>
        }
        position="right"
        size="md"
        padding="lg"
      >
        <form onSubmit={handleSaveForm}>
          <Stack gap="md" mt="sm">
            {columns.map((col) => {
              if (col.type === 'select') {
                return (
                  <Select
                    key={col.key}
                    label={col.label}
                    data={col.options || []}
                    value={formData[col.key] ? String(formData[col.key]) : ''}
                    onChange={(val) => setFormData((prev) => ({ ...prev, [col.key]: val }))}
                    required={col.required}
                  />
                );
              }

              if (col.type === 'number') {
                return (
                  <NumberInput
                    key={col.key}
                    label={col.label}
                    value={formData[col.key] ?? 0}
                    onChange={(val) => setFormData((prev) => ({ ...prev, [col.key]: val }))}
                    min={col.min ?? 0}
                    max={col.max ?? 1000}
                    required={col.required}
                  />
                );
              }

              return (
                <TextInput
                  key={col.key}
                  label={col.label}
                  placeholder={col.placeholder || col.example}
                  value={formData[col.key] ?? ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, [col.key]: e.currentTarget.value }))
                  }
                  required={col.required}
                />
              );
            })}

            <Group justify="flex-end" mt="xl">
              <Button variant="default" onClick={() => setDrawerOpened(false)}>
                Cancel
              </Button>
              <Button type="submit" color="blue">
                {editingRow ? 'Update' : 'Create'} {entitySingular}
              </Button>
            </Group>
          </Stack>
        </form>
      </Drawer>

      {/* 6. Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        title="Confirm Deletion"
        centered
      >
        <Stack gap="md">
          <Text size="sm">
            Are you sure you want to delete this {entitySingular.toLowerCase()} entry? This action cannot be undone.
          </Text>

          <Group justify="flex-end">
            <Button variant="default" onClick={() => setDeleteModalOpened(false)}>
              Cancel
            </Button>
            <Button color="red" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
