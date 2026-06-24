import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { formatDate, formatDateTime } from '@polito/lib/core';
import {
  Col,
  Metric,
  ModalContent,
  Row,
  type Theme,
  useStylesheet,
} from '@polito/lib/ui';
import { TicketOverview } from '@polito/student-api-client';

interface TicketInfoBottomModalProps {
  ticket: TicketOverview;
  onClose: () => void;
}

export const TicketInfoBottomModal = ({
  ticket,
  onClose,
}: TicketInfoBottomModalProps) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);

  return (
    <ModalContent title={t('ticketScreen.infoModalTitle')} close={onClose}>
      <Col ph={4} pt={2} pb={8} gap={5}>
        <Row gap={4}>
          <Metric
            title={t('ticketScreen.ticketNumber')}
            value={ticket.id}
            style={styles.metric}
          />
          <Metric
            title={t('common.createdAt')}
            value={formatDate(ticket.createdAt)}
            style={styles.metric}
          />
        </Row>
        <Row gap={4}>
          <Metric
            title={t('common.updatedAt')}
            value={formatDateTime(ticket.updatedAt)}
            style={styles.metric}
          />
          <Metric
            title={t('common.status')}
            value={t(`tickets.status.${ticket.status}`)}
            valueStyle={styles.statusValue}
            style={styles.metric}
          />
        </Row>
      </Col>
    </ModalContent>
  );
};

const createStyles = (_: Theme) =>
  StyleSheet.create({
    metric: {
      flex: 1,
    },
    statusValue: {
      textTransform: 'uppercase',
    },
  });
