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

import {
  TICKET_QUERY_PREFIX,
  getTicketStatusGroup,
} from '../../../core/queries/ticketHooks';
import { TicketStatusBadge } from './TicketStatusBadge';

interface TicketListItemProps extends Partial<ListItemProps> {
  ticket: TicketOverview;
}

export const TicketListItem = ({
  ticket,
  unread,
  ...props
}: TicketListItemProps) => {
  const { palettes } = useTheme();
  const styles = useStylesheet(createStyles);
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const isDataMissing = useCallback(
    () =>
      queryClient.getQueryData([TICKET_QUERY_PREFIX, ticket.id]) === undefined,
    [ticket, queryClient],
  );
  const isDisabled = useOfflineDisabled(isDataMissing);
  const subject = getHtmlTextContent(ticket?.subject);
  const statusLabel = t(
    `tickets.status.${getTicketStatusGroup(ticket.status)}`,
  );
  const subtitleLabel = ticket.needsFeedback
    ? t('ticketsScreen.insertFeedback')
    : t('ticketsScreen.openedOn', {
        date: formatDate(ticket.createdAt),
        interpolation: { escapeValue: false },
      });
  const accessibilityLabel = [
    typeof props.accessibilityLabel === 'string'
      ? props.accessibilityLabel
      : null,
    statusLabel,
    subtitleLabel,
    unread || ticket.unreadCount > 0 ? t('common.unread') : null,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <ListItem
      {...props}
      accessibilityRole="button"
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      linkTo={{
        screen: 'Ticket',
        params: { id: ticket.id },
      }}
      disabled={isDisabled}
      unread={unread || ticket.unreadCount > 0}
      title={subject}
      subtitle={
        ticket.needsFeedback ? (
          <Row align="center" gap={1} style={styles.feedbackTag}>
            <Icon icon={faStar} size={16} color={palettes.darkOrange[600]} />
            <Text style={styles.feedbackTagText}>
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

const createStyles = ({
  fontFamilies,
  fontSizes,
  fontWeights,
  palettes,
}: Theme) =>
  StyleSheet.create({
    feedbackTag: {
      alignSelf: 'flex-start',
      backgroundColor: palettes.darkOrange[50],
      borderRadius: 6,
      paddingHorizontal: 5,
    },
    feedbackTagText: {
      fontFamily: fontFamilies.title,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
      color: palettes.darkOrange[600],
    },
  });
