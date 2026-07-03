import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import ContextMenu from 'react-native-context-menu-view';

import { faComments } from '@fortawesome/free-regular-svg-icons';
import {
  faChevronRight,
  faEllipsisVertical,
  faPaperclip,
} from '@fortawesome/free-solid-svg-icons';
import {
  IS_IOS,
  formatDateTime,
  getHtmlTextContent,
  useOfflineDisabled,
} from '@polito/lib/core';
import {
  Col,
  Icon,
  IconButton,
  ListItem,
  type ListItemProps,
  Row,
  Text,
  type Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { TicketOverview, TicketStatus } from '@polito/student-api-client';
import { useQueryClient } from '@tanstack/react-query';

import { hideFromScreenReader } from '../../../core/accessibility/hideFromScreenReader';
import { useAccessibility } from '../../../core/hooks/useAccessibilty';
import { useConfirmationDialog } from '../../../core/hooks/useConfirmationDialog';
import {
  TICKET_QUERY_PREFIX,
  useMarkTicketAsClosed,
} from '../../../core/queries/ticketHooks';

interface TicketListItemProps extends Partial<ListItemProps> {
  ticket: TicketOverview;
  index: number;
  total: number;
}

export const TicketListItem = ({
  ticket,
  index,
  total,
  ...props
}: TicketListItemProps) => {
  const { fontSizes, colors, palettes, spacing, dark } = useTheme();
  const styles = useStylesheet(createStyles);
  const { t } = useTranslation();
  const { buildCompositeListLabel } = useAccessibility();
  const { mutateAsync: markTicketAsClosed } = useMarkTicketAsClosed(ticket?.id);
  const confirm = useConfirmationDialog({
    message: t('tickets.closeTip'),
  });

  const markTicketAsClosedEnabled = ticket?.status !== TicketStatus.Closed;
  const queryClient = useQueryClient();

  const isDataMissing = useCallback(
    () =>
      queryClient.getQueryData([TICKET_QUERY_PREFIX, ticket.id]) === undefined,
    [ticket, queryClient],
  );
  const isDisabled = useOfflineDisabled(isDataMissing);

  const actions = useMemo(() => {
    if (markTicketAsClosedEnabled) {
      return [
        {
          title: t('tickets.close'),
          titleColor: dark ? colors.white : colors.black,
          iconColor: 'red',
          systemIcon: 'trash.fill',
        },
      ];
    }
    return [];
  }, [markTicketAsClosedEnabled, t, dark, colors]);

  const UnReadCount = useCallback(
    () => (
      <Col
        justify="center"
        align="center"
        style={styles.unreadCount}
        {...hideFromScreenReader}
      >
        <Text style={styles.unreadCountText}>{ticket?.unreadCount || 0}</Text>
      </Col>
    ),
    [styles, ticket],
  );

  const onPressCloseTicket = useCallback(async () => {
    if (await confirm()) {
      return markTicketAsClosed();
    }
    return Promise.reject();
  }, [confirm, markTicketAsClosed]);

  const ticketSubject = getHtmlTextContent(ticket?.subject);
  const ticketDate = formatDateTime(ticket.updatedAt);
  const ticketAccessibilityLabel = useMemo(
    () =>
      buildCompositeListLabel(
        [
          ticketSubject,
          ticketDate,
          ticket.unreadCount > 0
            ? t('ticketsScreen.unreadCount', { count: ticket.unreadCount })
            : undefined,
        ],
        index,
        total,
      ),
    [
      ticketSubject,
      ticketDate,
      ticket.unreadCount,
      index,
      total,
      t,
      buildCompositeListLabel,
    ],
  );

  const handleAccessibilityAction = useCallback(
    ({ nativeEvent }: { nativeEvent: { actionName: string } }) => {
      if (nativeEvent.actionName === 'close') {
        onPressCloseTicket();
      }
    },
    [onPressCloseTicket],
  );

  const Item = useCallback(
    () => (
      <ListItem
        {...props}
        accessibilityRole="button"
        accessible={true}
        accessibilityLabel={ticketAccessibilityLabel}
        accessibilityHint={t('common.tapToNavigate')}
        accessibilityState={{ disabled: isDisabled }}
        accessibilityActions={
          markTicketAsClosedEnabled
            ? [{ name: 'close', label: t('tickets.close') }]
            : undefined
        }
        onAccessibilityAction={handleAccessibilityAction}
        linkTo={{
          screen: 'Ticket',
          params: { id: ticket.id },
        }}
        disabled={isDisabled}
        title={ticketSubject}
        subtitle={`${ticketDate} - ${getHtmlTextContent(ticket?.message)}`}
        subtitleStyle={styles.listItemSubtitle}
        leadingItem={
          <View {...hideFromScreenReader}>
            <Icon icon={faComments} size={20} />
          </View>
        }
        trailingItem={
          <Row align="center">
            {ticket?.hasAttachments && (
              <View
                {...hideFromScreenReader}
                style={
                  ticket.unreadCount === 0
                    ? { marginHorizontal: spacing[2] }
                    : undefined
                }
              >
                <Icon icon={faPaperclip} size={20} color={palettes.text[400]} />
              </View>
            )}
            {ticket.unreadCount > 0 && <UnReadCount />}
            {IS_IOS && (
              <View {...hideFromScreenReader} style={styles.icon}>
                <Icon icon={faChevronRight} color={colors.secondaryText} />
              </View>
            )}
            {!IS_IOS && markTicketAsClosedEnabled && (
              <ContextMenu
                title={t('tickets.menuAction')}
                actions={actions}
                onPress={onPressCloseTicket}
                dropdownMenuMode
              >
                <View {...hideFromScreenReader}>
                  <IconButton
                    style={styles.icon}
                    icon={faEllipsisVertical}
                    color={colors.secondaryText}
                    size={fontSizes.xl}
                  />
                </View>
              </ContextMenu>
            )}
          </Row>
        }
      />
    ),
    [
      props,
      ticket,
      isDisabled,
      ticketSubject,
      ticketDate,
      ticketAccessibilityLabel,
      markTicketAsClosedEnabled,
      handleAccessibilityAction,
      styles,
      palettes,
      spacing,
      colors,
      fontSizes,
      UnReadCount,
      actions,
      onPressCloseTicket,
      t,
    ],
  );

  if (IS_IOS) {
    return (
      <ContextMenu
        title={t('tickets.menuAction')}
        actions={actions}
        onPress={actions.length > 0 ? onPressCloseTicket : undefined}
      >
        <Item />
      </ContextMenu>
    );
  }

  return <Item />;
};

const createStyles = ({ spacing, fontSizes, palettes }: Theme) =>
  StyleSheet.create({
    unreadCount: {
      height: 22,
      width: 22,
      marginHorizontal: spacing[2],
      borderRadius: 22 / 2,
      backgroundColor: palettes.error[500],
    },
    // Theme-independent hardcoded color
    // eslint-disable-next-line react-native/no-color-literals
    unreadCountText: { color: 'white' },
    listItemSubtitle: {
      fontSize: fontSizes.xs,
    },
    icon: {
      marginRight: -spacing[1],
    },
  });
