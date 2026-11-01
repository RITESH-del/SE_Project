import { apiClient } from '../../../shared/api/apiClient';
import {
  loginUser,
  registerUser,
  fetchCurrentUser,
  logoutUser,
} from '../thunks/authThunks';

jest.mock('../../../shared/api/apiClient', () => ({
  apiClient: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

describe('authThunks Async Thunks', () => {
  let dispatch;
  let getState;

  beforeEach(() => {
    dispatch = jest.fn();
    getState = jest.fn();
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('loginUser', () => {
    it('persists token & user to localStorage on successful login', async () => {
      const mockResponse = {
        data: {
          data: {
            token: 'jwt-token-123',
            user: { id: 1, name: 'Alice Admin', role: 'admin' },
          },
        },
      };
      apiClient.post.mockResolvedValueOnce(mockResponse);

      const thunk = loginUser({ email: 'alice@bmu.edu', password: 'password123' });
      const result = await thunk(dispatch, getState, undefined);

      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
        email: 'alice@bmu.edu',
        password: 'password123',
      });
      expect(result.type).toBe('auth/loginUser/fulfilled');
      expect(result.payload.token).toBe('jwt-token-123');
      expect(localStorage.getItem('token')).toBe('jwt-token-123');
      expect(JSON.parse(localStorage.getItem('user'))).toEqual({
        id: 1,
        name: 'Alice Admin',
        role: 'admin',
      });
    });

    it('rejects with server error message on login failure', async () => {
      apiClient.post.mockRejectedValueOnce({
        response: {
          data: { message: 'Invalid email or password' },
        },
      });

      const thunk = loginUser({ email: 'bad@bmu.edu', password: 'wrong' });
      const result = await thunk(dispatch, getState, undefined);

      expect(result.type).toBe('auth/loginUser/rejected');
      expect(result.payload).toBe('Invalid email or password');
    });
  });

  describe('registerUser', () => {
    it('persists credentials to localStorage on successful registration', async () => {
      const mockResponse = {
        data: {
          data: {
            token: 'reg-token-456',
            user: { id: 2, name: 'Bob Faculty', role: 'faculty' },
          },
        },
      };
      apiClient.post.mockResolvedValueOnce(mockResponse);

      const userData = {
        name: 'Bob Faculty',
        email: 'bob@bmu.edu',
        password: 'securePassword',
        role: 'faculty',
      };
      const thunk = registerUser(userData);
      const result = await thunk(dispatch, getState, undefined);

      expect(result.type).toBe('auth/registerUser/fulfilled');
      expect(localStorage.getItem('token')).toBe('reg-token-456');
    });

    it('rejects with error message on registration failure', async () => {
      apiClient.post.mockRejectedValueOnce({
        response: {
          data: { message: 'User already exists' },
        },
      });

      const thunk = registerUser({ email: 'duplicate@bmu.edu' });
      const result = await thunk(dispatch, getState, undefined);

      expect(result.type).toBe('auth/registerUser/rejected');
      expect(result.payload).toBe('User already exists');
    });
  });

  describe('fetchCurrentUser', () => {
    it('returns user and updates localStorage on success', async () => {
      const user = { id: 5, name: 'Current User', role: 'student' };
      apiClient.get.mockResolvedValueOnce({
        data: { data: { user } },
      });

      const thunk = fetchCurrentUser();
      const result = await thunk(dispatch, getState, undefined);

      expect(apiClient.get).toHaveBeenCalledWith('/auth/me');
      expect(result.type).toBe('auth/fetchCurrentUser/fulfilled');
      expect(result.payload).toEqual(user);
      expect(JSON.parse(localStorage.getItem('user'))).toEqual(user);
    });

    it('clears localStorage and rejects on auth failure', async () => {
      localStorage.setItem('token', 'stale');
      localStorage.setItem('user', JSON.stringify({ id: 1 }));

      apiClient.get.mockRejectedValueOnce({
        response: { data: { message: 'Session expired' } },
      });

      const thunk = fetchCurrentUser();
      const result = await thunk(dispatch, getState, undefined);

      expect(result.type).toBe('auth/fetchCurrentUser/rejected');
      expect(result.payload).toBe('Session expired');
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('logoutUser', () => {
    it('clears token and user from localStorage', async () => {
      localStorage.setItem('token', 'token-to-clear');
      localStorage.setItem('user', JSON.stringify({ id: 99 }));

      const thunk = logoutUser();
      const result = await thunk(dispatch, getState, undefined);

      expect(result.type).toBe('auth/logoutUser/fulfilled');
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });
});
