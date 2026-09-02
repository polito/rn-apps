import { initReactI18next } from 'react-i18next';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { APP_VERSION, BUILD_NO } from '@env';
import { AuthApi } from '@polito/auth-api-client';
import {
  ApiProvider,
  AuthIdentityValidator,
  PolitoAppConfig,
  PreferencesProvider,
  Sentry,
  createPolitoLinking,
  extendSuperJSON,
  initSentry,
  isEnvProduction,
} from '@polito/lib/core';
import {
  UnsupportedIdentityTypeError,
  mfaScreenTranslations,
} from '@polito/lib/features/auth';
import { FeedbackProvider, SplashProvider, UiProvider } from '@polito/lib/ui';
import Mapbox from '@rnmapbox/maps';

import i18n from 'i18next';

import { en, it } from '../assets/translations';
import { updateGlobalApiConfiguration } from './config/api';
import { AppContent } from './core/components/AppContent';
import { DialogProvider } from './core/components/Dialog';
import { RootParamList } from './core/types/navigation';
import {
  AppPreferences,
  editablePreferenceKeys as appEditablePreferenceKeys,
  objectPreferenceKeys as appObjectPreferenceKeys,
  initialAppPreferences,
} from './core/types/preferences';
import { getFcmToken } from './core/utils/firebase';
import { deleteProfilePictureFile } from './utils/profilePicture';

extendSuperJSON();

Mapbox.setAccessToken(process.env.MAPBOX_TOKEN! || 'no_token');

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  fallbackLng: 'en',
  resources: {
    en: {
      translation: { ...en, mfaScreen: mfaScreenTranslations.en },
    },
    it: {
      translation: { ...it, mfaScreen: mfaScreenTranslations.it },
    },
  },
});

initSentry({
  dsn: 'https://0b3fe6c2fc0bd91481a14b1ad5c6b00d@sentry.k8s.polito.it/3',
  enabled: isEnvProduction,
  appName: 'students',
  version: APP_VERSION,
  dist: BUILD_NO,
  environment: process.env.NODE_ENV,
});

extendSuperJSON();

Mapbox.setAccessToken(process.env.MAPBOX_TOKEN || 'no_token');

const appConfig = {
  id: 'students',
  keychainService: 'it.polito.students-app',
} satisfies PolitoAppConfig;

const createAuthClient = () => new AuthApi();
const getPushToken = () => getFcmToken();
const validateStudentIdentity: AuthIdentityValidator = identity => {
  if (identity.type !== 'student') {
    throw new UnsupportedIdentityTypeError(
      `User type ${identity.type} is not supported by the students app`,
    );
  }
};

const App = () => {
  return (
    <SafeAreaProvider>
      <SplashProvider>
        {/* Provide the app-specific preference key lists and types */}
        <PreferencesProvider<AppPreferences>
          extraEditableKeys={appEditablePreferenceKeys}
          extraObjectKeys={appObjectPreferenceKeys}
          initialPreferences={initialAppPreferences}
        >
          <UiProvider<RootParamList>
            linking={createPolitoLinking<RootParamList>(appConfig)}
          >
            <FeedbackProvider>
              <ApiProvider<AppPreferences>
                config={appConfig}
                createAuthClient={createAuthClient}
                getPushToken={getPushToken}
                validateIdentity={validateStudentIdentity}
                onLogoutSuccess={deleteProfilePictureFile}
                updateApiConfiguration={updateGlobalApiConfiguration}
              >
                <DialogProvider />
                <AppContent />
              </ApiProvider>
            </FeedbackProvider>
          </UiProvider>
        </PreferencesProvider>
      </SplashProvider>
    </SafeAreaProvider>
  );
};

export default Sentry.withTouchEventBoundary(App);
