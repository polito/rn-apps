import 'react-native-gesture-handler/jestSetup';

import { notifyManager, timeoutManager } from '@tanstack/react-query';
import { configure } from '@testing-library/react-native';

import { server } from './src/testing/msw/server';

configure({ asyncUtilTimeout: 5000 });

// --- react-query timers
// necessary to suppress on queryclient gc timers
const unref = <T>(id: T): T => {
  (id as { unref?: () => void })?.unref?.();
  return id;
};
timeoutManager.setTimeoutProvider({
  setTimeout: (cb, delay) => unref(setTimeout(cb, delay)),
  clearTimeout: id => clearTimeout(id),
  setInterval: (cb, delay) => unref(setInterval(cb, delay)),
  clearInterval: id => clearInterval(id),
});

// react-query delivers cache updates to components from a setTimeout(0).
// Using microtask we keep the update in the same tick as the change that caused it
// and we avoid problems related to act.
notifyManager.setScheduler(queueMicrotask);

// --- imported mocks
// some libraries ship jest mocks; wire them up here.

jest.mock('@react-native-community/netinfo', () =>
  require('@react-native-community/netinfo/jest/netinfo-mock.js'),
);

jest.mock('react-native-localize', () => require('react-native-localize/mock'));

jest.mock('react-native-permissions', () =>
  require('react-native-permissions/mock'),
);

jest.mock('react-native-device-info', () =>
  require('react-native-device-info/jest/react-native-device-info-mock'),
);

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default,
);

// -- manual mocks
// libraries that don't provide their own jest mock. These are minimal and
// may need expanding when a test reaches a not previously covered code path

jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');

jest.mock('react-native-edge-to-edge', () => ({
  SystemBars: () => null,
}));

jest.mock('expo-web-browser', () => ({
  openBrowserAsync: jest.fn(async () => ({ type: 'opened' })),
  openAuthSessionAsync: jest.fn(async () => ({ type: 'cancel' })),
  dismissBrowser: jest.fn(async () => {}),
  dismissAuthSession: jest.fn(() => {}),
  warmUpAsync: jest.fn(async () => {}),
  coolDownAsync: jest.fn(async () => {}),
  WebBrowserPresentationStyle: {},
}));

jest.mock('expo-image', () => ({
  Image: require('react-native').Image,
}));

jest.mock('react-native-fs', () => ({
  DocumentDirectoryPath: '/tmp/documents',
  ExternalDirectoryPath: '/tmp/external',
  CachesDirectoryPath: '/tmp/caches',
  exists: jest.fn(async () => false),
  mkdir: jest.fn(async () => {}),
  unlink: jest.fn(async () => {}),
  readFile: jest.fn(async () => ''),
  writeFile: jest.fn(async () => {}),
  downloadFile: jest.fn(() => ({
    promise: Promise.resolve({ statusCode: 200 }),
  })),
}));

jest.mock('expo-constants', () => ({
  expoConfig: null,
  executionEnvironment: 'bare',
}));

jest.mock('@sentry/react-native', () => ({
  setUser: jest.fn(),
  setTag: jest.fn(),
  reactNavigationIntegration: jest.fn(() => ({
    registerNavigationContainer: jest.fn(),
  })),
  reactNativeTracingIntegration: jest.fn(() => ({})),
  init: jest.fn(),
  wrap: (c: any) => c,
  ReactNavigationInstrumentation: jest.fn(),
  TouchEventBoundary: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('react-native-bootsplash', () => ({
  hide: jest.fn(async () => {}),
  show: jest.fn(async () => {}),
  isVisible: jest.fn(async () => false),
  useHideAnimation: jest.fn(() => ({ container: {}, logo: {} })),
}));

jest.mock('react-native-override-color-scheme', () => ({
  setScheme: jest.fn(),
  getScheme: jest.fn(() => null),
}));

// lib Grid layout mock
jest.mock('../lib/src/ui/components/Grid', () => ({
  ...jest.requireActual('../lib/src/ui/components/Grid'),
  Grid: ({ children }: { children: React.ReactNode }) => children,
}));

// mocking out from App.tsx, this allows us to run App.tsx without sentry
// interfering
jest.mock('@polito/lib/core', () => ({
  ...jest.requireActual('@polito/lib/core'),
  initSentry: jest.fn(),
  Sentry: {
    ...jest.requireActual('@polito/lib/core').Sentry,
    withTouchEventBoundary: (c: any) => c,
  },
  setTimeoutAccessibilityInfoHelper: jest.fn(),
}));

beforeEach(() => {
  // clear storage between tests
  require('@react-native-async-storage/async-storage').clear();
});
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
