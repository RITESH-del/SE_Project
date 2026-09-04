import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchDashboard } from '../thunks/adminThunks.js';
import DashboardRenderer from '../../../shared/sdui/Renderer.jsx';

export default function AdminDashboard() {
  const dispatch = useDispatch();

  const {
    dashboard,
    loading,
    error,
  } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (error) {
    return <div>Failed to load dashboard.</div>;
  }

  return (
    <DashboardRenderer components={dashboard} />
  );
}
