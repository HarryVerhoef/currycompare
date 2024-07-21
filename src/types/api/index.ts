export enum HTTPMethod {
  GET = "get",
  POST = "post",
  DELETE = "delete",
}

export interface SuccessApiResponse<T> {
  success: true;
  data: T;
  status?: number;
}

export interface FailureApiResponse {
  success: false;
  reason?: string;
  status?: number;
}

export type ApiResponse<T> = SuccessApiResponse<T> | FailureApiResponse;
