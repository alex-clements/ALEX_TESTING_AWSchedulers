import { Outlet, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useGetAuthenticationStatus } from '../hooks/useGetAuthenticationStatus';
import { CircularProgress, Grid } from '@mui/material';
import { LoginHeader } from '../components/headers/LoginHeader';

interface ProtectedRouteProps {
  adminPermissionLevel: boolean;
}

export const ProtectedRoute = ({
  adminPermissionLevel,
}: ProtectedRouteProps) => {
  const { loading, authenticated, getAccess } = useGetAuthenticationStatus({
    adminPermissionLevel,
  });

  useEffect(() => {
    getAccess();

    // Check Authentication Status on 60 second interval
    const myInterval = setInterval(() => {
      getAccess();
    }, 60000);

    // Clear interval
    return () => {
      clearInterval(myInterval);
    };
  }, []);

  return loading ? (
    <>
      <LoginHeader />
      <Grid container justifyContent="center" marginTop={20}>
        <CircularProgress />
      </Grid>
    </>
  ) : authenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
};
