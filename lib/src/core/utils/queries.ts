import { SuccessResponse } from '../types/api';

// TODO(shared-api): Use a generated error predicate here
type ResponseErrorLike = {
  name: 'ResponseError';
  response: Pick<Response, 'json' | 'status'>;
};

const isResponseError = (error: unknown): error is ResponseErrorLike => {
  if (!error || typeof error !== 'object') return false;

  const response = (error as { response?: unknown }).response;
  return (
    (error as { name?: unknown }).name === 'ResponseError' &&
    typeof response === 'object' &&
    response !== null &&
    typeof (response as { status?: unknown }).status === 'number' &&
    typeof (response as { json?: unknown }).json === 'function'
  );
};

export class ApiError extends Error {
  constructor(
    public readonly error: string,
    public readonly code: number,
    public readonly responseCode?: number,
    public readonly serverResponse?: unknown,
    public cause?: Error,
  ) {
    super(error);
  }
}

/**
 * Pluck data from API response
 *
 * @param response
 */
export const pluckData = <T>(response: SuccessResponse<T>) => {
  return response.data;
};

const parseApiError = async (error: Error): Promise<ApiError | null> => {
  if (!isResponseError(error)) {
    return null;
  }
  const data = await error.response.json();
  return new ApiError(
    data.message || data.error,
    data.code,
    error.response.status,
    data,
    error,
  );
};

export const rethrowApiError = async (error: Error): Promise<never> => {
  const pluckedError = await parseApiError(error);
  if (pluckedError) {
    throw pluckedError;
  }
  throw error;
};

/**
 * Ignore 404 ResponseErrors
 */
export const ignoreNotFound = (e: Error): null => {
  if (isResponseError(e) && e.response.status === 404) return null;
  throw e;
};
