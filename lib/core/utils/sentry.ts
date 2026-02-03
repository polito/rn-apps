import { APP_VERSION, BUILD_NO } from '@env';
import * as S from '@sentry/react-native';

import { isEnvProduction } from '../../core/utils/env';

export const navigationIntegration = S.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
});

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
