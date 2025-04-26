import { apiClient } from "..";

type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export const userService = {
  getCurrentUser: async (): Promise<User> => {
    const { data } = await apiClient.get('/users/me');
    console.log('getCurrentUser', data);

    return data;
  },
  getUserById: async (id: string): Promise<User> => {
    const { data } = await apiClient.get(`/users/${id}`);
    return data;
  },
  updateUser: async (user: Partial<User>): Promise<User> => {
    const { data } = await apiClient.patch('/users/me', user);
    return data;
  },
};