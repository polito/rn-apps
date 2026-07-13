import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCalendar, faCircle } from '@fortawesome/free-regular-svg-icons';
import { faCircleInfo, faHashtag } from '@fortawesome/free-solid-svg-icons';
import { dateFormatter, formatDate } from '@polito/lib/core';
import {
  Card,
  Icon,
  Row,
  Text,
  type Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { TicketStatus } from '@polito/student-api-client';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  getTicketStatusGroup,
  isResolvedTicketStatus,
  useGetTicket,
  useMarkTicketAsClosed,
} from '~/core/queries/ticketHooks';

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
    <Row align="center" gap={2} style={styles.row}>
      <Row align="center" gap={1.5} style={styles.rowLabel}>
        <View style={styles.iconWrap}>
          <Icon icon={icon} size={fontSizes.xs} color={colors.secondaryText} />
        </View>
        <Text style={styles.label}>{label}</Text>
      </Row>
      <Text variant="heading" style={styles.value}>
        {value}
      </Text>
    </Row>
  );
};

export const TicketInfoScreen = ({ route, navigation }: Props) => {
  const { id } = route.params;
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { palettes } = useTheme();
  const ticketQuery = useGetTicket(id);
  const ticket = ticketQuery.data;
  const refetchTicket = ticketQuery.refetch;
  const { mutateAsync: markTicketAsClosed } = useMarkTicketAsClosed(id);

  const canMarkResolved = useMemo(() => {
    const status = ticket?.status;
    if (!status) {
      return false;
    }
    return (
      !isResolvedTicketStatus(status) &&
      status !== TicketStatus.Autoresolved &&
      status !== TicketStatus.Duplicate
    );
  }, [ticket?.status]);

  const onPressMarkResolved = useCallback(() => {
    Alert.alert(
      t('ticketScreen.resolveConfirmTitle'),
      t('ticketScreen.resolveConfirmMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.confirm'),
          onPress: async () => {
            try {
              await markTicketAsClosed();
              const { data: closedTicket } = await refetchTicket();
              if (!closedTicket?.needsFeedback) {
                navigation.goBack();
                return;
              }
              navigation.navigate('TicketResolved', {
                ticketId: id,
                markAsResolved: true,
              });
            } catch {
              Alert.alert(t('common.error'), t('ticketScreen.sendError'));
            }
          },
        },
      ],
      { cancelable: true },
    );
  }, [t, navigation, id, markTicketAsClosed, refetchTicket]);

  const headerRight = useCallback(() => {
    if (!ticket?.status) {
      return null;
    }
    const disabled = !canMarkResolved;
    return (
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        accessibilityLabel={t('ticketScreen.markAsResolved')}
        onPress={onPressMarkResolved}
        disabled={disabled}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={styles.markResolvedButton}
      >
        <Text
          style={[styles.markResolved, disabled && styles.markResolvedDisabled]}
        >
          {t('ticketScreen.markAsResolved')}
        </Text>
      </TouchableOpacity>
    );
  }, [ticket?.status, canMarkResolved, onPressMarkResolved, styles, t]);

  useEffect(() => {
    navigation.setOptions({ headerRight });
  }, [navigation, headerRight]);

  if (!ticket) {
    return null;
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.container}
    >
      <Text variant="heading" style={styles.title}>
        {ticket.subject}
      </Text>

      <Card rounded spaced={false} style={styles.card}>
        <InfoRow
          icon={faCircle}
          label={t('common.status')}
          value={t(`tickets.status.${getTicketStatusGroup(ticket.status)}`)}
        />
        <InfoRow
          icon={faHashtag}
          label={t('ticketScreen.ticketNumber')}
          value={`${ticket.id}`}
        />
        <InfoRow
          icon={faCalendar}
          label={t('common.createdAt')}
          value={formatDateWithTime(ticket.createdAt)}
        />
        <InfoRow
          icon={faCalendar}
          label={t('common.updatedAt')}
          value={formatDateWithTime(ticket.updatedAt)}
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

const formatDateWithTime = (date: Date) =>
  `${formatDate(date)} - ${dateFormatter('HH:mm')(date)}`;

const createStyles = ({
  spacing,
  fontSizes,
  fontWeights,
  fontFamilies,
  colors,
  palettes,
  shapes,
}: Theme) =>
  StyleSheet.create({
    container: {
      padding: spacing[5],
      gap: spacing[2.5],
    },
    markResolvedButton: {
      justifyContent: 'center',
      paddingVertical: spacing[2],
      paddingHorizontal: spacing[2],
    },
    markResolved: {
      fontFamily: fontFamilies.title,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.medium,
      letterSpacing: 0.16,
      color: palettes.primary[500],
    },
    // eslint-disable-next-line react-native/no-color-literals
    markResolvedDisabled: {
      color: '#90A1B9',
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
    iconWrap: {
      width: fontSizes.xs,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: {
      fontSize: fontSizes.sm,
      lineHeight: 20,
      color: colors.secondaryText,
    },
    value: {
      flex: 1,
      textAlign: 'right',
      fontSize: fontSizes.sm,
      lineHeight: 20,
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
      paddingHorizontal: 20,
      paddingVertical: spacing[3],
    },
    infoMessageIcon: {
      marginTop: spacing[1],
    },
    infoMessageText: {
      flex: 1,
      fontFamily: fontFamilies.title,
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.medium,
      lineHeight: 16,
      color: palettes.info[700],
    },
  });
