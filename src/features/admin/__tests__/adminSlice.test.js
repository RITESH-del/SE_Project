import adminReducer, {
  clearAdminError,
  resetAdminDashboard,
} from '../slices/adminSlice';
import { fetchDashboard } from '../thunks/adminThunks';

describe('adminSlice Reducer & Actions', () => {
  const initialState = {
    loading: false,
    error: null,
    dashboard: [],
    timetable: null,
    courses: null,
    faculty: null,
    students: null,
    rooms: null,
    settings: null,
  };

  it('returns initial state when action is undefined', () => {
    const state = adminReducer(undefined, { type: 'unknown' });
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.studentGroups.length).toBeGreaterThan(0);
    expect(state.faculty.length).toBeGreaterThan(0);
    expect(state.rooms.length).toBeGreaterThan(0);
    expect(state.courses.length).toBeGreaterThan(0);
  });

  it('clears error on clearAdminError action', () => {
    const state = { ...initialState, error: 'Database timeout' };
    const nextState = adminReducer(state, clearAdminError());
    expect(nextState.error).toBeNull();
  });

  it('resets dashboard state on resetAdminDashboard action', () => {
    const state = {
      ...initialState,
      dashboard: [{ type: 'stats' }],
      loading: true,
      error: 'Some error',
    };
    const nextState = adminReducer(state, resetAdminDashboard());
    expect(nextState.dashboard).toEqual([]);
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBeNull();
  });

  describe('fetchDashboard transitions', () => {
    it('sets loading true and clears error on fetchDashboard.pending', () => {
      const state = { ...initialState, error: 'Old error' };
      const nextState = adminReducer(state, { type: fetchDashboard.pending.type });
      expect(nextState.loading).toBe(true);
      expect(nextState.error).toBeNull();
    });

    it('stores components payload on fetchDashboard.fulfilled', () => {
      const components = [
        { type: 'stats', data: { courses: 10 } },
        { type: 'row', data: { children: [] } },
      ];
      const nextState = adminReducer(
        { ...initialState, loading: true },
        {
          type: fetchDashboard.fulfilled.type,
          payload: { components },
        }
      );

      expect(nextState.loading).toBe(false);
      expect(nextState.dashboard).toEqual(components);
      expect(nextState.error).toBeNull();
    });

    it('sets error and resets loading on fetchDashboard.rejected', () => {
      const nextState = adminReducer(
        { ...initialState, loading: true },
        {
          type: fetchDashboard.rejected.type,
          payload: 'Network error',
        }
      );

      expect(nextState.loading).toBe(false);
      expect(nextState.error).toBe('Network error');
    });
  });
});
