// shared setup and mocks
import '@polito/lib/testing/jest.setup';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { version } from './package.json';
import { server } from './src/testing/msw/server';

// -- manual mocks
// libraries that don't provide their own jest mock. These are minimal and
// may need expanding when a test reaches a not previously covered code path

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

jest.mock('react-native-date-picker', () => () => null);

// boot as an updated install
beforeEach(() => AsyncStorage.setItem('lastInstalledVersion', version));

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
