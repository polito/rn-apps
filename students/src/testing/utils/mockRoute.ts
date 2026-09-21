import { HttpHandler, HttpResponse, http } from 'msw';

import { specExample } from './getSpec';

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

interface MockRouteOptions<T = unknown> {
  body?: { data: T } & Record<string, unknown>;
  headers?: Record<string, string>;
  status?: number;
  method?: HttpMethod;
  params?: Record<string, string | number>;
}

const BASE = 'https://app.didattica.polito.it/api';

/**
 * Creates an MSW handler for an API route, using the path as written in the
 * OpenAPI spec.
 *
 * @example
 * mockRoute('/v2/courses'); // responds with the spec example
 * mockRoute<Course>('/courses/{courseId}', { body: { data: MY_COURSE } });
 * mockRoute('/exams', { body: { data: [] } }); // empty list
 * mockRoute('/student/tickets', { status: 500 }); // error, no body
 *
 * @param specPath Path as written in the spec, e.g. '/courses/{courseId}'.
 *   `{courseId}` matches any id unless you set `options.params.courseId`.
 * @param options.body Full response body, e.g. `{ data: ..., states: ... }`.
 *   `T` types `data`, other fields are not checked. Without `body` the
 *   response is the spec's 200 example (it throws if the spec has none).
 *   Error statuses (400 and up) and 204 respond with no body instead.
 * @param options.status Response status. Defaults to 200.
 * @param options.method HTTP method. Defaults to 'get'.
 * @param options.params Values for the `{params}` in the path, to match one
 *   specific value instead of any.
 * @param options.headers Extra response headers.
 */
export function mockRoute<T = unknown>(
  specPath: string,
  options?: MockRouteOptions<T>,
): HttpHandler {
  const method = options?.method ?? 'get';
  const status = options?.status ?? 200;

  const url =
    BASE +
    specPath.replace(/\{(\w+)\}/g, (_, key) =>
      options?.params?.[key] != null ? String(options.params[key]) : `:${key}`,
    );

  const responseBody =
    options?.body !== undefined
      ? options.body
      : status >= 400 || status === 204
        ? undefined
        : specExample(specPath, method);

  return http[method](url, () =>
    responseBody !== undefined
      ? HttpResponse.json(responseBody, { status, headers: options?.headers })
      : new HttpResponse(null, { status, headers: options?.headers }),
  );
}
