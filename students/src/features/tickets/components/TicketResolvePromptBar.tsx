import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { CtaButton, Text, type Theme, useStylesheet } from '@polito/lib/ui';

interface TicketResolvePromptBarProps {
  onPress: () => void;
}

export const TicketResolvePromptBar = ({
  onPress,
}: TicketResolvePromptBarProps) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('ticketScreen.resolveQuestion')}</Text>
      <CtaButton
        absolute={false}
        variant="outlined"
        icon={faCheck}
        title={t('ticketScreen.resolveCta')}
        action={onPress}
        containerStyle={styles.buttonContainer}
      />
    </View>
  );
};

const createStyles = ({ spacing, fontSizes, fontWeights, colors }: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      paddingHorizontal: spacing[4],
      paddingTop: spacing[2],
      paddingBottom: spacing[4],
      gap: spacing[2],
    },
    title: {
      color: colors.heading,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
    },
    buttonContainer: {
      paddingVertical: 0,
    },
  });
