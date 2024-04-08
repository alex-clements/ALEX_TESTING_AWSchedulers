import { useQuery } from '@tanstack/react-query';
import { UserT } from '../types/generaltypes';
import { UserService, adminUsersRoute } from '../services/user-service';
import { useMemo } from 'react';

const userService = new UserService();
export const useUserGetAll = () => {
  // prettier-ignore
  const { isLoading: isLoadingUsers, data, error: isErrorLoadingUsers,
  } = useQuery({
    queryKey: [adminUsersRoute],
    queryFn: () => userService.get_users_admin(),
  });

  const users: UserT[] = useMemo(() => {
    const usersProcessed = data || [];

    // prettier-ignore
    return usersProcessed.map((user: any) => {
      const {id,username, name, buildingId, email, floorNumber, isAdmin, isActive} = user;
      const Building = buildingId
      return {id,username, name, email, Building, floorNumber, isAdmin, isActive};
    });
  }, [data]);

  return {
    isLoadingUsers,
    users,
    isErrorLoadingUsers,
  };
};
