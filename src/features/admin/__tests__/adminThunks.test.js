import { apiClient } from '../../../shared/api/apiClient';
import { fetchDashboard, mockDashboardData } from '../thunks/adminThunks';

jest.mock('../../../shared/api/apiClient', () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

describe('adminThunks Async Thunks', () => {
  let dispatch;
  let getState;

  beforeEach(() => {
    dispatch = jest.fn();
    getState = jest.fn();
    jest.clearAllMocks();
  });

  it('returns backend components when apiClient.get succeeds', async () => {
    const backendData = {
      components: [
        { type: 'stats', data: { courses: 50, faculty: 80 } },
      ],
    };
    apiClient.get.mockResolvedValueOnce({ data: backendData });

    const thunk = fetchDashboard();
    const result = await thunk(dispatch, getState, undefined);

    expect(apiClient.get).toHaveBeenCalledWith('/admin/dashboard');
    expect(result.type).toBe('admin/fetchDashboard/fulfilled');
    expect(result.payload).toEqual(backendData);
  });

  it('falls back to mockDashboardData when backend call fails', async () => {
    apiClient.get.mockRejectedValueOnce(new Error('Connection refused'));

    const thunk = fetchDashboard();
    const result = await thunk(dispatch, getState, undefined);

    expect(apiClient.get).toHaveBeenCalledWith('/admin/dashboard');
    expect(result.type).toBe('admin/fetchDashboard/fulfilled');
    expect(result.payload).toEqual(mockDashboardData);
  });
});
