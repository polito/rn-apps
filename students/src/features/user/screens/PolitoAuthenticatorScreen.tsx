import { useCallback } from 'react';

import { resetNavigationStatusTo } from '@polito/lib/core';
import { PolitoAuthenticatorContent } from '@polito/lib/features/auth';
import { MessageType } from '@polito/student-api-client';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  useGetMessages,
  useMarkMessageAsRead,
} from '../../../core/queries/studentHooks';
import { UserStackParamList } from '../components/UserNavigator';

type Props = NativeStackScreenProps<UserStackParamList, 'PolitoAuthenticator'>;

export const PolitoAuthenticatorScreen = ({ route, navigation }: Props) => {
  const { activeView, challenge } = route.params;
  const { mutate: markMessageAsRead } = useMarkMessageAsRead();
  const { data: messages } = useGetMessages(activeView === 'auth');

  const markMfaMessageAsRead = useCallback(() => {
    const mfaMessage = messages?.find(
      message => message.type === MessageType.Mfa && !message.isRead,
    );
    if (mfaMessage) {
      markMessageAsRead(mfaMessage.id);
    }
  }, [markMessageAsRead, messages]);

  const handleClose = useCallback(() => navigation.goBack(), [navigation]);
  const handleMissingKey = useCallback(
    () => navigation.navigate('Settings'),
    [navigation],
  );
  const handleSettingsEnrollmentComplete = useCallback(
    () =>
      resetNavigationStatusTo(navigation, 'ProfileTab', [
        { name: 'Profile', params: { firstRequest: false } },
        { name: 'Settings' },
        { name: 'MfaSettings' },
      ]),
    [navigation],
  );

  return (
    <PolitoAuthenticatorContent
      activeView={activeView}
      challenge={challenge}
      onClose={handleClose}
      onMissingKey={handleMissingKey}
      onSettingsEnrollmentComplete={handleSettingsEnrollmentComplete}
      onAuthFinalized={markMfaMessageAsRead}
    />
  );
};
