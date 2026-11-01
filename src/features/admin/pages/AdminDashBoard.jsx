import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Center, Container } from '@mantine/core';
import { AlertCircle } from 'lucide-react';

import { fetchDashboard } from '../thunks/adminThunks.js';
import DashboardRenderer from '../../../shared/sdui/Renderer.jsx';
import Spinner from '../../../shared/components/Spinner.jsx';

export default function AdminDashboard() {
  const dispatch = useDispatch();

  const {
    dashboard = [],
    loading,
    error,
  } = useSelector((state) => state.admin || {});

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <Container py="xl">
        <Center>
          <Alert
            icon={<AlertCircle size={16} />}
            title="Dashboard Error"
            color="red"
            radius="md"
          >
            {typeof error === 'string' ? error : 'Failed to load dashboard data.'}
          </Alert>
        </Center>
      </Container>
    );
  }

  return (
    <DashboardRenderer components={dashboard} />
  );
}
