import { useCallback } from 'react';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import uuid from 'react-native-uuid';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  ApiError,
  AppInfoRequest,
  CredentialsKeychainService,
  EnrolMfaRequest,
  LoginRequest,
  MfaChallenge,
  ValidateMfaRequest,
  clearPersistedQueryCache,
  getPolitoChpassUrl,
  getPolitoSsoLoginUrl,
  pluckData,
  rethrowApiError,
  useApiContext,
  useAuthApiContext,
  usePolitoAppConfig,
  usePolitoAppKeychainServices,
  usePreferencesContext,
} from '../../../core';
import { WebviewType, useOpenInAppLink } from '../hooks/useOpenInAppLink';

export const MFA_CHALLENGE_QUERY_KEY = ['mfaChallenge'];
export const MFA_STATUS_QUERY_KEY = ['mfaStatus'];

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
  const {
    client: authClient,
    getPushToken,
    validateIdentity,
  } = useAuthApiContext();
  const { refreshContext } = useApiContext();
  const { updatePreference } = usePreferencesContext();
  const queryClient = useQueryClient();
  const appConfig = usePolitoAppConfig();
  const { credentials: credentialsKeychain } = usePolitoAppKeychainServices();

  return useMutation({
    mutationFn: (dto: LoginRequest) =>
      Promise.all([
        getClientId(credentialsKeychain),
        DeviceInfo.getDeviceName(),
        DeviceInfo.getModel(),
        DeviceInfo.getManufacturer(),
        DeviceInfo.getBuildNumber(),
        DeviceInfo.getVersion(),
        getPushToken?.(),
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
          ]) =>
            authClient.login({
              loginRequest: {
                ...dto,
                device: {
                  name,
                  platform: Platform.OS,
                  version: `${Platform.Version}`,
                  model,
                  manufacturer,
                  toothPicCompatible: true,
                },
                client: {
                  name: `${appConfig.id}-app`,
                  buildNumber,
                  appVersion,
                  id,
                  fcmRegistrationToken,
                },
                preferences: { ...dto.preferences },
              },
            }),
        )
        .then(pluckData)
        .then(async res => {
          updatePreference('loginUid', null);
          await validateIdentity?.(res);
          queryClient.invalidateQueries({ queryKey: MFA_STATUS_QUERY_KEY });
          return res;
        })
        .catch(rethrowApiError),
    onSuccess: async data => {
      const { token, clientId, username } = data;
      refreshContext({ username, token });
      await credentialsKeychain.setCredentials(clientId, token);
      updatePreference('username', username);
    },
  });
};

export const useLogout = () => {
  const { client: authClient, onLogoutSuccess } = useAuthApiContext();
  const queryClient = useQueryClient();
  const { refreshContext, username } = useApiContext();
  const { updatePreference } = usePreferencesContext();
  const {
    credentials: credentialsKeychain,
    mfaPrivateKey: mfaPrivateKeyKeychain,
  } = usePolitoAppKeychainServices();

  return useMutation({
    mutationFn: () => authClient.logout(),
    onSuccess: async () => {
      updatePreference('politoAuthnEnrolmentStatus', {});
      refreshContext();
      clearPersistedQueryCache().catch(e => {
        console.error('Error clearing query storage:', e);
      });
      queryClient.removeQueries();
      if (username) {
        await onLogoutSuccess?.(username);
      }
      await credentialsKeychain.resetCredentials();
      await mfaPrivateKeyKeychain.resetPrivateKeyMFA();
    },
  });
};

export const useUpdateAppInfo = () => {
  const { client: authClient, getPushToken } = useAuthApiContext();

  return useMutation({
    mutationFn: async (fcmToken: string | void | null) => {
      const [buildNumber, appVersion, fcmRegistrationToken] = await Promise.all(
        [
          DeviceInfo.getBuildNumber(),
          DeviceInfo.getVersion(),
          fcmToken === null ? undefined : fcmToken || getPushToken?.(),
        ],
      );
      const dto: AppInfoRequest = {
        buildNumber,
        appVersion,
        fcmRegistrationToken,
      };
      return authClient.appInfo({ appInfoRequest: dto });
    },
  });
};

export const useCheckMfa = (autoFetch = false) => {
  const { client: authClient } = useAuthApiContext();

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
  const { client: authClient } = useAuthApiContext();

  return useMutation({
    mutationFn: (dto: EnrolMfaRequest) =>
      authClient
        .enrolMfa({ enrolMfaRequest: dto })
        .then(pluckData)
        .catch(rethrowApiError),
  });
};

export const useMfaAuth = () => {
  const { client: authClient } = useAuthApiContext();

  return useMutation({
    mutationFn: async (dto: ValidateMfaRequest) =>
      authClient
        .validateMfa({ validateMfaRequest: dto })
        .then(pluckData)
        .then(({ success }) => success)
        .catch(rethrowApiError),
  });
};

/** Fetches the pending challenge; any navigation remains app-owned. */
export const useMfaChallenge = (
  onChallenge?: (challenge: MfaChallenge) => void,
) => {
  const { client: authClient } = useAuthApiContext();

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
            onChallenge?.(data);
          }
          return data;
        })
        .catch(rethrowApiError)
        .catch(e => {
          if (e instanceof ApiError && e.responseCode === 404) {
            return null;
          }
          throw e;
        }),
  });
};

export const useSSOLoginInitiator = () => {
  const { updatePreference } = usePreferencesContext();
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
