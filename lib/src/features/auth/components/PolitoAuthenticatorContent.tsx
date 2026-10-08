import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MfaChallenge } from '../../../core';
import { type Theme, useHideTabs, useStylesheet } from '../../../ui';
import { MfaAuthContent } from './MfaAuthContent';
import { MfaEnrollContent } from './MfaEnrollContent';
import { PolitoAuthenticatorLogo } from './PolitoAuthenticatorLogo';

export type PolitoAuthenticatorContentProps = {
  activeView: 'enroll' | 'auth';
  challenge?: MfaChallenge;
  onClose: () => void;
  onMissingKey: () => void;
  onSettingsEnrollmentComplete: () => void;
  onAuthFinalized?: () => void;
};

export const PolitoAuthenticatorContent = ({
  activeView,
  challenge,
  onClose,
  onMissingKey,
  onSettingsEnrollmentComplete,
  onAuthFinalized,
}: PolitoAuthenticatorContentProps) => {
  const styles = useStylesheet(createStyles);

  useHideTabs();
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: bottom }]}>
      <PolitoAuthenticatorLogo style={styles.logo} />
      {activeView === 'enroll' ? (
        <MfaEnrollContent
          onClose={onClose}
          onSettingsEnrollmentComplete={onSettingsEnrollmentComplete}
        />
      ) : activeView === 'auth' && challenge ? (
        <MfaAuthContent
          challenge={challenge}
          onClose={onClose}
          onMissingKey={onMissingKey}
          onFinalized={onAuthFinalized}
        />
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
