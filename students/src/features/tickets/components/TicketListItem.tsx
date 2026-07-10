import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { faStar } from '@fortawesome/free-regular-svg-icons';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
import {
  formatDate,
  getHtmlTextContent,
  useOfflineDisabled,
} from '@polito/lib/core';
import {
  DisclosureIndicator,
  Icon,
  ListItem,
  type ListItemProps,
  Row,
  Text,
  type Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { TicketOverview } from '@polito/student-api-client';
import { useQueryClient } from '@tanstack/react-query';

import { TICKET_QUERY_PREFIX } from '../../../core/queries/ticketHooks';
import { TicketStatusBadge } from './TicketStatusBadge';

interface TicketListItemProps extends Partial<ListItemProps> {
  ticket: TicketOverview;
}

export const TicketListItem = ({
  ticket,
  unread,
  ...props
}: TicketListItemProps) => {
  const { fontSizes, palettes } = useTheme();
  const styles = useStylesheet(createStyles);
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const isDataMissing = useCallback(
    () =>
      queryClient.getQueryData([TICKET_QUERY_PREFIX, ticket.id]) === undefined,
    [ticket, queryClient],
  );
  const isDisabled = useOfflineDisabled(isDataMissing);

  return (
    <ListItem
      {...props}
      accessibilityRole="button"
      accessible={true}
      linkTo={{
        screen: 'Ticket',
        params: { id: ticket.id },
      }}
      disabled={isDisabled}
      unread={unread || ticket.unreadCount > 0}
      title={getHtmlTextContent(ticket?.subject)}
      subtitle={
        ticket.needsFeedback ? (
          <Row align="center" gap={1.5}>
            <Icon
              icon={faStar}
              size={fontSizes.sm}
              color={palettes.orange[600]}
            />
            <Text style={styles.feedbackHint}>
              {t('ticketsScreen.insertFeedback')}
            </Text>
          </Row>
        ) : (
          t('ticketsScreen.openedOn', {
            date: formatDate(ticket.createdAt),
            interpolation: { escapeValue: false },
          })
        )
      }
      trailingItem={
        <Row align="center" gap={1}>
          {ticket?.hasAttachments && (
            <Icon icon={faPaperclip} size={20} color={palettes.text[400]} />
          )}
          <TicketStatusBadge status={ticket.status} />
          <DisclosureIndicator />
        </Row>
      }
    />
  );
};

const createStyles = ({ fontSizes, fontWeights, palettes }: Theme) =>
  StyleSheet.create({
    feedbackHint: {
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
      color: palettes.orange[600],
    },
  });
