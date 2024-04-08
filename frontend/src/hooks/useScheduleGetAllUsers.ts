import { useQuery } from '@tanstack/react-query';
import { UserSimplifiedT } from '../types/generaltypes';
import { UserService, usersRoute } from '../services/user-service';
import { getUsername } from '../utils/user';

export const useScheduleGetAllUsers = () => {
  const userService = new UserService();

  // prettier-ignore
  const { isLoading: isLoadingScheduleUsers, data, error: isErrorLoadingScheduleUsers,
  } = useQuery({
    queryKey: [usersRoute+'?many=true'],
    queryFn: () => userService.get_users(),
  });

  let scheduleUsers: UserSimplifiedT[] = [];

  if (
    !isLoadingScheduleUsers &&
    !isErrorLoadingScheduleUsers &&
    data != undefined
  ) {
    const username = getUsername();
    scheduleUsers = data.filter((user: any) => user.username !== username);
  }

  return {
    isLoadingScheduleUsers,
    scheduleUsers,
    isErrorLoadingScheduleUsers,
  };
};
