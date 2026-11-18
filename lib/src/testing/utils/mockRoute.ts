import { ErrorResponse } from '@polito/student-api-client';

import { HttpHandler, HttpResponse, http } from 'msw';

import { specExample } from './getSpec';

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

interface MockRouteOptions<T = unknown> {
  body?: ({ data: T } & Record<string, unknown>) | ErrorResponse;
  headers?: Record<string, string>;
  status?: number;
  method?: HttpMethod;
  params?: Record<string, string | number>;
}

const BASE = 'https://app.didattica.polito.it/api';

/**
 * Creates an MSW handler for an API route. `path` is written like in the
 * OpenAPI spec, e.g. '/courses/{courseId}'.
 *
 * Response body when `body` is not passed:
 * - 400 and up: `{ code, message }`, like the real API
 * - 204: no body
 * - anything else: the spec's 200 example (throws if the spec has none)
 *
 * @example
 * mockRoute('/v2/courses'); // spec example
 * mockRoute<Course>('/courses/{courseId}', { body: { data: MY_COURSE } });
 * mockRoute('/courses/{courseId}', { params: { courseId: 1 } }); // one id only
 * mockRoute('/student/tickets', { status: 500 }); // error
 * mockRoute('/student/tickets', { status: 500, body: { message: 'Oops' } });
 */
export function mockRoute<T = unknown>(
  path: string,
  options: MockRouteOptions<T> = {},
): HttpHandler {
  const method = options.method ?? 'get';
  const status = options.status ?? 200;

  // '/courses/{courseId}' becomes '/courses/1' if params has courseId,
  // otherwise '/courses/:courseId', which matches any id
  let url = BASE + path;
  for (const [key, value] of Object.entries(options.params ?? {})) {
    url = url.replace(`{${key}}`, String(value));
  }
  url = url.replace(/\{(\w+)\}/g, ':$1');

  let body = options.body;
  if (body === undefined && status >= 400) {
    body = { code: status, message: `Mocked ${status} error` };
  } else if (body === undefined && status !== 204) {
    body = specExample(path, method);
  }

  return http[method](url, () => {
    if (body === undefined) {
      return new HttpResponse(null, { status, headers: options.headers });
    }
    return HttpResponse.json(body, { status, headers: options.headers });
  });
}
