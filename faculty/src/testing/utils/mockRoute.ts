import { HttpHandler, HttpResponse, http } from 'msw';

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
 * Creates an MSW handler for an API route.
 *
 * The faculty API client ships no OpenAPI spec, so there are no examples to
 * fall back to. Pass `body` whenever the response needs content.
 *
 * @example
 * mockRoute('/v2/sites', { body: { data: [] } }); // empty list
 * mockRoute<Site[]>('/v2/sites', { body: { data: MY_SITES } });
 * mockRoute('/v2/sites', { status: 500 }); // error, no body
 *
 * @param specPath API path, e.g. '/courses/{courseId}'. `{courseId}`
 *   matches any id unless you set `options.params.courseId`.
 * @param options.body Full response body, e.g. `{ data: ... }`. `T` types
 *   `data`, other fields are not checked. Without `body` the response has
 *   no body.
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

  const responseBody = options?.body;

  return http[method](url, () =>
    responseBody !== undefined
      ? HttpResponse.json(responseBody, { status, headers: options?.headers })
      : new HttpResponse(null, { status, headers: options?.headers }),
  );
}
