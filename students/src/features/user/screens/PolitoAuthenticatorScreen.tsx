import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { type Theme, useHideTabs, useStylesheet } from '@polito/lib/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { PolitoAuthenticatorLogo } from '../../../core/components/PolitoAuthenticatorLogo';
import { MfaAuthScreen } from '../components/MfaAuthContent';
import { MfaEnrollScreen } from '../components/MfaEnrollContent';
import { UserStackParamList } from '../components/UserNavigator';

type Props = NativeStackScreenProps<UserStackParamList, 'PolitoAuthenticator'>;

export const PolitoAuthenticatorScreen = ({ route, navigation }: Props) => {
  const { activeView, challenge } = route.params;
  const styles = useStylesheet(createStyles);

  useHideTabs();
  const { bottom } = useSafeAreaInsets();

  if (!activeView) return null;

  return (
    <View style={[styles.container, { paddingBottom: bottom }]}>
      <PolitoAuthenticatorLogo style={styles.logo} />
      {activeView === 'enroll' ? (
        <MfaEnrollScreen navigation={navigation} />
      ) : activeView === 'auth' && challenge ? (
        <MfaAuthScreen challenge={challenge} navigation={navigation} />
      ) : null}
    </View>
  );
};

const createStyles = ({ colors, spacing }: Theme) =>
  StyleSheet.create({
    logo: {
      width: spacing[96],
      height: spacing[32],
      marginBottom: spacing[8],
    },
    container: {
      backgroundColor: colors.background,
      width: '100%',
      paddingHorizontal: spacing[4],
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
