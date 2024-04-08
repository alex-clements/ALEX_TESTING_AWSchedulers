import { useState, useEffect } from 'react';
import { Box, TextField, Typography, styled } from '@mui/material';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import { useLogin } from '../hooks/useLogin';
import { LoadingButton } from '../components/buttons/LoadingButton';
import { LoginHeader } from '../components/headers/LoginHeader';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Button } from '@mui/material';

const StyledTextField = styled(TextField)(({ theme }) => ({
  fieldset: { borderColor: theme.palette.secondary.main },
}));

interface PasswordRequirements {
  requirement: string;
  regex: RegExp;
}

interface PasswordRequirementsMessage {
  requirement: string;
  satisfied: boolean;
}

const passwordRequirements: PasswordRequirements[] = [
  { requirement: '8 characters', regex: /^\S{8,}$/ },
  {
    requirement: 'one special character',
    regex: /[!@#$%^&*()\-_=+[\]{};:'"|<>,.?/]/,
  },
  { requirement: 'one lower case character', regex: /[a-z]+/ },
  { requirement: 'one upper case character', regex: /[A-Z]+/ },
  { requirement: 'one number', regex: /[0-9]+/ },
];

const UpdatePasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordRequirementsMessages, setPasswordRequirementsMessages] =
    useState<PasswordRequirementsMessage[]>([]);
  const [viewPasswordText, setViewPasswordText] = useState<boolean>(false);

  const { updatePassword, isLoading } = useLogin();

  const validatePasswordRequirements = (): boolean => {
    const errStrings: PasswordRequirementsMessage[] = [];
    let errorEncountered = false;

    passwordRequirements.forEach((requirement) => {
      const satisfied: boolean = requirement.regex.test(newPassword);
      if (!satisfied) errorEncountered = true;
      errStrings.push({
        requirement: requirement.requirement,
        satisfied,
      });
    });

    if (errorEncountered) {
      setPasswordRequirementsMessages([...errStrings]);
    } else {
      setPasswordRequirementsMessages([]);
    }
    setPasswordError(errorEncountered);
    return !errorEncountered;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleClick();
    }
  };

  const handleClick = () => {
    if (!validatePasswordRequirements()) return;
    updatePassword(newPassword);
  };

  useEffect(() => {
    if (newPassword !== '') {
      validatePasswordRequirements();
    } else {
      setPasswordRequirementsMessages([]);
      setPasswordError(false);
    }
  }, [newPassword]);

  return (
    <>
      <LoginHeader />
      <Box sx={{ height: 100 }}></Box>
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
              <Typography variant="h5">Set your password</Typography>
              <StyledTextField
                color="secondary"
                label="new password"
                variant="outlined"
                type={viewPasswordText ? 'text' : 'password'}
                value={newPassword}
                onChange={handlePasswordChange}
                onKeyDown={handleKeyPress}
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
                    borderColor: passwordError ? 'red' : 'theme.secondary.main',
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
                  label="Update"
                />
              </Box>
            </Stack>
          </Box>
          {passwordRequirementsMessages.length > 0 && (
            <div
              style={{
                margin: 'auto',
                width: '60%',
              }}
            >
              <p
                style={{
                  textAlign: 'left',
                  color: 'red',
                  marginBottom: 0,
                  fontSize: 15,
                }}
              >
                Password must include at least:
              </p>
              {passwordRequirementsMessages.map((message) => (
                <p
                  key={message.requirement}
                  style={{
                    color: message.satisfied ? 'green' : 'red',
                    marginTop: 0,
                    marginBottom: 0,
                    marginLeft: 5,
                    fontSize: 15,
                  }}
                >
                  - {message.requirement} {message.satisfied ? `✅` : `❌`}
                </p>
              ))}
            </div>
          )}
        </Grid>
        <Grid item xs={2} sm={3} lg={4} />
      </Grid>
    </>
  );
};

export default UpdatePasswordPage;
