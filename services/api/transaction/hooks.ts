import { useQuery, useMutation } from '@tanstack/react-query';
import { Transaction, transactionService } from './service';
import queryClient from '../queryClient';

export const useGetTransactions = (page: number, limit: number) => {
  return useQuery({
    queryFn: () => transactionService.getTransactions(page, limit), // Pass a function that returns a Promise
    queryKey: ['transaction', page, limit], // Include page and limit in the query key
  });
};

export const useUploadTransaction = () => {
  return useMutation({
    mutationFn: transactionService.uploadTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['transaction'],
      });
    },
  });
};

export const useUpdateTransaction = () => {
  return useMutation({
    mutationFn: ({
      id,
      transaction,
    }: {
      id: string;
      transaction: Partial<Transaction>;
    }) => transactionService.updateTransaction(id, transaction),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['transaction'],
      });
    },
  });
};
