import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import { usePreferencesContext } from '../../../core';
import { UnsupportedIdentityTypeError } from '../errors/UnsupportedIdentityTypeError';
import {
  useLogin,
  useSSOLoginInitiator,
  useVisitChpass,
} from '../queries/authHooks';

export const useAuth = (ssoKey?: string) => {
  const { t } = useTranslation();
  // The app language (which defaults to the device one) is sent on login, so
  // that the server keeps using the language selected in the app settings
  const { loginUid, language } = usePreferencesContext();
  const { mutateAsync: login, isPending: isLoading } = useLogin();
  const handleSSO = useSSOLoginInitiator();
  const viewChpass = useVisitChpass();

  const handleLoginError = useCallback(
    (e: Error) => {
      if (e instanceof UnsupportedIdentityTypeError) {
        Alert.alert(t('common.error'), t('loginScreen.unsupportedUserType'));
      } else {
        console.error(e);
        Alert.alert(
          t('loginScreen.authnError'),
          t('loginScreen.authnErrorDescription'),
        );
      }
    },
    [t],
  );

  const handleBasicLogin = useCallback(
    (username: string, password: string) =>
      login({
        username,
        password,
        preferences: { language },
        loginType: 'basic',
      }).catch(handleLoginError),
    [login, language, handleLoginError],
  );

  useEffect(() => {
    if (loginUid && ssoKey) {
      login({
        uid: loginUid,
        key: ssoKey,
        preferences: { language },
        loginType: 'sso',
      }).catch(handleLoginError);
    }
  }, [loginUid, ssoKey, login, language, handleLoginError]);

  return {
    handleBasicLogin,
    handleSSO,
    viewChpass,
    isLoading,
  };
};
