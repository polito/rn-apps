import { useTranslation } from 'react-i18next';
import { Platform, Pressable, StyleSheet } from 'react-native';

import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { formatDate, formatDateTime } from '@polito/lib/core';
import {
  ActivityIndicator,
  Card,
  Col,
  GlobalStyles,
  Icon,
  Metric,
  Row,
  Text,
  type Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { TicketOverview, TicketStatus } from '@polito/student-api-client';

interface TicketStatusProps {
  ticket: TicketOverview;
  loading?: boolean;
  refetching?: boolean;
}

export const TicketStatusInfo = ({
  ticket,
  loading,
  refetching,
}: TicketStatusProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const isClosed = ticket.status === TicketStatus.Closed;

  const accessibilityIdText = [t('ticketScreen.ticketNumber'), ticket?.id].join(
    ', ',
  );
  const accessibilityCreatedAtText = [
    t('common.createdAt'),
    formatDate(ticket.createdAt),
  ].join(', ');
  const accessibilityStatusText = [
    t('common.status'),
    t(`tickets.status.${ticket.status}`),
  ].join(', ');
  const accessibilityUpdatedAtText = [
    t('common.updatedAt'),
    formatDateTime(ticket.updatedAt),
  ].join(', ');

  if (loading) {
    return (
      <Col>
        <ActivityIndicator />
      </Col>
    );
  }

  return (
    <Card style={styles.card}>
      <Text variant="title" style={styles.row}>
        {ticket.subject}
      </Text>
      <Row style={styles.row}>
        <Pressable
          accessibilityLabel={accessibilityIdText}
          style={GlobalStyles.grow}
        >
          <Metric
            accessibilityLabel={accessibilityIdText}
            title={t('ticketScreen.ticketNumber')}
            value={ticket.id}
          />
        </Pressable>
        <Pressable
          accessibilityLabel={accessibilityCreatedAtText}
          style={GlobalStyles.grow}
        >
          <Metric
            accessibilityLabel={accessibilityCreatedAtText}
            title={t('common.createdAt')}
            value={formatDate(ticket.createdAt)}
          />
        </Pressable>
      </Row>
      <Row style={styles.row}>
        <Pressable
          accessibilityLabel={accessibilityUpdatedAtText}
          style={GlobalStyles.grow}
        >
          <Metric
            accessibilityLabel={accessibilityUpdatedAtText}
            title={t('common.updatedAt')}
            value={formatDateTime(ticket.updatedAt)}
          />
        </Pressable>
        <Pressable
          accessibilityLabel={accessibilityStatusText}
          style={GlobalStyles.grow}
        >
          <Metric
            accessibilityLabel={accessibilityStatusText}
            title={t('common.status')}
            value={t(`tickets.status.${ticket.status}`)}
            valueStyle={{ textTransform: 'uppercase' }}
          />
        </Pressable>
        {/* TODO colors? */}
      </Row>
      {refetching ? (
        <ActivityIndicator />
      ) : (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
          {isClosed && (
            <Row>
              <Icon
                icon={faInfoCircle}
                color={colors.secondaryText}
                style={styles.infoIcon}
              />
              <Text variant="secondaryText" style={GlobalStyles.grow}>
                {t('ticketScreen.youCanReopenTheTicket')}
              </Text>
            </Row>
          )}
        </>
      )}
    </Card>
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    infoIcon: {
      marginTop: spacing[0.5],
      marginRight: spacing[2],
    },
    card: {
      marginHorizontal: Platform.select({ ios: spacing[3] }),
      marginVertical: Platform.select({ ios: spacing[3] }),
      padding: spacing[4],
    },
    row: {
      marginBottom: spacing[4],
    },
  });
