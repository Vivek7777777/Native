import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import { transactionService } from './service';
import { queryKeys } from '../queryKeys';

const queryClient = new QueryClient();

export const useGetTransactions = (page: number, limit: number) => {
  return useQuery({
    queryKey: [queryKeys.transaction.pagination, page, limit], // Include page and limit in the query key
    queryFn: () => transactionService.getTransactions(page, limit), // Pass a function that returns a Promise
  });
};

export const useUploadTransaction = () => {
  return useMutation({
    mutationFn: transactionService.uploadTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.transaction.uploadTransaction,
      });
    },
  });
};
