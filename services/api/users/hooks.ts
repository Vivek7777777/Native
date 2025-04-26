import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from './service';
import { queryKeys } from '../queryKeys';


export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.user.current,
    queryFn: userService.getCurrentUser,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.current });
    },
  });
};