module.exports = {
  project: {
    ios: {
      // Disable automatic Pod installation during the build process.
      // Ref: https://github.com/react-native-community/cli/blob/main/packages/cli-config-apple/src/tools/installPods.ts#L156
      automaticPodsInstallation: false,
    },
  },
};
