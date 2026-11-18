// shared setup and mocks
import '@polito/lib/testing/jest.setup';

import { server } from './src/testing/msw/server';

// -- manual mocks
// libraries that don't provide their own jest mock. These are minimal and
// may need expanding when a test reaches a not previously covered code path

jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');

jest.mock('react-native-edge-to-edge', () => ({
  SystemBars: () => null,
}));

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
