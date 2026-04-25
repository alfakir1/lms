// Backend API Response Format
export interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
  message?: string;
  meta?: {
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
  };
}

// Paginated response from backend
export interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
