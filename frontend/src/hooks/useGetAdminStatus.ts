import {
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import { useState, useEffect } from 'react';

// Set outside of hook so that it can be accessed from either functions
const userpool = new CognitoUserPool({
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
});

export const useGetAdminStatus = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const user = userpool.getCurrentUser();

  useEffect(() => {
    if (import.meta.env.VITE_NODE_ENV === 'test') {
      setIsLoading(false);
      setIsAdmin(true);
      return;
    }
    user?.getSession((error: Error | null, session: CognitoUserSession) => {
      if (error) {
        setIsLoading(false);
        setIsAdmin(false);
      } else {
        const tokenPayload = session.getAccessToken().payload;
        setIsLoading(false);
        if (Object.hasOwnProperty.call(tokenPayload, 'cognito:groups')) {
          setIsAdmin(tokenPayload['cognito:groups'].includes('Admin'));
        } else {
          setIsAdmin(false);
        }
      }
    });
  }, []);

  return { isLoading, isAdmin };
};
