import {
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUser,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  updatePasswordPageRoute,
  loginPageRoute,
  createMeetingPageRoute,
} from '../routing/routes';

// TODO: REMOVE CONSOLE LOGS

// Set outside of hook so that it can be accessed from either functions
const userpool = new CognitoUserPool({
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
});

let user: CognitoUser;

export const useLogin = () => {
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const login = (username: string, password: string) => {
    user = new CognitoUser({
      Username: username,
      Pool: userpool,
    });

    const authDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    setIsLoading(true);
    setErrorMessage('');
    user.authenticateUser(authDetails, {
      onSuccess: () => {
        // Sets the token in localStorage automatically
        console.log('login successful');
        setIsLoading(false);
        navigate(createMeetingPageRoute, { replace: true });
      },
      onFailure: (err) => {
        console.log('login failed', err.message);
        let errMessage = err.message;
        if (errMessage === 'User does not exist.') {
          errMessage +=
            ' Please contact your system administrator to receive an account.';
        }
        setErrorMessage(errMessage);
        setIsLoading(false);
      },
      newPasswordRequired: () => {
        console.log('User requires a new password');
        setIsLoading(false);
        navigate(updatePasswordPageRoute);
      },
    });
  };

  const updatePassword = (newPassword: string) => {
    if (!user) {
      console.log('No user found');
      navigate(loginPageRoute);
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    user.completeNewPasswordChallenge(
      newPassword,
      {},
      {
        onSuccess: () => {
          console.log('Temporary password successfully updated!');
          setIsLoading(false);
          navigate(createMeetingPageRoute);
        },
        onFailure: (err: Error) => {
          console.log(`Temporary password not updated: ${err}`);
          setErrorMessage(err.message);
          setIsLoading(false);
        },
      }
    );
  };

  return { login, updatePassword, isLoading, errorMessage };
};

/**
 * Retrieves the user access token from localStorage
 * Returns an empty string if token not found, which will cause
 * a fetch call to return an error
 * @returns Token or Empty String
 */
export const getCognitoUserToken = (): string => {
  const user = userpool.getCurrentUser();
  let token;
  user?.getSession((error: Error | null, session: CognitoUserSession) => {
    if (error) {
      token = '';
    } else {
      token = session.getAccessToken().getJwtToken();
    }
  });
  return token || '';
};
