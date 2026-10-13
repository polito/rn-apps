module.exports = () => {
  const isDev = process.env.NODE_ENV !== 'production';

  const iconPath = isDev
    ? './assets/icons/ic_launcher_dev.png'
    : './assets/icons/ic_launcher.png';

  const androidForegroundIcon = isDev
    ? './assets/icons/ic_launcher_foreground_dev.png'
    : './assets/icons/ic_launcher_foreground.png';

  const appName = isDev ? 'PoliTO Students [DEV]' : 'PoliTO Students';

  return {
    expo: {
      name: appName,
      slug: 'students',
      scheme: 'polito',
      icon: iconPath,
      primaryColor: '#002B49',
      backgroundColor: '#002B49',
      userInterfaceStyle: 'light',
      android: {
        package: isDev ? 'it.polito.students.dev' : 'it.polito.students',
        allowBackup: false,
        softwareKeyboardLayoutMode: 'resize',
        adaptiveIcon: {
          foregroundImage: androidForegroundIcon,
          backgroundColor: '#002B49',
        },
        googleServicesFile: './google-services.json',
        permissions: [
          'android.permission.CAMERA',
          'android.permission.ACCESS_COARSE_LOCATION',
          'android.permission.ACCESS_FINE_LOCATION',
          'android.permission.READ_EXTERNAL_STORAGE',
          'android.permission.WRITE_EXTERNAL_STORAGE',
        ],
        intentFilters: [
          {
            action: 'VIEW',
            autoVerify: false,
            data: [
              {
                scheme: 'polito',
                host: 'students',
              },
            ],
            category: ['DEFAULT', 'BROWSABLE'],
          },
        ],
      },
      ios: {
        bundleIdentifier: isDev
          ? 'it.polito.students-dev'
          : 'it.polito.students',
        buildNumber: '1',
        icon: iconPath,
        googleServicesFile: './GoogleService-Info.plist',
        infoPlist: {
          CFBundleDisplayName: appName,
          CFBundleName: appName,
          NSCameraUsageDescription: 'Scan documents',
          NSFaceIDUsageDescription:
            'Save PoliTO Authenticator MFA private key in Secure Enclave',
          NSLocationWhenInUseUsageDescription:
            'Access to current position to check-in bookings',
          NSLocationAlwaysAndWhenInUseUsageDescription:
            'Access to current position to check-in bookings',
          NSPhotoLibraryUsageDescription:
            'Scan documents and pick images for assignments and ticket attachments',

          UIFileSharingEnabled: true,
          UISupportsDocumentBrowser: true,
          LSSupportsOpeningDocumentsInPlace: true,
          UIBackgroundModes: ['fetch', 'remote-notification', 'audio'],
          UIViewControllerBasedStatusBarAppearance: false,
        },
      },
      notification: {
        icon: './assets/icons/notification-icon.png',
        color: '#002B49',
      },
      plugins: [
        [
          'expo-splash-screen',
          {
            image: './assets/splash/logo_blue.png',
            backgroundColor: '#F0F3F5',
            dark: {
              image: './assets/splash/logo_white.png',
              backgroundColor: '#002B49',
            },
            android: {
              imageWidth: 150,
            },
            ios: {
              imageWidth: 200,
            }
          },
        ],
        [
          '@sentry/react-native/expo',
          {
            url: 'https://sentry.k8s.polito.it/',
            project: 'students-app',
            organization: 'polito',
          },
        ],
        'react-native-edge-to-edge',
        '@react-native-firebase/app',
        [
          '@rnmapbox/maps',
          {
            RNMapboxMapsImpl: 'mapbox',
            RNMapboxMapsDownloadToken: process.env.MAPBOX_TOKEN,
          },
        ],
        './withFirebaseNotificationConfig.js',
      ],
    },
  };
};
