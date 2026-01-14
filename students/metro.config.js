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
  path.join(monorepoRoot, 'common'), // to include common package,
];

config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    assets: path.join(__dirname, 'assets'),
  },
};

// Disable Babel's RC lookup, reducing the config loading in Babel - resulting in faster bootup transformations
config.transformer.enableBabelRCLookup = false;

module.exports = mergeConfig(getSentryExpoConfig(__dirname), config);
