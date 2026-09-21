import { HttpHandler } from 'msw';

import { TEST_STUDENT, TEST_TEACHER } from '../constants';
import { mockRoute } from '../utils/mockRoute';

export const commonRoutes = (): HttpHandler[] => [
  mockRoute('/notifications', { body: { data: [] } }),
  mockRoute('/announcements', { body: { data: [] } }),
  mockRoute('/event-admissions', { body: { data: [] } }),
  mockRoute('/auth/mfa/status', { body: { data: { status: 'unavailable' } } }),
  mockRoute('/student/career', { body: { data: TEST_STUDENT } }),
  mockRoute('/messages', { body: { data: [] } }),
  mockRoute('/v2/sites', { body: { data: [] } }),
  mockRoute('/surveys', { body: { data: [] } }),
  mockRoute('/people/{personId}', { body: { data: TEST_TEACHER } }),
];
