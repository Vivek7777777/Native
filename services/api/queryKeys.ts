export const queryKeys = {
  // Auth-related queries
  auth: {
    all: ['auth'] as const,
    session: ['auth', 'session'] as const,
  },

  // User-related queries
  user: {
    all: ['user'] as const,
    current: ['user', 'current'] as const,
    details: () => [...queryKeys.user.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.user.details(), id] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.user.all, 'list', ...(filters ? [filters] : [])] as const,
  },

  // User-related queries
  transaction: {
    pagination: ['transactions'] as const,
    uploadTransaction: ['transaction', 'upload'] as const,
  },

  // Posts/Content-related queries
  posts: {
    all: ['posts'] as const,
    list: (params?: { category?: string; page?: number }) =>
      [...queryKeys.posts.all, 'list', ...(params ? [params] : [])] as const,
    detail: (id: string) => [...queryKeys.posts.all, 'detail', id] as const,
    comments: (postId: string) =>
      [...queryKeys.posts.detail(postId), 'comments'] as const,
  },

  // Add more domains as needed
} as const;