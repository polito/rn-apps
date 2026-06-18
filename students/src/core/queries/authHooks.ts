import { useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import uuid from 'react-native-uuid';

import {
  ApiError,
  CredentialsKeychainService,
  clearPersistedQueryCache,
  getPolitoChpassUrl,
  getPolitoSsoLoginUrl,
  pluckData,
  rethrowApiError,
  useApiContext,
  usePolitoAppConfig,
  usePolitoAppKeychainServices,
  usePreferencesContext,
} from '@polito/lib/core';
import {
  AppInfoRequest,
  AuthApi,
  EnrolMfaRequest,
  LoginRequest,
  SwitchCareerRequest,
  ValidateMfaRequest,
} from '@polito/student-api-client';
import { getMessaging, getToken } from '@react-native-firebase/messaging';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { UserStackParamList } from '~/features/user/components/UserNavigator.tsx';

import { t } from 'i18next';

import { UnsupportedUserTypeError } from '../errors/UnsupportedUserTypeError';
import { WebviewType, useOpenInAppLink } from '../hooks/useOpenInAppLink.ts';
import { AppPreferences } from '../types/preferences.ts';

export const WEBMAIL_LINK_QUERY_KEY = ['webmailLink'];
export const MFA_CHALLENGE_QUERY_KEY = ['mfaChallenge'];
export const MFA_STATUS_QUERY_KEY = ['mfaStatus'];

const useAuthClient = (): AuthApi => {
  return new AuthApi();
};

export async function getFcmToken(
  catchException: boolean = true,
): Promise<string | undefined> {
  try {
    return await getToken(getMessaging());
  } catch (e) {
    if (!catchException) {
      throw e;
    }
    console.error(e);
    Alert.alert(t('common.error'), t('loginScreen.fcmUnsupported'));
  }

  return undefined;
}

const getClientId = async (
  credentialsKeychain: CredentialsKeychainService,
): Promise<string> => {
  try {
    const credentials = await credentialsKeychain.getCredentials();
    if (credentials && credentials.username) {
      return credentials.username;
    }
  } catch (e) {
    console.warn("Keychain couldn't be accessed!", e);
  }
  const clientId = uuid.v4();
  await credentialsKeychain.setCredentials(clientId);
  return clientId;
};

export const useLogin = () => {
  const authClient = useAuthClient();
  const { refreshContext } = useApiContext();
  const { updatePreference } = usePreferencesContext<AppPreferences>();
  const queryClient = useQueryClient();
  const appConfig = usePolitoAppConfig();
  const { credentials: credentialsKeychain } = usePolitoAppKeychainServices();

  return useMutation({
    mutationFn: (dto: LoginRequest) => {
      return Promise.all([
        getClientId(credentialsKeychain),
        DeviceInfo.getDeviceName(),
        DeviceInfo.getModel(),
        DeviceInfo.getManufacturer(),
        DeviceInfo.getBuildNumber(),
        DeviceInfo.getVersion(),
        getFcmToken(),
      ])
        .then(
          ([
            id,
            name,
            model,
            manufacturer,
            buildNumber,
            appVersion,
            fcmRegistrationToken,
          ]) => {
            dto.device = {
              name,
              platform: Platform.OS,
              version: `${Platform.Version}`,
              model,
              manufacturer,
              toothPicCompatible: true,
            };
            dto.client = {
              name: appConfig.clientName,
              buildNumber,
              appVersion,
              id,
              fcmRegistrationToken,
            };
            dto.preferences = { ...dto.preferences };
          },
        )
        .then(() => authClient.login({ loginRequest: dto }))
        .then(pluckData)
        .then(res => {
          updatePreference('loginUid', null); // needed to exit from login screen
          if (res?.type !== 'student') {
            throw new UnsupportedUserTypeError(
              `User type ${res?.type} not supported by this app`,
            );
          }
          queryClient.invalidateQueries({ queryKey: MFA_STATUS_QUERY_KEY });
          return res;
        })
        .catch(rethrowApiError);
    },
    onSuccess: async data => {
      const { token, clientId, username } = data;
      /* refreshing context now is just to speed up login,
      and avoid waiting for the setCredentials & preferences update,
      since it's already refreshed upon username change in prefs */
      refreshContext({ username, token });
      await credentialsKeychain.setCredentials(clientId, token);
      updatePreference('username', username);
    },
  });
};

export const useLogout = () => {
  const authClient = useAuthClient();
  const queryClient = useQueryClient();
  const { refreshContext } = useApiContext();
  const { updatePreference } = usePreferencesContext<AppPreferences>();
  const {
    credentials: credentialsKeychain,
    mfaPrivateKey: mfaPrivateKeyKeychain,
  } = usePolitoAppKeychainServices();
  return useMutation({
    mutationFn: () => {
      return authClient.logout();
    },
    onSuccess: async () => {
      updatePreference('politoAuthnEnrolmentStatus', {});
      refreshContext();
      clearPersistedQueryCache().catch(e => {
        console.error('Error clearing query storage:', e);
      });
      queryClient.removeQueries();
      await credentialsKeychain.resetCredentials();
      await mfaPrivateKeyKeychain.resetPrivateKeyMFA();
    },
  });
};

export const useSwitchCareer = () => {
  const authClient = useAuthClient();
  const { refreshContext } = useApiContext();
  const { updatePreference } = usePreferencesContext<AppPreferences>();
  const queryClient = useQueryClient();
  const { credentials: credentialsKeychain } = usePolitoAppKeychainServices();

  return useMutation({
    mutationFn: (dto: SwitchCareerRequest) =>
      authClient.switchCareer({ switchCareerRequest: dto }).then(pluckData),
    onSuccess: async data => {
      const { token, username, clientId } = data;
      /* refreshing context now is just to speed up career switch,
      and avoid waiting for the setCredentials & preferences update,
      since it's already refreshed upon username change in prefs */
      refreshContext({ token, username });
      queryClient.invalidateQueries();

      await credentialsKeychain.setCredentials(clientId, token);
      updatePreference('username', username);
    },
  });
};

export const useUpdateAppInfo = () => {
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (fcmToken: string | void | null) => {
      // mutation requires a variable, an undefined string is not accepted
      return Promise.all([
        DeviceInfo.getBuildNumber(),
        DeviceInfo.getVersion(),
        fcmToken === null ? undefined : fcmToken || getFcmToken(),
      ]).then(([buildNumber, appVersion, fcmRegistrationToken]) => {
        const dto: AppInfoRequest = {
          buildNumber,
          appVersion,
          fcmRegistrationToken,
        };
        return authClient.appInfo({
          appInfoRequest: dto,
        });
      });
    },
  });
};

export const useGetWebmailLink = () => {
  const authClient = useAuthClient();

  return useCallback(
    () => authClient.getMailLink().then(pluckData),
    [authClient],
  );
};

export const useCheckMfa = (autoFetch = false) => {
  const authClient = useAuthClient();

  return useQuery({
    queryKey: MFA_STATUS_QUERY_KEY,
    staleTime: autoFetch ? undefined : Infinity,
    gcTime: autoFetch ? undefined : Infinity,
    queryFn: () =>
      authClient
        .getMfaStatus()
        .then(pluckData)
        .then(res => {
          if (!res) {
            throw new Error('Failed to get MFA status');
          }
          return res;
        }),
  });
};

export const useMfaEnrol = () => {
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: (dto: EnrolMfaRequest) =>
      authClient
        .enrolMfa({ enrolMfaRequest: dto })
        .then(pluckData)
        .catch(rethrowApiError),
  });
};

export const useMfaAuth = () => {
  const authClient = useAuthClient();

  return useMutation({
    mutationFn: async (dto: ValidateMfaRequest) =>
      authClient
        .validateMfa({ validateMfaRequest: dto })
        .then(pluckData)
        .then(({ success }) => success)
        .catch(rethrowApiError),
  });
};

export const useMfaChallengeHandler = () => {
  const authClient = useAuthClient();
  const navigation =
    useNavigation<NativeStackNavigationProp<UserStackParamList>>();

  return useQuery({
    queryKey: MFA_CHALLENGE_QUERY_KEY,
    enabled: false,
    refetchOnWindowFocus: false,
    queryFn: () =>
      authClient
        .fetchChallenge()
        .then(pluckData)
        .then(data => {
          if (data?.challenge) {
            navigation.navigate('ProfileTab', {
              screen: 'PolitoAuthenticator',
              params: {
                activeView: 'auth',
                challenge: data,
              },
              initial: false,
            });
          }
          return data;
        })
        .catch(rethrowApiError)
        .catch(e => {
          if (e instanceof ApiError && e.responseCode === 404) {
            return {};
          }
          throw e;
        }),
  });
};

export const useSSOLoginInitiator = () => {
  const { updatePreference } = usePreferencesContext<AppPreferences>();
  const appConfig = usePolitoAppConfig();

  const sessionOpener = useOpenInAppLink(WebviewType.LOGIN);

  return useCallback(
    async (forceMfa: boolean = false) => {
      const uid = uuid.v4();
      updatePreference('loginUid', uid);

      const urlParts = [getPolitoSsoLoginUrl(appConfig.id), `uid=${uid}`];
      if (forceMfa) {
        urlParts.push('mfa');
      }

      await sessionOpener(urlParts.join('&')).catch(console.error);
    },
    [appConfig.id, sessionOpener, updatePreference],
  );
};

export const useVisitChpass = () => {
  const sessionOpener = useOpenInAppLink(WebviewType.LOGIN);

  return useCallback(async () => {
    await sessionOpener(getPolitoChpassUrl()).catch(console.error);
  }, [sessionOpener]);
};
