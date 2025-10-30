/**
 * Error handling utilities
 */

/**
 * Custom error classes
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class NetworkError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 'NETWORK_ERROR', 0, details);
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string) {
    super(message, 'AUTH_ERROR', 401);
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class TimeoutError extends AppError {
  constructor(operation: string) {
    super(`Operation timed out: ${operation}`, 'TIMEOUT_ERROR', 408);
    this.name = 'TimeoutError';
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}

/**
 * Error handler for API calls
 */
export async function handleAPIError(error: unknown): Promise<never> {
  if (error instanceof AppError) {
    throw error;
  }

  if (error instanceof Response) {
    const statusCode = error.status;
    let message = 'An error occurred';

    try {
      const data = await error.json();
      message = data.message || data.error || message;
    } catch {
      message = error.statusText || message;
    }

    throw new AppError(message, 'API_ERROR', statusCode);
  }

  if (error instanceof TypeError && error.message.includes('fetch')) {
    throw new NetworkError('Network request failed. Please check your connection.');
  }

  if (error instanceof Error) {
    throw new AppError(error.message, 'UNKNOWN_ERROR');
  }

  throw new AppError('An unknown error occurred', 'UNKNOWN_ERROR');
}

/**
 * Retry mechanism for failed operations
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  options: {
    maxRetries?: number;
    delay?: number;
    backoff?: number;
    onRetry?: (attempt: number, error: Error) => void;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    delay = 1000,
    backoff = 2,
    onRetry,
  } = options;

  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxRetries - 1) {
        if (onRetry) {
          onRetry(attempt + 1, lastError);
        }

        const waitTime = delay * Math.pow(backoff, attempt);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError!;
}

/**
 * Error logger
 */
export class ErrorLogger {
  private static instance: ErrorLogger;
  private logs: Array<{
    timestamp: Date;
    error: Error;
    context?: any;
  }> = [];

  private constructor() {}

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  log(error: Error, context?: any): void {
    const log = {
      timestamp: new Date(),
      error,
      context,
    };

    this.logs.push(log);

    // Keep only last 100 logs
    if (this.logs.length > 100) {
      this.logs.shift();
    }

    // Console log in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorLogger]', log);
    }

    // Send to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalService(log);
    }
  }

  private sendToExternalService(log: any): void {
    // Example: Send to Sentry, LogRocket, etc.
    // Sentry.captureException(log.error, { extra: log.context });
  }

  getLogs(): typeof this.logs {
    return [...this.logs];
  }

  clear(): void {
    this.logs = [];
  }
}

/**
 * Global error logger instance
 */
export const errorLogger = ErrorLogger.getInstance();

/**
 * User-friendly error messages
 */
export function getUserFriendlyMessage(error: Error): string {
  if (error instanceof NetworkError) {
    return 'Unable to connect. Please check your internet connection and try again.';
  }

  if (error instanceof ValidationError) {
    return error.message || 'Please check your input and try again.';
  }

  if (error instanceof AuthenticationError) {
    return 'Authentication failed. Please log in again.';
  }

  if (error instanceof NotFoundError) {
    return error.message || 'The requested resource was not found.';
  }

  if (error instanceof TimeoutError) {
    return 'The operation took too long. Please try again.';
  }

  if (error instanceof AppError) {
    return error.message || 'An error occurred. Please try again.';
  }

  return 'An unexpected error occurred. Please try again.';
}

/**
 * Error notification (can be integrated with toast library)
 */
export function notifyError(error: Error, context?: any): void {
  errorLogger.log(error, context);

  const message = getUserFriendlyMessage(error);

  // Example: Show toast notification
  // toast.error(message);

  // For now, use console
  console.error('[Error]', message, error);
}

/**
 * Safe error handler for async operations
 */
export function handleAsyncError<T extends (...args: any[]) => Promise<any>>(
  fn: T
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      notifyError(error as Error, { function: fn.name, args });
      throw error;
    }
  }) as T;
}

/**
 * Error recovery strategies
 */
export const ErrorRecovery = {
  /**
   * Attempt to recover from error
   */
  async recover<T>(
    error: Error,
    recoveryStrategies: Array<() => Promise<T>>
  ): Promise<T> {
    for (const strategy of recoveryStrategies) {
      try {
        return await strategy();
      } catch (recoveryError) {
        console.warn('Recovery strategy failed:', recoveryError);
      }
    }

    throw error;
  },

  /**
   * Graceful degradation
   */
  gracefulDegradation<T>(
    operation: () => T,
    fallback: T,
    onError?: (error: Error) => void
  ): T {
    try {
      return operation();
    } catch (error) {
      if (onError) {
        onError(error as Error);
      }
      return fallback;
    }
  },
};
