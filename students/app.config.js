module.exports = () => {
  const isDev = process.env.NODE_ENV !== 'production';

  const iconPath = isDev
    ? './assets/icons/ic_launcher_dev.png'
    : './assets/icons/ic_launcher.png';

  const appName = isDev ? 'PoliTO Students [DEV]' : 'PoliTO Students';

  return {
    name: appName,
    displayName: appName,
    expo: {
      name: appName,
      slug: 'students',
      scheme: 'students',
      icon: iconPath,
      primaryColor: '#002B49',
      backgroundColor: '#002B49',
      userInterfaceStyle: 'light',
      splash: {
        image: './assets/bootsplash/logo.png',
        resizeMode: 'contain',
        backgroundColor: '#004931',
      },
      android: {
        package: isDev ? 'it.polito.students.dev' : 'it.polito.students',
        allowBackup: false,
        softwareKeyboardLayoutMode: 'resize',
        adaptiveIcon: {
          foregroundImage: iconPath,
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
      notification: {
        icon: './assets/icons/notification-icon.png',
        color: '#002B49',
      },
      plugins: [
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
            RNMapboxMapsDownloadToken: process.env.MAPBOX,
          },
        ],
        './withFirebaseNotificationConfig.js',
      ],
    },
  };
};

/*
ORIGINAL CONTENT OF app.json (for reference):

{
  "name": "students",
  "displayName": "Polito Students",
  "expo": {
    "name": "Polito Students",
    "slug": "students",
    "android": {
      "package": "it.polito.students",
      "permissions": [
        "android.permission.CAMERA",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE"
      ],
      "googleServicesFile": "./google-services.json"
    }
  },
  "notification": {
    "icon": "./assets/notification-icon.png",
    "color": "#FF0000"
  },
  "plugins": [
    [
      "@sentry/react-native/expo",
      {
        "url": "https://sentry.k8s.polito.it/",
        "project": "students-app",
        "organization": "polito"
      }
    ],
    "react-native-edge-to-edge",
    "@react-native-firebase/app",
    "./withFirebaseNotificationConfig.js"
  ]
}*/
