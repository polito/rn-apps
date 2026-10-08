import { mockRoute } from '@polito/lib/testing/utils/mockRoute';

import { HttpHandler } from 'msw';

export const commonRoutes = (): HttpHandler[] => [
  mockRoute('/v2/sites', { body: { data: [] } }),
  mockRoute('/v2/courses', { body: { data: [] } }),
];
