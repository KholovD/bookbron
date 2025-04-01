import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from '@/theme';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '@/store/reducers';

export const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: initialState
  });
};

export const renderWithProviders = (
  ui: React.ReactElement,
  {
    initialState = {},
    store = createTestStore(initialState),
    queryClient = new QueryClient(),
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            {children}
          </ThemeProvider>
        </QueryClientProvider>
      </Provider>
    );
  };

  return {
    store,
    queryClient,
    ...render(ui, { wrapper: Wrapper, ...renderOptions })
  };
};

export const mockApi = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
};

export const waitForLoadingToFinish = () =>
  new Promise((resolve) => setTimeout(resolve, 0)); 