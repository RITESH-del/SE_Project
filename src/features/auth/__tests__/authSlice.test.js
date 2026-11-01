import authReducer, {
  clearAuthError,
  logout,
} from '../slices/authSlice';
import {
  loginUser,
  registerUser,
  fetchCurrentUser,
  logoutUser,
} from '../thunks/authThunks';

describe('authSlice Reducer & Actions', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const baseState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };

  it('handles clearAuthError action', () => {
    const state = { ...baseState, error: 'Invalid credentials' };
    const nextState = authReducer(state, clearAuthError());
    expect(nextState.error).toBeNull();
  });

  it('handles logout action and clears localStorage', () => {
    localStorage.setItem('token', 'sample-token');
    localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Admin' }));

    const state = {
      user: { id: 1, name: 'Admin' },
      token: 'sample-token',
      isAuthenticated: true,
      loading: false,
      error: null,
    };

    const nextState = authReducer(state, logout());
    expect(nextState.isAuthenticated).toBe(false);
    expect(nextState.user).toBeNull();
    expect(nextState.token).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  describe('loginUser transitions', () => {
    it('sets loading true and clears error on pending', () => {
      const state = { ...baseState, error: 'Previous error' };
      const nextState = authReducer(state, { type: loginUser.pending.type });
      expect(nextState.loading).toBe(true);
      expect(nextState.error).toBeNull();
    });

    it('updates user, token, and isAuthenticated on fulfilled', () => {
      const payload = {
        user: { id: 10, email: 'admin@bmu.edu', role: 'admin' },
        token: 'auth-jwt-token',
      };
      const nextState = authReducer(baseState, {
        type: loginUser.fulfilled.type,
        payload,
      });

      expect(nextState.loading).toBe(false);
      expect(nextState.isAuthenticated).toBe(true);
      expect(nextState.user).toEqual(payload.user);
      expect(nextState.token).toBe(payload.token);
      expect(nextState.error).toBeNull();
    });

    it('sets error and sets loading false on rejected', () => {
      const nextState = authReducer(
        { ...baseState, loading: true },
        {
          type: loginUser.rejected.type,
          payload: 'Invalid email or password',
        }
      );

      expect(nextState.loading).toBe(false);
      expect(nextState.isAuthenticated).toBe(false);
      expect(nextState.error).toBe('Invalid email or password');
    });
  });

  describe('registerUser transitions', () => {
    it('updates auth state on fulfilled', () => {
      const payload = {
        user: { id: 2, name: 'Student', role: 'student' },
        token: 'registered-jwt',
      };
      const nextState = authReducer(baseState, {
        type: registerUser.fulfilled.type,
        payload,
      });

      expect(nextState.isAuthenticated).toBe(true);
      expect(nextState.user).toEqual(payload.user);
      expect(nextState.token).toBe('registered-jwt');
    });

    it('sets error on rejected', () => {
      const nextState = authReducer(baseState, {
        type: registerUser.rejected.type,
        payload: 'Email already in use',
      });

      expect(nextState.loading).toBe(false);
      expect(nextState.error).toBe('Email already in use');
    });
  });

  describe('fetchCurrentUser and logoutUser', () => {
    it('updates user on fetchCurrentUser.fulfilled', () => {
      const user = { id: 3, name: 'Faculty User', role: 'faculty' };
      const nextState = authReducer(baseState, {
        type: fetchCurrentUser.fulfilled.type,
        payload: user,
      });

      expect(nextState.user).toEqual(user);
      expect(nextState.isAuthenticated).toBe(true);
      expect(nextState.loading).toBe(false);
    });

    it('clears credentials on fetchCurrentUser.rejected', () => {
      const state = {
        user: { id: 3 },
        token: 'stale-token',
        isAuthenticated: true,
        loading: true,
        error: null,
      };
      const nextState = authReducer(state, {
        type: fetchCurrentUser.rejected.type,
        payload: 'Token expired',
      });

      expect(nextState.isAuthenticated).toBe(false);
      expect(nextState.user).toBeNull();
      expect(nextState.token).toBeNull();
      expect(nextState.error).toBe('Token expired');
    });

    it('resets state on logoutUser.fulfilled', () => {
      const state = {
        user: { id: 1 },
        token: 'token-xyz',
        isAuthenticated: true,
        loading: false,
        error: null,
      };
      const nextState = authReducer(state, {
        type: logoutUser.fulfilled.type,
      });

      expect(nextState.isAuthenticated).toBe(false);
      expect(nextState.user).toBeNull();
      expect(nextState.token).toBeNull();
    });
  });
});
