import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
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
import { useAuth } from 'src/context/AuthContext'; // Import useAuth hook
import { loginUser } from 'src/services/apiService'; 

export default function LoginView() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth(); // Use login function from context
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setLoginError('');

    try {
      const data = await loginUser(email, password);
      if (data.success) {
        login(data.token); // Use login function from context
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          <Typography variant="h4">Sign in to Minimal</Typography>
          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
