import { APP_VERSION, BUILD_NO } from '@env';
import { isEnvProduction } from '@lib/core/utils/env';
import * as S from '@sentry/react-native';

import Constants from 'expo-constants';

export const navigationIntegration = S.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
});

console.log(Constants);

S.init({
  dsn: process.env.SENTRY_DSN,
  enabled: isEnvProduction,
  enableNative: true,
  integrations: [navigationIntegration],
  release: `it.polito.${process.env.APP_NAME}@${APP_VERSION}`,
  dist: BUILD_NO,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

export const Sentry = S;
