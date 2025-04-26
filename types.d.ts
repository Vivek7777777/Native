export type Pagination<T> = {
  docs: T[];
  totalDocs: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};
