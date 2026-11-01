import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import AuthPage from '../pages/AuthPage';
import * as authThunks from '../thunks/authThunks';

describe('AuthPage Component (Auth Seam)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders login form by default', () => {
    renderWithProviders(<AuthPage />);

    expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^login$/i })).toBeInTheDocument();
    expect(screen.queryByLabelText(/full name/i)).not.toBeInTheDocument();
  });

  it('switches to registration mode when toggled', () => {
    renderWithProviders(<AuthPage />);

    const registerToggle = screen.getByRole('button', { name: /^register$/i });
    fireEvent.click(registerToggle);

    expect(screen.getByRole('heading', { name: 'Create an Account' })).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^register$/i })).toBeInTheDocument();
  });

  it('displays authentication error alert when error is present in state', () => {
    renderWithProviders(<AuthPage />, {
      preloadedState: {
        auth: {
          error: 'Invalid credentials provided',
          loading: false,
          isAuthenticated: false,
        },
      },
    });

    expect(screen.getByText('Authentication Error')).toBeInTheDocument();
    expect(screen.getByText('Invalid credentials provided')).toBeInTheDocument();
  });

  it('dispatches loginUser thunk on login form submit', async () => {
    const loginSpy = jest.spyOn(authThunks, 'loginUser').mockReturnValue({
      type: 'auth/loginUser/pending',
    });

    renderWithProviders(<AuthPage />);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'user@campus.edu' },
    });
    fireEvent.change(screen.getByPlaceholderText('Your password'), {
      target: { value: 'secretpass' },
    });

    fireEvent.click(screen.getByRole('button', { name: /^login$/i }));

    expect(loginSpy).toHaveBeenCalledWith({
      email: 'user@campus.edu',
      password: 'secretpass',
    });
  });

  it('dispatches registerUser thunk on registration form submit', async () => {
    const registerSpy = jest.spyOn(authThunks, 'registerUser').mockReturnValue({
      type: 'auth/registerUser/pending',
    });

    renderWithProviders(<AuthPage />);

    // Toggle to registration
    fireEvent.click(screen.getByRole('button', { name: /^register$/i }));

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Jane Doe' },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'jane@campus.edu' },
    });
    fireEvent.change(screen.getByPlaceholderText('Your password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /^register$/i }));

    expect(registerSpy).toHaveBeenCalledWith({
      name: 'Jane Doe',
      email: 'jane@campus.edu',
      password: 'password123',
      role: 'student',
    });
  });
});
