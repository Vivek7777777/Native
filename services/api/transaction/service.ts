import { Pagination } from '@/types';
import { apiClient } from '..';
import { ReactNode } from 'react';

export type Transaction = {
  name: string;
  address: string;
  amount: number;
  date: string;
  count: number;
  description: string;
  amount2: number;
  action?: ReactNode;
};

export const transactionService = {
  getTransactions: async (
    page: number,
    limit: number,
  ): Promise<Pagination<Transaction>> => {
    const { data } = await apiClient.get('/transaction', {
      params: { page, limit },
    });
    return data;
  },

  uploadTransaction: async (transaction: any): Promise<Transaction> => {
    const formData = new FormData();
    formData.append('file', transaction.file);
    const { data } = await apiClient.post('/transaction/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
};
