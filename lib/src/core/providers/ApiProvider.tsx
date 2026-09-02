import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import NetInfo from '@react-native-community/netinfo';
import * as Sentry from '@sentry/react-native';
import { experimental_createQueryPersister } from '@tanstack/query-persist-client-core';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
  onlineManager,
} from '@tanstack/react-query';

import { SQLiteStorage } from 'expo-sqlite/kv-store';
import SuperJSON from 'superjson';

import { PolitoAppConfig } from '../config';
import {
  ApiContext,
  ApiContextProps,
  Credentials,
} from '../contexts/ApiContext';
import { AuthApiContext } from '../contexts/AuthApiContext';
import { useFeedbackContext } from '../contexts/FeedbackContext';
import { PolitoAppContext } from '../contexts/PolitoAppContext';
import { usePreferencesContext } from '../contexts/PreferencesContext';
import { useSplashContext } from '../contexts/SplashContext';
import {
  AuthApiClient,
  AuthIdentityValidator,
  AuthLogoutSuccessHandler,
  PushTokenProvider,
} from '../types/auth';
import { isEnvProduction } from '../utils/env';
import { createPolitoAppKeychainServices } from '../utils/keychain';
import { isResponseError } from '../utils/queries';

const DATA_MAX_AGE = 1000 * 3600 * 24 * 7;

const queryStorage = new SQLiteStorage('queryClient');

const queryPersister = experimental_createQueryPersister({
  storage: queryStorage,
  serialize: SuperJSON.stringify,
  deserialize: SuperJSON.parse,
  maxAge: DATA_MAX_AGE,
  refetchOnRestore: 'always',
});

export const clearPersistedQueryCache = () => queryStorage.clear();

type ApiProviderProps = PropsWithChildren<{
  /** App-owned identity and keychain configuration */
  config: PolitoAppConfig;
  /** Creates the generated auth client owned and configured by this app */
  createAuthClient: () => AuthApiClient;
  /** Optional app-owned push transport used to register this device */
  getPushToken?: PushTokenProvider;
  /** Optional app-owned policy for identities returned by the shared login */
  validateIdentity?: AuthIdentityValidator;
  /** Optional app-owned cleanup after a successful logout */
  onLogoutSuccess?: AuthLogoutSuccessHandler;
  /** Configures the app-specific API client(s) with the token and language */
  updateApiConfiguration: (params: {
    token?: string;
    language?: string;
  }) => void;
}>;

/**
 * Shared API provider: owns the react-query client, global 401/error handling
 * and connectivity feedback. App identity drives the shared keychain, SSO and
 * persistence configuration; the app only plugs in its generated API clients.
 *
 * `Prefs` is the app-specific preferences shape (e.g. `ApiProvider<AppPreferences>`),
 * mirroring `PreferencesProvider<AppPreferences>`.
 */
export const ApiProvider = <Prefs extends object = {}>({
  children,
  config,
  createAuthClient,
  getPushToken,
  validateIdentity,
  onLogoutSuccess,
  updateApiConfiguration,
}: ApiProviderProps) => {
  const { t } = useTranslation();
  const [apiContext, setApiContext] = useState<ApiContextProps>({
    isLogged: false,
    username: '',
    token: '',
    refreshContext: () => {},
  });
  const [hasResolvedInitialCredentials, setHasResolvedInitialCredentials] =
    useState(false);
  const { setFeedback } = useFeedbackContext();
  const { language, username, updatePreference } =
    usePreferencesContext<Prefs>();
  const splashContext = useSplashContext();
  const authApiContext = useMemo(
    () => ({
      client: createAuthClient(),
      getPushToken,
      validateIdentity,
      onLogoutSuccess,
    }),
    [createAuthClient, getPushToken, onLogoutSuccess, validateIdentity],
  );
  const keychainServices = useMemo(
    () => createPolitoAppKeychainServices(config),
    [config],
  );
  const resetCredentials = useCallback(async () => {
    await keychainServices.credentials.resetCredentials();
    await keychainServices.mfaPrivateKey.resetPrivateKeyMFA();
  }, [keychainServices]);

  const globalQueryErrorHandler = useCallback(
    async (error: unknown, client: QueryClient) => {
      if (isResponseError(error)) {
        if (error.response.status === 401) {
          await resetCredentials();
          updatePreference('politoAuthnEnrolmentStatus', {});
          Sentry.setUser(null);
          updateApiConfiguration({ language });
          setApiContext(c => ({
            ...c,
            isLogged: false,
            username: '',
            token: '',
          }));
          await clearPersistedQueryCache();
          await client.invalidateQueries();
        }
        const { message } = (await error.response.json()) as {
          message?: string;
        };

        // The login alert is handled in the login screen
        if (!error.response.url?.includes('/login'))
          Alert.alert(
            t('common.error'),
            message ?? t('common.somethingWentWrong'),
          );

        if (!isEnvProduction) {
          console.error(message);
          console.error(JSON.stringify(error));
        }
      }
    },
    [language, resetCredentials, t, updateApiConfiguration, updatePreference],
  );

  const queryClient = useMemo(() => {
    const client = new QueryClient({
      queryCache: new QueryCache({
        onError: error => {
          if (isResponseError(error)) {
            globalQueryErrorHandler(error, client);
          }
        },
      }),
      defaultOptions: {
        queries: {
          gcTime: DATA_MAX_AGE,
          staleTime: 300000, // 5 minutes
          networkMode: 'online',
          retry: isEnvProduction ? 2 : 1,
          refetchOnWindowFocus: isEnvProduction,
          persister: queryPersister.persisterFn,
        },
        mutations: {
          retry: 1,
          onError(error) {
            if (isResponseError(error)) {
              globalQueryErrorHandler(error, client);
            }
          },
        },
      },
    });
    return client;
  }, [globalQueryErrorHandler]);

  useEffect(() => {
    // Update ApiContext based on the provided token and selected language
    const refreshContext = (credentials?: Credentials) => {
      if (credentials) {
        Sentry.setUser({ username: credentials.username });
      } else {
        Sentry.setUser(null);
      }

      updateApiConfiguration({
        token: credentials?.token,
        language,
      });

      setApiContext(() => ({
        isLogged: !!credentials,
        username: credentials?.username ?? '',
        token: credentials?.token ?? '',
        refreshContext,
      }));
    };

    // Retrieve existing token from the keychain, if any
    keychainServices.credentials
      .getCredentials()
      .then(keychainCredentials => {
        let credentials: Credentials | undefined;

        if (username && keychainCredentials && keychainCredentials.password) {
          credentials = {
            username,
            token: keychainCredentials.password,
          };
        }
        refreshContext(credentials);
        setHasResolvedInitialCredentials(true);
      })
      .catch(e => {
        console.warn("Keychain couldn't be accessed!", e);
        refreshContext();
        setHasResolvedInitialCredentials(true);
      });
  }, [keychainServices, language, username, updateApiConfiguration]);

  useEffect(() => {
    // Track connectivity and surface a persistent feedback when offline
    onlineManager.setEventListener(setOnline => {
      return NetInfo.addEventListener(state => {
        const isConnected =
          state.isConnected && state.isInternetReachable !== false;
        const wasOnline = onlineManager.isOnline();
        if (wasOnline && !isConnected) {
          // Phone just went offline
          setOnline(false);
          setFeedback({
            text: t('common.noInternet'),
            isError: true,
            isPersistent: true,
          });
        } else if (!wasOnline && isConnected) {
          // Phone is back online
          setOnline(true);
          setFeedback(null);
        }
      });
    });
  }, [setFeedback, t]);

  // Initialization completed, splash can be hidden
  useEffect(() => {
    if (hasResolvedInitialCredentials && !splashContext.isAppLoaded) {
      splashContext.setIsAppLoaded(true);
    }
  }, [hasResolvedInitialCredentials, splashContext]);

  return (
    <PolitoAppContext.Provider value={config}>
      <AuthApiContext.Provider value={authApiContext}>
        <ApiContext.Provider value={apiContext}>
          {splashContext.isAppLoaded && (
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          )}
        </ApiContext.Provider>
      </AuthApiContext.Provider>
    </PolitoAppContext.Provider>
  );
};
