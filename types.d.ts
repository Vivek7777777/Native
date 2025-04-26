type Pagination<T> = {
  docs: T[];
  totalDocs: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

interface Column<T> {
  key: keyof T;
  label: string;
  width: number;
  renderCell?: (data: T) => React.ReactNode;
}
