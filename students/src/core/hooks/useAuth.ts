import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import { usePreferencesContext } from '@lib/core/contexts/PreferencesContext';
import { useDeviceLanguage } from '@lib/core/hooks/useDeviceLanguage';

import { UnsupportedUserTypeError } from '~/core/errors/UnsupportedUserTypeError';
import {
  useLogin,
  useSSOLoginInitiator,
  useVisitChpass,
} from '~/core/queries/authHooks';

import { AppPreferences } from '../types/preferences';

export const useAuth = (ssoKey?: string) => {
  const { t } = useTranslation();
  const { updatePreference, loginUid } =
    usePreferencesContext<AppPreferences>();
  const { mutateAsync: login, isPending: isLoading } = useLogin();
  const language = useDeviceLanguage();
  const handleSSO = useSSOLoginInitiator();
  const viewChpass = useVisitChpass();

  const handleLoginError = useCallback(
    (e: Error) => {
      if (e instanceof UnsupportedUserTypeError) {
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
  }, [loginUid, ssoKey, login, language, updatePreference, handleLoginError]);

  return {
    handleBasicLogin,
    handleSSO,
    viewChpass,
    isLoading,
  };
};
