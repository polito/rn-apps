import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { useStylesheet } from '../hooks/useStylesheet';
import { useTheme } from '../hooks/useTheme';
import { Theme } from '../types/Theme';
import { CtaButton } from './CtaButton';
import { CtaButtonContainer } from './CtaButtonContainer';
import { Text } from './Text';

type SSOScreenProps = {
  logo: ReactNode;
  isLoading?: boolean;
  onLoginPress: () => void;
  onSsoPress: () => void;
};

export const SSOScreen = ({
  logo,
  isLoading,
  onLoginPress,
  onSsoPress,
}: SSOScreenProps) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { spacing } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>{logo}</View>
      </View>
      <CtaButtonContainer absolute={true} style={{ gap: spacing[0] }}>
        <CtaButton
          absolute={false}
          title={t('ssoScreen.ssoButton')}
          action={onSsoPress}
          loading={isLoading}
        />
        <TouchableOpacity style={styles.link} onPress={onLoginPress}>
          <Text variant="link" style={styles.textLink}>
            {t('ssoScreen.ssoLink')}
          </Text>
        </TouchableOpacity>
        <View style={{ height: spacing[10] }} />
      </CtaButtonContainer>
    </View>
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoContainer: {
      width: '30%',
      aspectRatio: 120 / 168,
    },
    link: {
      alignItems: 'center',
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[2],
      marginBottom: spacing[3],
    },
    textLink: { textDecorationLine: 'underline' },
  });
