const path = require('node:path');
const { mergeConfig, getDefaultConfig } = require('@react-native/metro-config');
const { getSentryExpoConfig } = require('@sentry/react-native/metro');
/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = getDefaultConfig(__dirname);
const monorepoRoot = path.join(__dirname, '..');

config.watchFolders = [
  __dirname,
  path.join(monorepoRoot, 'node_modules'), // to resolve hoisted dependencies of the monorepo
  path.join(monorepoRoot, 'lib'), // to include lib package,
  path.join(__dirname, 'assets'), // to include shared assets
];

config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    '@polito/lib': path.join(monorepoRoot, 'lib'),
    assets: path.join(__dirname, 'assets'),
  },
};

config.server = {
  ...config.server,
  port: 8081,
};

// Disable Babel's RC lookup, reducing the config loading in Babel - resulting in faster bootup transformations
config.transformer.enableBabelRCLookup = false;

module.exports = mergeConfig(getSentryExpoConfig(__dirname), config);
