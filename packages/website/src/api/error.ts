import { ApiErrorCode } from './errorCodes';

export class ApiError extends Error {
  readonly code: ApiErrorCode | undefined;

  constructor(message: string, code?: ApiErrorCode) {
    super(message);
    this.code = code;
  }
}
