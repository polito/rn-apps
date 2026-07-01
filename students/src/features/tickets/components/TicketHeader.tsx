import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { formatDateTime } from '@polito/lib/core';
import {
  Col,
  Icon,
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
  onPress?: () => void;
}

export const TicketHeader = ({ ticket, onPress }: TicketHeaderProps) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { palettes, colors, fontSizes } = useTheme();

  // Statuses are grouped into 3 visual categories (see Figma "Stati"):
  // open (pending/open/waiting_user/incoming), resolved (resolved/autoresolved)
  // and duplicate. The category drives both the tag label and color.
  const statusGroups: Record<string, 'open' | 'resolved' | 'duplicate'> = {
    open: 'open',
    pending: 'open',
    waiting_user: 'open',
    incoming: 'open',
    resolved: 'resolved',
    autoresolved: 'resolved',
    closed: 'resolved',
    duplicate: 'duplicate',
  };
  const groupPalettes: Record<'open' | 'resolved' | 'duplicate', Palette> = {
    open: palettes.primary,
    resolved: palettes.success,
    duplicate: palettes.violet,
  };
  const statusGroup = statusGroups[ticket.status] ?? 'open';
  const palette = groupPalettes[statusGroup];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('ticketScreen.infoModalTitle')}
      onPress={onPress}
      style={styles.bar}
    >
      <Col flex={1} gap={2}>
        <Text style={styles.title} numberOfLines={2}>
          {ticket.subject}
        </Text>
        <Row gap={8} align="flex-start">
          <Col gap={1}>
            <Text style={styles.label}>{t('common.status')}</Text>
            <View style={[styles.tag, { backgroundColor: palette[50] }]}>
              <Text style={[styles.tagText, { color: palette[600] }]}>
                {t(`tickets.status.${statusGroup}`)}
              </Text>
            </View>
          </Col>
          <Col gap={1}>
            <Text style={styles.label}>{t('common.updatedAt')}</Text>
            <Text style={styles.value}>{formatDateTime(ticket.updatedAt)}</Text>
          </Col>
        </Row>
      </Col>
      {!!onPress && (
        <Icon
          icon={faChevronRight}
          size={fontSizes.md}
          color={colors.secondaryText}
        />
      )}
    </Pressable>
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
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[4],
      backgroundColor: colors.surface,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
    },
    title: {
      fontSize: fontSizes.xl,
      fontWeight: fontWeights.semibold,
      color: colors.heading,
    },
    label: {
      fontSize: fontSizes.sm,
      color: colors.secondaryText,
    },
    value: {
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
      color: colors.title,
    },
    tag: {
      borderRadius: shapes.sm,
      paddingHorizontal: spacing[1.5],
      paddingVertical: spacing[0.5],
      alignSelf: 'flex-start',
    },
    tagText: {
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
    },
  });
