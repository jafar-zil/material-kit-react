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
import { useAuth } from 'src/context/AuthContext';
import { loginUser } from 'src/services/apiService';

export default function LoginView() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password) => password.trim().length > 0;

  const handleLogin = async () => {
    setLoading(true);
    setLoginError('');
    setEmailError('');
    setPasswordError('');

    let isValid = true;
    if (!validateEmail(emailInput)) {
      setEmailError('Invalid email address');
      isValid = false;
    }
    if (!validatePassword(passwordInput)) {
      setPasswordError('Password is required');
      isValid = false;
    }

    if (!isValid) {
      setLoading(false);
      return;
    }

    try {
      const data = await loginUser(emailInput, passwordInput);
      if (data.success) {
        login(data);
        navigate('/');
      } else {
        setLoginError('Invalid email or password');
      }
    } catch (error) {
      setLoginError(error.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderForm = (
    <>
      <Stack spacing={3}>
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
      </Stack>

      {loginError && (
        <Typography color="error" variant="body2" sx={{ my: 2 }}>
          {loginError}
        </Typography>
      )}

      <LoadingButton
        fullWidth
        size="large"
        type="button"
        variant="contained"
        color="inherit"
        onClick={handleLogin}
        loading={loading}
        sx={{ mt: 2 }}
      >
        Login
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
          <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>Sign in to Cashflow</Typography>
          {renderForm}
          <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
            Don’t have an account?
            <Link href="/register" variant="subtitle2" sx={{ ml: 0.5 }}>
              Sign Up
            </Link>
          </Typography>
        </Card>
      </Stack>
    </Box>
  );
}