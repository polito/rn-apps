import * as S from '@sentry/react-native';

export const navigationIntegration = S.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
});

export const initSentry = (config: {
  dsn: string;
  enabled: boolean;
  appName: string;
  version: string;
  dist: string;
  environment: string;
  tracesSampleRate?: number;
}) => {
  S.init({
    dsn: config.dsn,
    enabled: config.enabled,
    enableNative: true,
    integrations: [navigationIntegration],
    release: `it.polito.${config.appName}@${config.version}`,
    dist: config.dist,
    environment: config.environment,
    tracesSampleRate: config.tracesSampleRate || 1.0,
  });
};

export const Sentry = S;
