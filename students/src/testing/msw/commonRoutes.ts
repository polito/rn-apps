import { mockRoute } from '@polito/lib/testing/utils/mockRoute';

import { HttpHandler } from 'msw';

import { TEST_PROFILE, TEST_STUDENT, TEST_TEACHER } from '../constants';

export const commonRoutes = (): HttpHandler[] => [
  mockRoute('/v2/courses'),
  mockRoute('/exams', { body: { data: [] } }),
  mockRoute('/notifications', { body: { data: [] } }),
  mockRoute('/announcements', { body: { data: [] } }),
  mockRoute('/event-admissions', { body: { data: [] } }),
  mockRoute('/auth/mfa/status', { body: { data: { status: 'unavailable' } } }),
  mockRoute('/student/career', { body: { data: TEST_STUDENT } }),
  mockRoute('/messages', { body: { data: [] } }),
  mockRoute('/v2/sites', { body: { data: [] } }),
  mockRoute('/surveys', { body: { data: [] } }),
  mockRoute('/people/{personId}', { body: { data: TEST_TEACHER } }),
  mockRoute('/auth/profile', { body: { data: TEST_PROFILE } }),
  mockRoute('/auth/profile/picture', { status: 204 }),
  mockRoute('/auth/serviceLink/smartcard', {
    body: { data: { url: 'https://test-mock-smartcard.polito.it' } },
  }),
  mockRoute('/esc', {
    body: { data: { canBeRequested: false, details: null } },
  }),
];
