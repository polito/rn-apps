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
// some libraries require instead their mocks be
// imported in jest.config

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

jest.mock('expo-sqlite/kv-store', () => ({
  SQLiteStorage: jest.fn(() => ({
    getItem: jest.fn(async () => null),
    setItem: jest.fn(async () => {}),
    removeItem: jest.fn(async () => {}),
  })),
}));

jest.mock('expo-image', () => ({
  Image: require('react-native').Image,
}));

jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(async () => ({
    execAsync: jest.fn(async () => {}),
    runAsync: jest.fn(async () => ({ lastInsertRowId: 0, changes: 0 })),
    getAllAsync: jest.fn(async () => []),
    getFirstAsync: jest.fn(async () => null),
    closeAsync: jest.fn(async () => {}),
  })),
}));

jest.mock('expo-sharing', () => ({
  shareAsync: jest.fn(async () => {}),
  isAvailableAsync: jest.fn(async () => false),
}));

jest.mock('expo-asset', () => ({
  Asset: {
    fromModule: jest.fn(() => ({
      downloadAsync: jest.fn(async () => {}),
      uri: '',
    })),
    loadAsync: jest.fn(async () => {}),
  },
}));

jest.mock('expo-constants', () => ({
  expoConfig: null,
  executionEnvironment: 'bare',
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

jest.mock('expo-file-system', () => ({
  Paths: { cache: '/tmp/caches', document: '/tmp/documents' },
  File: class {
    uri: string;
    exists = false;
    constructor(...segments: string[]) {
      this.uri = segments.join('/');
    }
    create = jest.fn(() => {
      this.exists = true;
    });
    write = jest.fn(() => {});
    delete = jest.fn(() => {
      this.exists = false;
    });
  },
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
}));

jest.mock('react-native-bootsplash', () => ({
  hide: jest.fn(async () => {}),
  show: jest.fn(async () => {}),
  isVisible: jest.fn(async () => false),
  useHideAnimation: jest.fn(() => ({ container: {}, logo: {} })),
}));

jest.mock('react-native-file-viewer', () => ({
  open: jest.fn(async () => {}),
}));

jest.mock('react-native-html-to-pdf', () => ({
  convert: jest.fn(async () => ({ filePath: '/tmp/out.pdf' })),
}));

jest.mock('react-native-image-crop-picker', () => ({
  openPicker: jest.fn(async () => ({ path: '', mime: '', data: '' })),
  openCamera: jest.fn(async () => ({ path: '', mime: '', data: '' })),
  clean: jest.fn(async () => {}),
}));

jest.mock('@react-native-clipboard/clipboard', () => ({
  getString: jest.fn(async () => ''),
  setString: jest.fn(() => {}),
  hasString: jest.fn(async () => false),
}));

jest.mock('@react-native-community/geolocation', () => ({
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(() => 0),
  clearWatch: jest.fn(),
  requestAuthorization: jest.fn(),
  setRNConfiguration: jest.fn(),
}));

jest.mock('react-native-blob-util', () => ({
  config: jest.fn(() => ({
    fetch: jest.fn(async () => ({ path: () => '' })),
  })),
  fs: {
    dirs: { DocumentDir: '/tmp/documents', CacheDir: '/tmp/caches' },
    exists: jest.fn(async () => false),
    unlink: jest.fn(async () => {}),
  },
}));

jest.mock('react-native-saf-x', () => ({
  openDocumentTree: jest.fn(async () => null),
  hasPermission: jest.fn(async () => false),
}));

jest.mock('react-native-override-color-scheme', () => ({
  setScheme: jest.fn(),
  getScheme: jest.fn(() => null),
}));

jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(async () => true),
  getGenericPassword: jest.fn(async () => false),
  resetGenericPassword: jest.fn(async () => true),
  ACCESSIBLE: {},
  ACCESS_CONTROL: {},
}));

jest.mock('react-native-check-version', () => ({
  checkVersion: jest.fn(async () => ({ needsUpdate: false })),
}));

// https://github.com/invertase/react-native-firebase/issues/1902
jest.mock('@react-native-firebase/app', () => ({
  delete: jest.fn(),
}));

// https://github.com/invertase/react-native-firebase/issues/1902
jest.mock('@react-native-firebase/messaging', () => ({
  getMessaging: jest.fn(() => ({})),
  getToken: jest.fn(async () => 'fake-fcm-token'),
  onMessage: jest.fn(() => jest.fn()),
  onTokenRefresh: jest.fn(() => jest.fn()),
  onNotificationOpenedApp: jest.fn(() => jest.fn()),
  getInitialNotification: jest.fn(async () => null),
  requestPermission: jest.fn(async () => 1),
  setBackgroundMessageHandler: jest.fn(),
  AuthorizationStatus: {
    NOT_DETERMINED: -1,
    DENIED: 0,
    AUTHORIZED: 1,
    PROVISIONAL: 2,
  },
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

jest.mock('react-native-date-picker', () => () => null);

// lib Grid layout mock
jest.mock('../lib/src/ui/components/Grid', () => ({
  ...jest.requireActual('../lib/src/ui/components/Grid'),
  Grid: ({ children }: { children: React.ReactNode }) => children,
}));

// mocking out from App.tsx, this allows us to run App.tsx without sentry interfering
jest.mock('@polito/lib/core', () => ({
  ...jest.requireActual('@polito/lib/core'),
  initSentry: jest.fn(),
  Sentry: {
    ...jest.requireActual('@polito/lib/core').Sentry,
    withTouchEventBoundary: (c: any) => c,
  },
  setTimeoutAccessibilityInfoHelper: jest.fn(),
}));

// Auth mock
// allows us to set easily set user
jest.mock('~/utils/keychain', () => require('./__mocks__/keychain'));

beforeEach(() => {
  require('./__mocks__/keychain').__resetKeychain();
  // clear storage between tests
  require('@react-native-async-storage/async-storage').clear();
});
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
