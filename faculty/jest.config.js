const path = require('path');

const rnmapboxJestSetup = path.join(
  path.dirname(require.resolve('@rnmapbox/maps/package.json')),
  'setup-jest.js',
);

module.exports = {
  preset: 'react-native',
  cacheDirectory: '<rootDir>/.jest-cache',
  testEnvironmentOptions: {
    customExportConditions: ['require', 'react-native', 'node'],
  },
  resolver: require.resolve('react-native-worklets/jest/resolver'),
  setupFilesAfterEnv: [rnmapboxJestSetup, './jest.setup.ts'],
  clearMocks: true,
  testTimeout: 20000,
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': 'babel-jest',
    '^.+\\.(bmp|gif|jpg|jpeg|mp4|png|psd|svg|webp)$':
      require.resolve('react-native/jest/assetFileTransformer.js'),
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native(-community)?|@react-navigation|expo(-.*)?|@expo(-.*)?/.*|@polito|@sentry/react-native|react-native-.*|@rnmapbox|@gorhom|@tanstack|@open-draft|rettime|until-async|superjson|copy-anything|is-what|@fortawesome|@react-native-menu|color|color-string|color-convert|color-name|date-fns)/)',
  ],
};
