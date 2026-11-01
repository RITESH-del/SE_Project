import { render } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import authReducer from './features/auth/slices/authSlice';
import adminReducer from './features/admin/slices/adminSlice';

export function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      auth: authReducer,
      admin: adminReducer,
    },
    preloadedState,
  });
}

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    initialEntries = ['/'],
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MantineProvider defaultColorScheme="dark">
          <MemoryRouter initialEntries={initialEntries}>
            {children}
          </MemoryRouter>
        </MantineProvider>
      </Provider>
    );
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
