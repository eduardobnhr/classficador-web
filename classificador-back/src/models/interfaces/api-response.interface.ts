export interface ApiResponse<T> {
  statusCode: number;
  message: string | object;
  timestamp: string;
  path: string;
  data?: T;
  error?: string | object;
}
