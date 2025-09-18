import { ApiErrorCode } from './errorCodes';

export class ApiError extends Error {
  readonly code: ApiErrorCode | undefined;

  constructor(message: string, code?: ApiErrorCode) {
    super(message);
    this.code = code;
  }
}

export function isApiError(
  value: unknown,
  code: ApiErrorCode
): value is ApiError {
  return value instanceof ApiError && value.code === code;
}
