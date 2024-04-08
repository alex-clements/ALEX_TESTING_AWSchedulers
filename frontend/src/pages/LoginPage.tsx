import React, { useState, useEffect } from 'react';
import { Button, TextField } from '@mui/material';
import { Box } from '@mui/material';
import { Grid } from '@mui/material';
import { Stack } from '@mui/material';
import { Typography } from '@mui/material';
import { styled } from '@mui/material';
import { useLogin } from '../hooks/useLogin';
import { LoadingButton } from '../components/buttons/LoadingButton';
import { LoginHeader } from '../components/headers/LoginHeader';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useGetAuthenticationStatus } from '../hooks/useGetAuthenticationStatus';
import { useNavigate } from 'react-router-dom';

const StyledTextField = styled(TextField)(({ theme }) => ({
  fieldset: { borderColor: theme.palette.secondary.main },
}));

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [viewPasswordText, setViewPasswordText] = useState<boolean>(false);
  const { login, isLoading, errorMessage } = useLogin();
  const {
    loading: authenticationLoading,
    authenticated,
    getAccess,
  } = useGetAuthenticationStatus({
    adminPermissionLevel: false,
  });
  const navigate = useNavigate();

  const handleClick = () => {
    if (!validateFieldsSet()) return;
    login(username, password);
  };

  const validateFieldsSet = (): boolean => {
    let validationPassed: boolean = true;
    if (username === '') {
      setUsernameError(true);
      validationPassed = false;
    } else {
      setUsernameError(false);
    }

    if (password === '') {
      setPasswordError(true);
      validationPassed = false;
    } else {
      setPasswordError(false);
    }

    return validationPassed;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (password !== '') setPasswordError(false);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (username !== '') setUsernameError(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleClick();
    }
  };

  useEffect(() => {
    getAccess();
  }, []);

  useEffect(() => {
    if (!authenticationLoading && authenticated) {
      navigate('/create-meeting');
    }
  }, [authenticationLoading]);

  return (
    <>
      <LoginHeader />
      <Box sx={{ height: 100 }}></Box>
      {!authenticationLoading && !authenticated && (
        <Grid container>
          <Grid item xs={2} sm={3} lg={4} />
          <Grid item xs={8} sm={6} lg={4}>
            <Box
              sx={{
                borderColor: 'primary.main',
                border: 3,
                borderRadius: 3,
                padding: 2,
              }}
            >
              <Stack spacing={2}>
                <Typography variant="h5">Please sign in:</Typography>
                <StyledTextField
                  color="secondary"
                  label="username"
                  variant="outlined"
                  value={username}
                  onChange={handleUsernameChange}
                  onKeyDown={handleKeyPress}
                  sx={{
                    fieldset: {
                      borderColor: usernameError
                        ? 'red'
                        : 'theme.secondary.main',
                      borderWidth: usernameError ? 2 : 1,
                    },
                  }}
                />
                <StyledTextField
                  color="secondary"
                  label="password"
                  variant="outlined"
                  type={viewPasswordText ? 'text' : 'password'}
                  value={password}
                  onKeyDown={handleKeyPress}
                  onChange={handlePasswordChange}
                  InputProps={{
                    endAdornment: (
                      <Button
                        sx={{ borderRadius: 20 }}
                        onClick={() => setViewPasswordText(!viewPasswordText)}
                      >
                        {viewPasswordText ? <VisibilityOff /> : <Visibility />}
                      </Button>
                    ),
                  }}
                  sx={{
                    fieldset: {
                      borderColor: passwordError
                        ? 'red'
                        : 'theme.secondary.main',
                      borderWidth: passwordError ? 2 : 1,
                    },
                  }}
                />
                <Box
                  sx={{
                    display: 'flex',
                    justifyItems: 'flex-end',
                    justifyContent: 'flex-end',
                    width: '100%',
                  }}
                >
                  <LoadingButton
                    handleClick={handleClick}
                    isLoading={isLoading}
                    label={'Sign In'}
                  />
                </Box>
              </Stack>
            </Box>
            {errorMessage && (
              <p style={{ textAlign: 'center', color: 'red', fontSize: 15 }}>
                {errorMessage}
              </p>
            )}
          </Grid>
          <Grid item xs={2} sm={3} lg={4} />
        </Grid>
      )}
    </>
  );
};

export default LoginPage;
