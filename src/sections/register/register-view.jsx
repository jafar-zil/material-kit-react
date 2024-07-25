import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { alpha, useTheme } from '@mui/material/styles';
import Iconify from 'src/components/iconify';
import Logo from 'src/components/logo';
import { bgGradient } from 'src/theme/css';
import { registerUser } from 'src/services/apiService';
import { useAuth } from 'src/context/AuthContext';

export default function RegisterView() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [nameError, setNameError] = useState('');

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.trim().length > 0;
  const validateName = (name) => name.trim().length > 0;
  const validateConfirmPassword = (confirmPassword) => confirmPassword === passwordInput;

  const handleRegister = async () => {
    setLoading(true);
    setRegisterError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    let isValid = true;
    if (!validateEmail(emailInput)) {
      setEmailError('Invalid email address');
      isValid = false;
    }
    if (!validatePassword(passwordInput)) {
      setPasswordError('Password is required');
      isValid = false;
    }
    if (!validateConfirmPassword(confirmPasswordInput)) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }
    if (!validateName(nameInput)) {
      setNameError('Name is required');
      isValid = false;
    }

    if (!isValid) {
      setLoading(false);
      return;
    }

    try {
      const payloadData = {
        name: nameInput,
        email: emailInput,
        password: passwordInput,
        password_confirmation: confirmPasswordInput,
      };

      const data = await registerUser(payloadData);
      if (data.success) {
        login(data);
        navigate('/');
      } else {
        setRegisterError('Registration failed');
      }
    } catch (error) {
      setRegisterError(error.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField
          name="name"
          label="Name"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          error={!!nameError}
          helperText={nameError}
        />
        <TextField
          name="email"
          label="Email address"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          error={!!emailError}
          helperText={emailError}
        />
        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          error={!!passwordError}
          helperText={passwordError}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          name="confirmPassword"
          label="Confirm Password"
          type={showPassword ? 'text' : 'password'}
          value={confirmPasswordInput}
          onChange={(e) => setConfirmPasswordInput(e.target.value)}
          error={!!confirmPasswordError}
          helperText={confirmPasswordError}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      {registerError && (
        <Typography color="error" variant="body2" sx={{ my: 2 }}>
          {registerError}
        </Typography>
      )}

      <LoadingButton
        fullWidth
        size="large"
        type="button"
        variant="contained"
        color="inherit"
        onClick={handleRegister}
        loading={loading}
        sx={{ mt: 2 }}
      >
        Register
      </LoadingButton>
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>Sign up to Cashflow</Typography>
          {renderForm}
          <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
            Already have an account?
            <Link href="/login" variant="subtitle2" sx={{ ml: 0.5 }}>
              Sign In
            </Link>
          </Typography>
        </Card>
      </Stack>
    </Box>
  );
}
