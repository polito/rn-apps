/* eslint-disable */
const {
  withAndroidManifest,
  withDangerousMod,
  AndroidConfig,
} = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withAndroidCustomConfig(config) {
  // --- ANDROID (Manifest) ---
  config = withAndroidManifest(config, async config => {
    const manifest = config.modResults.manifest;
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(
      config.modResults,
    );

    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      mainApplication,
      'com.google.firebase.messaging.default_notification_icon',
      '@drawable/ic_stat_graduation_cap',
      'resource',
    );
    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      mainApplication,
      'com.google.firebase.messaging.default_notification_color',
      '@color/notification',
      'resource',
    );

    const colorMetaData = mainApplication['meta-data'].find(
      m =>
        m.$['android:name'] ===
        'com.google.firebase.messaging.default_notification_color',
    );
    if (colorMetaData) {
      colorMetaData.$['tools:replace'] = 'android:resource';
      manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
    }

    if (!manifest['uses-feature']) manifest['uses-feature'] = [];
    manifest['uses-feature'].push({
      $: {
        'android:name': 'android.hardware.camera',
        'android:required': 'false',
      },
    });

    if (!manifest.queries) manifest.queries = [];
    manifest.queries.push({
      intent: [
        {
          action: [{ $: { 'android:name': 'android.intent.action.VIEW' } }],
          data: [{ $: { 'android:mimeType': '*/*' } }],
        },
      ],
    });

    return config;
  });

  // --- ANDROID (Risorse) ---
  config = withDangerousMod(config, [
    'android',
    async config => {
      const projectRoot = config.modRequest.projectRoot;
      const resDir = path.join(
        projectRoot,
        'android',
        'app',
        'src',
        'main',
        'res',
      );

      const drawableDir = path.join(resDir, 'drawable');
      if (!fs.existsSync(drawableDir))
        fs.mkdirSync(drawableDir, { recursive: true });
      fs.copyFileSync(
        path.join(projectRoot, 'assets', 'icons', 'notification-icon.png'),
        path.join(drawableDir, 'ic_stat_graduation_cap.png'),
      );

      const valuesDir = path.join(resDir, 'values');
      if (!fs.existsSync(valuesDir))
        fs.mkdirSync(valuesDir, { recursive: true });
      const colorsXml = `<?xml version="1.0" encoding="utf-8"?><resources><color name="notification">#002B49</color></resources>`;
      fs.writeFileSync(path.join(valuesDir, 'colors.xml'), colorsXml);

      return config;
    },
  ]);

  // --- IOS ---
  // Inietta use_modular_headers! nel Podfile per far compilare Firebase
  config = withDangerousMod(config, [
    'ios',
    async config => {
      const podfile = path.join(
        config.modRequest.platformProjectRoot,
        'Podfile',
      );
      if (fs.existsSync(podfile)) {
        let content = fs.readFileSync(podfile, 'utf8');
        if (!content.includes('use_modular_headers!')) {
          content = content.replace(
            /(platform :ios, .*)/,
            '$1\n  use_modular_headers!',
          );
          fs.writeFileSync(podfile, content);
        }
      }
      return config;
    },
  ]);

  return config;
};
