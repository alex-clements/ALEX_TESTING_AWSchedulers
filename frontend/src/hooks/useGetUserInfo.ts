import { useQuery } from '@tanstack/react-query';
import { UserService, usersRoute } from '../services/user-service';

export default function useGetUserInfo() {
  const userService = new UserService();

  const { isLoading, data, error } = useQuery({
    queryKey: [usersRoute],
    queryFn: () => userService.get_user(),
  });

  return { isLoading, data, error };
}
