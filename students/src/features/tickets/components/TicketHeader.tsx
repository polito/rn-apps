import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { dateFormatter, formatDate } from '@polito/lib/core';
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

import {
  type TicketStatusGroup,
  getTicketStatusGroup,
} from '~/core/queries/ticketHooks';

interface TicketHeaderProps {
  ticket: TicketOverview;
  onPress?: () => void;
}

export const TicketHeader = ({ ticket, onPress }: TicketHeaderProps) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { palettes, colors, fontSizes } = useTheme();

  const groupPalettes: Record<TicketStatusGroup, Palette> = {
    open: palettes.info,
    resolved: palettes.success,
    duplicate: palettes.purple,
  };
  const statusGroup = getTicketStatusGroup(ticket.status);
  const palette = groupPalettes[statusGroup];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('ticketScreen.infoModalTitle')}
      onPress={onPress}
      style={styles.bar}
    >
      <Col flex={1} gap={2}>
        <Text variant="heading" style={styles.title} numberOfLines={2}>
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
            <Text style={styles.value}>
              {t('common.dateAtTime', {
                date: formatDate(ticket.updatedAt),
                time: dateFormatter('HH:mm')(ticket.updatedAt),
                interpolation: { escapeValue: false },
              })}
            </Text>
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
  fontFamilies,
  colors,
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
      fontFamily: fontFamilies.title,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
      color: colors.title,
    },
    tag: {
      borderRadius: 6,
      paddingHorizontal: 5,
      alignSelf: 'flex-start',
    },
    tagText: {
      fontFamily: fontFamilies.title,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
    },
  });
