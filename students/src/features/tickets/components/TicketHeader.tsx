import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import {
  Palette,
  Row,
  Text,
  type Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { TicketOverview } from '@polito/student-api-client';

interface TicketHeaderProps {
  ticket: TicketOverview;
}

export const TicketHeader = ({ ticket }: TicketHeaderProps) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { palettes } = useTheme();

  const statusPalettes: Record<string, Palette> = {
    open: palettes.primary,
    pending: palettes.secondary,
    waiting_user: palettes.secondary,
    incoming: palettes.primary,
    resolved: palettes.success,
    autoresolved: palettes.success,
    duplicate: palettes.gray,
  };
  const palette = statusPalettes[ticket.status] ?? palettes.gray;

  return (
    <View style={styles.bar}>
      <Row align="center" gap={2}>
        <Text style={styles.statusLabel}>{t('common.status')}</Text>
        <View style={[styles.tag, { backgroundColor: palette[50] }]}>
          <Text style={[styles.tagText, { color: palette[600] }]}>
            {t(`tickets.status.${ticket.status}`)}
          </Text>
        </View>
      </Row>
    </View>
  );
};

const createStyles = ({
  spacing,
  fontSizes,
  fontWeights,
  colors,
  shapes,
}: Theme) =>
  StyleSheet.create({
    bar: {
      backgroundColor: colors.surface,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
    },
    statusLabel: {
      fontSize: fontSizes.sm,
      color: colors.secondaryText,
    },
    tag: {
      borderRadius: shapes.sm,
      paddingHorizontal: spacing[1.5],
      paddingVertical: spacing[0.5],
    },
    tagText: {
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
    },
  });
