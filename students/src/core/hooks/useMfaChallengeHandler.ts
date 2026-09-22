import { useCallback } from 'react';

import { MfaChallenge } from '@polito/lib/core';
import { useMfaChallenge } from '@polito/lib/features/auth';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootParamList } from '../types/navigation';

export const useMfaChallengeHandler = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();
  const navigateToChallenge = useCallback(
    (challenge: MfaChallenge) => {
      navigation.navigate('ProfileTab', {
        screen: 'PolitoAuthenticator',
        params: {
          activeView: 'auth',
          challenge,
        },
        initial: false,
      });
    },
    [navigation],
  );

  return useMfaChallenge(navigateToChallenge);
};
