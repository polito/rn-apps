import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import {
  faCalendar,
  faCircleInfo,
  faHashtag,
} from '@fortawesome/free-solid-svg-icons';
import { formatDate, formatDateTime } from '@polito/lib/core';
import {
  Card,
  Icon,
  Row,
  Text,
  type Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useGetTicket } from '~/core/queries/ticketHooks';

import { ServiceStackParamList } from '../../services/components/ServicesNavigator';

type Props = NativeStackScreenProps<ServiceStackParamList, 'TicketInfo'>;

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: IconDefinition;
  label: string;
  value: string;
}) => {
  const styles = useStylesheet(createStyles);
  const { colors, fontSizes } = useTheme();
  return (
    <Row align="flex-start" gap={2} style={styles.row}>
      <Row align="center" gap={1.5} style={styles.rowLabel}>
        <Icon icon={icon} size={fontSizes.xs} color={colors.secondaryText} />
        <Text style={styles.label}>{label}</Text>
      </Row>
      <Text style={styles.value}>{value}</Text>
    </Row>
  );
};

export const TicketInfoScreen = ({ route }: Props) => {
  const { id } = route.params;
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { palettes } = useTheme();
  const ticketQuery = useGetTicket(id);
  const ticket = ticketQuery.data;

  if (!ticket) {
    return null;
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.container}
    >
      <Text style={styles.title}>{ticket.subject}</Text>

      <Card rounded spaced={false} style={styles.card}>
        <InfoRow
          icon={faCircle}
          label={t('common.status')}
          value={t(`tickets.status.${ticket.status}`)}
        />
        <InfoRow
          icon={faHashtag}
          label={t('ticketScreen.ticketNumber')}
          value={`${ticket.id}`}
        />
        <InfoRow
          icon={faCalendar}
          label={t('common.createdAt')}
          value={formatDate(ticket.createdAt)}
        />
        <InfoRow
          icon={faCalendar}
          label={t('common.updatedAt')}
          value={formatDateTime(ticket.updatedAt)}
        />
      </Card>

      <View style={styles.infoMessage}>
        <Icon
          icon={faCircleInfo}
          size={INFO_ICON_SIZE}
          color={palettes.info[700]}
          style={styles.infoMessageIcon}
        />
        <Text style={styles.infoMessageText}>
          {t('ticketScreen.infoResolveHint')}
        </Text>
      </View>
    </ScrollView>
  );
};

const INFO_ICON_SIZE = 16;

const createStyles = ({
  spacing,
  fontSizes,
  fontWeights,
  colors,
  palettes,
  shapes,
}: Theme) =>
  StyleSheet.create({
    container: {
      padding: spacing[5],
      gap: spacing[2.5],
    },
    title: {
      fontSize: fontSizes.xl,
      fontWeight: fontWeights.semibold,
      color: colors.heading,
    },
    card: {
      marginVertical: 0,
      padding: spacing[3],
      gap: spacing[1.5],
    },
    row: {
      width: '100%',
    },
    rowLabel: {
      flexShrink: 0,
    },
    label: {
      fontSize: fontSizes.sm,
      color: colors.secondaryText,
    },
    value: {
      flex: 1,
      textAlign: 'right',
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      color: colors.title,
    },
    infoMessage: {
      flexDirection: 'row',
      gap: spacing[4],
      alignItems: 'flex-start',
      backgroundColor: palettes.info[50],
      borderWidth: 1,
      borderColor: palettes.info[600],
      borderRadius: shapes.lg,
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[3],
    },
    infoMessageIcon: {
      marginTop: spacing[1],
    },
    infoMessageText: {
      flex: 1,
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.medium,
      lineHeight: fontSizes.xs * 1.35,
      color: palettes.info[700],
    },
  });
