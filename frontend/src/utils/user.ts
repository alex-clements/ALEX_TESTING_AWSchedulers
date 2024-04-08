import { CognitoUserPool } from 'amazon-cognito-identity-js';

// Set outside of hook so that it can be accessed from either functions
const userpool = new CognitoUserPool({
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
});

export const getUsername = () => {
  const user = userpool.getCurrentUser();
  return user?.getUsername();
};
