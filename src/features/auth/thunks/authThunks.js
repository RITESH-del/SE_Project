import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../../shared/api/apiClient';

const safeSetItem = (key, value) => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    }
  } catch {
    // Ignore storage quota or environment errors
  }
};

const safeRemoveItem = (key) => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    }
  } catch {
    // Ignore storage errors
  }
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const data = response.data?.data || response.data;
      if (data?.token) {
        safeSetItem('token', data.token);
      }
      if (data?.user) {
        safeSetItem('user', JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.message ||
        error.message ||
        'Failed to log in';
      return rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      const data = response.data?.data || response.data;
      if (data?.token) {
        safeSetItem('token', data.token);
      }
      if (data?.user) {
        safeSetItem('user', JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.message ||
        error.message ||
        'Failed to register';
      return rejectWithValue(message);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/auth/me');
      const user = response.data?.data?.user || response.data?.user || response.data;
      if (user) {
        safeSetItem('user', JSON.stringify(user));
      }
      return user;
    } catch (error) {
      safeRemoveItem('token');
      safeRemoveItem('user');
      const message = error.response?.data?.message || 'Failed to authenticate';
      return rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    safeRemoveItem('token');
    safeRemoveItem('user');
    return null;
  }
);
