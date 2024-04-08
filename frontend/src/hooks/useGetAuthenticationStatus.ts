import { AccessService } from '../services/access-service';
import { useState } from 'react';

interface useGetAuthenticationStatusProps {
  adminPermissionLevel: boolean;
}

export const useGetAuthenticationStatus = ({
  adminPermissionLevel,
}: useGetAuthenticationStatusProps) => {
  const [authenticated, setAuthenticated] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  const getAccess = () => {
    const accessService = new AccessService();
    accessService
      .get_access()
      .then((data) => {
        if ((adminPermissionLevel && data.isAdmin) || !adminPermissionLevel) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
        setLoading(false);
      })
      .catch((err) => {
        setAuthenticated(false);
        setLoading(false);
        console.log(err);
      });
  };

  return { authenticated, loading, getAccess };
};
