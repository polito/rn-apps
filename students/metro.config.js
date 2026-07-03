const path = require('node:path');
const { getSentryExpoConfig } = require('@sentry/react-native/metro');
/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@expo/metro-config').MetroConfig}
 */
const projectRoot = __dirname;
const monorepoRoot = path.join(projectRoot, '..');

const config = getSentryExpoConfig(projectRoot);

config.resolver.sourceExts.push('mjs');

config.server.unstable_serverRoot = projectRoot;
config.resolver.unstable_conditionNames = ['react-native'];

config.watchFolders = [
  projectRoot,
  path.join(monorepoRoot, 'node_modules'), // to resolve hoisted dependencies of the monorepo
  path.join(monorepoRoot, 'lib'), // to include lib package,
  path.join(projectRoot, 'assets'), // to include shared assets
];

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  '@polito/lib': path.join(monorepoRoot, 'lib'),
  assets: path.join(projectRoot, 'assets'),
};
config.server.port = 8081;
// Disable Babel's RC lookup, reducing the config loading in Babel - resulting in faster bootup transformations
config.transformer.enableBabelRCLookup = false;

module.exports = config;
