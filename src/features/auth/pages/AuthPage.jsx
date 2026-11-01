import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Alert,
  Anchor,
  Button,
  Paper,
  PasswordInput,
  Select,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { loginUser, registerUser } from '../thunks/authThunks';
import { clearAuthError } from '../slices/authSlice';
import classes from './AuthPage.module.css';

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, loading, error } = useSelector((state) => state.auth || {});

  const destination = location.state?.from?.pathname || '/admin';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, navigate, destination]);

  const toggleMode = (e) => {
    e.preventDefault();
    setIsRegister((prev) => !prev);
    dispatch(clearAuthError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegister) {
      dispatch(registerUser({ name, email, password, role }));
    } else {
      dispatch(loginUser({ email, password }));
    }
  };

  return (
    <div className={classes.wrapper}>
      <Paper
        component="form"
        onSubmit={handleSubmit}
        className={classes.form}
        radius={0}
        p={30}
      >
        <Title order={2} className={classes.title}>
          {isRegister ? 'Create an Account' : 'Welcome back'}
        </Title>

        {error && (
          <Alert color="red" mt="md" radius="md" title="Authentication Error">
            {typeof error === 'string' ? error : 'Something went wrong'}
          </Alert>
        )}

        {isRegister && (
          <TextInput
            label="Full Name"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            required
            size="md"
            radius="md"
            mt="md"
          />
        )}

        <TextInput
          label="Email address"
          placeholder="user@campus.edu"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          required
          size="md"
          radius="md"
          mt="md"
        />

        <PasswordInput
          label="Password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          required
          size="md"
          radius="md"
          mt="md"
        />

        {isRegister && (
          <Select
            label="Role"
            value={role}
            onChange={(val) => setRole(val || 'student')}
            data={[
              { value: 'admin', label: 'Administrator' },
              { value: 'faculty', label: 'Faculty' },
              { value: 'student', label: 'Student' },
            ]}
            size="md"
            radius="md"
            mt="md"
          />
        )}

        <Button
          type="submit"
          fullWidth
          mt="xl"
          size="md"
          radius="md"
          loading={loading}
        >
          {isRegister ? 'Register' : 'Login'}
        </Button>

        <Text ta="center" mt="md">
          {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          <Anchor component="button" type="button" fw={500} onClick={toggleMode}>
            {isRegister ? 'Login' : 'Register'}
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
}
