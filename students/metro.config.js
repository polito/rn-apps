//const path = require('node:path');          REMOVED  DUE TO EXPO AUTO MANAGEMENT FOR MONOREPO
const { getSentryExpoConfig } = require('@sentry/react-native/metro');
/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@expo/metro-config').MetroConfig}
 */

/*
const projectRoot =
  __dirname; removed compared to expo-template-bare-minimum template, expo should manage by itself the monorepo issue         
const monorepoRoot = path.join(projectRoot, '..');*/

const config = getSentryExpoConfig(__dirname);

//config.server.unstable_serverRoot = __dirname;
//config.resolver.unstable_conditionNames = ['react-native'];
/*
 EXPO MANAGES AUTOMATICALLY THE MONOREPO

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
};*/
//config.server.port = 8081;            REMOVED
// Disable Babel's RC lookup, reducing the config loading in Babel - resulting in faster bootup transformations
//config.transformer.enableBabelRCLookup = false;   removed

module.exports = config;
