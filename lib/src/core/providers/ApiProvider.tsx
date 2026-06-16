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
import {
  QueryCache,
  QueryClient,
  QueryClientConfig,
  QueryClientProvider,
  onlineManager,
} from '@tanstack/react-query';

import {
  ApiContext,
  ApiContextProps,
  Credentials,
} from '../contexts/ApiContext';
import { useFeedbackContext } from '../contexts/FeedbackContext';
import { usePreferencesContext } from '../contexts/PreferencesContext';
import { useSplashContext } from '../contexts/SplashContext';

const DATA_MAX_AGE = 1000 * 3600 * 24 * 7;

/** Minimal shape of the api-client `ResponseError`, kept client-agnostic */
export type ResponseErrorLike = { response: Response };

/** Credentials as returned by the app keychain (token lives in `password`) */
export type StoredCredentials = {
  username: string;
  password?: string | null;
};

/** react-query persister option, derived from the public client config */
type QueryPersisterFn = NonNullable<
  NonNullable<QueryClientConfig['defaultOptions']>['queries']
>['persister'];

type ApiProviderProps = PropsWithChildren<{
  /** Configures the app-specific API client(s) with the token and language */
  updateApiConfiguration: (params: {
    token?: string;
    language?: string;
  }) => void;
  /** Reads the stored credentials from the app keychain */
  getCredentials: () => Promise<StoredCredentials | false>;
  /** Clears the stored credentials in the app keychain */
  resetCredentials: () => Promise<void>;
  /** Type guard that detects the app api-client's `ResponseError` */
  isResponseError: (error: unknown) => error is ResponseErrorLike;
  /** Persister that backs react-query offline cache (app-owned storage) */
  persisterFn?: QueryPersisterFn;
  /** Whether the app runs in a production environment */
  isEnvProduction?: boolean;
}>;

/**
 * Shared API provider: owns the react-query client, global 401/error handling
 * and connectivity feedback, while delegating app-specific concerns (api client
 * configuration, keychain access, error detection) to the props above.
 *
 * `Prefs` is the app-specific preferences shape (e.g. `ApiProvider<AppPreferences>`),
 * mirroring `PreferencesProvider<AppPreferences>`.
 */
export const ApiProvider = <
  Prefs extends { username?: string } = { username?: string },
>({
  children,
  updateApiConfiguration,
  getCredentials,
  resetCredentials,
  isResponseError,
  persisterFn,
  isEnvProduction = false,
}: ApiProviderProps) => {
  const { t } = useTranslation();
  const [apiContext, setApiContext] = useState<ApiContextProps>({
    isLogged: false,
    username: '',
    token: '',
    refreshContext: () => {},
  });
  const { setFeedback } = useFeedbackContext();
  const { language, username } = usePreferencesContext<Prefs>();
  const splashContext = useSplashContext();
  const globalQueryErrorHandler = useCallback(
    async (error: unknown, client: QueryClient) => {
      if (isResponseError(error)) {
        if (error.response.status === 401) {
          await resetCredentials();
          setApiContext(c => ({
            ...c,
            isLogged: false,
            username: '',
            token: '',
          }));
          await client.invalidateQueries();
        }
        const { message } = (await error.response.json()) as {
          message?: string;
        };

        // The login alert is handled in the login screen
        if (!error.response.url.includes('/login'))
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
    [isResponseError, resetCredentials, t, isEnvProduction],
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
          gcTime: DATA_MAX_AGE, // 3 days
          staleTime: 300000, // 5 minutes
          networkMode: 'online',
          retry: isEnvProduction ? 2 : 1,
          refetchOnWindowFocus: isEnvProduction,
          persister: persisterFn,
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
  }, [globalQueryErrorHandler, isResponseError, persisterFn, isEnvProduction]);

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
    getCredentials()
      .then(keychainCredentials => {
        let credentials: Credentials | undefined;

        if (username && keychainCredentials && keychainCredentials.password) {
          credentials = {
            username,
            token: keychainCredentials.password,
          };
        }
        refreshContext(credentials);
      })
      .catch(e => {
        console.warn("Keychain couldn't be accessed!", e);
        refreshContext();
      });
  }, [language, username, queryClient, getCredentials, updateApiConfiguration]);

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
    if (!splashContext.isAppLoaded) {
      splashContext.setIsAppLoaded(true);
    }
  }, [apiContext, splashContext]);

  return (
    <ApiContext.Provider value={apiContext}>
      {splashContext.isAppLoaded && (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      )}
    </ApiContext.Provider>
  );
};
