type ResponseStatus = 'success' | 'error' | 'info';

interface ApiResponse<T = unknown, E = unknown> {
  success: boolean;
  status: ResponseStatus;
  message: string;
  data?: T | null;
  errors?: E | null;
}

export class ApiResponseUtil {
  
  static success<T>(
    message: string,
    data?: T
  ): ApiResponse<T> {
    return {
      success: true,
      status: 'success',
      message,
      data: data || null,
      errors: null
    };
  }

  static error<E = unknown>(
    message: string,
    errors?: E
  ): ApiResponse {
    return {
      success: false,
      status: 'error',
      message,
      data: null,
      errors: errors || null
    };
  }

  static info<T>(
    message: string,
    data?: T
  ): ApiResponse<T> {
    return {
      success: true,
      status: 'info',
      message,
      data: data || null,
      errors: null
    };
  }
}