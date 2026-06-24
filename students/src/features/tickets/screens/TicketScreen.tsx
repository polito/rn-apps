import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, FlatList, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import {
  IS_IOS,
  usePreferencesContext,
  useScreenTitle,
} from '@polito/lib/core';
import {
  BottomModal,
  ChatBubble,
  GlobalStyles,
  IconButton,
  RefreshControl,
  Row,
  type Theme,
  useBottomModal,
  useSafeAreaSpacing,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import {
  TicketOverview,
  TicketSpecialAgent,
  TicketStatus,
} from '@polito/student-api-client';
import { MenuView } from '@react-native-menu/menu';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useHeaderHeight } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import { AppPreferences } from '~/core/types/preferences';

import { useConfirmationDialog } from '../../../core/hooks/useConfirmationDialog';
import { useNotifications } from '../../../core/hooks/useNotifications';
import {
  MOCK_TICKET_FEEDBACK,
  MOCK_TICKET_RESOLVE,
  MOCK_TICKET_STAGE,
  useGetTicket,
  useMarkTicketAsClosed,
  useMarkTicketAsRead,
} from '../../../core/queries/ticketHooks';
import { ServiceStackParamList } from '../../services/components/ServicesNavigator';
import { ChatMessage } from '../components/ChatMessage';
import { HtmlMessage } from '../components/HtmlMessage';
import { TicketAttachmentChip } from '../components/TicketAttachmentChip';
import { TicketFeedbackInfo } from '../components/TicketFeedbackInfo';
import { TicketHeader } from '../components/TicketHeader';
import { TicketInfoBottomModal } from '../components/TicketInfoBottomModal';
import { TicketMessagingView } from '../components/TicketMessagingView';
import { TicketRateBar } from '../components/TicketRateBar';
import { TicketResolvePromptBar } from '../components/TicketResolvePromptBar';
import { VirtualOperatorFeedbackBar } from '../components/VirtualOperatorFeedbackBar';

type Props = NativeStackScreenProps<ServiceStackParamList, 'Ticket'>;

const HeaderRight = ({ ticket }: { ticket: TicketOverview }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<ServiceStackParamList, 'Ticket'>>();
  const { colors, fontSizes } = theme;
  const styles = useStylesheet(createStyles);
  const { mutateAsync: markTicketAsClosed, isSuccess } = useMarkTicketAsClosed(
    ticket?.id,
  );
  const confirm = useConfirmationDialog({
    message: t('tickets.closeTip'),
  });

  const actions = useMemo(
    () => [
      {
        title: t('tickets.close'),
        color: 'red',
        image: 'trash.fill',
        imageColor: 'red',
      },
    ],
    [t],
  );

  const onPressCloseTicket = async () => {
    if (await confirm()) {
      return markTicketAsClosed();
    }
    return Promise.reject();
  };

  useEffect(() => {
    if (isSuccess) {
      navigation.navigate('Tickets');
    }
  }, [isSuccess, navigation]);

  return (
    <MenuView
      title={t('tickets.menuAction')}
      actions={actions}
      onPressAction={onPressCloseTicket}
    >
      <IconButton
        style={styles.icon}
        icon={faEllipsisVertical}
        color={colors.secondaryText}
        size={fontSizes.xl}
      />
    </MenuView>
  );
};

export const TicketScreen = ({ route, navigation }: Props) => {
  const { id } = route.params;
  const styles = useStylesheet(createStyles);
  const ticketQuery = useGetTicket(id);
  const { mutate: markAsRead } = useMarkTicketAsRead(id);
  const { spacing, palettes } = useTheme();
  const {
    open: showInfoModal,
    close: closeInfoModal,
    modal: infoModal,
  } = useBottomModal();
  const headerHeight = useHeaderHeight();
  const bottomBarHeight = useBottomTabBarHeight();
  const ticket = ticketQuery.data;
  const { paddingHorizontal } = useSafeAreaSpacing();
  const { clearNotificationScope } = useNotifications();
  const { t } = useTranslation();
  const [styless, setStyless] = useState(styles);
  const { accessibility } = usePreferencesContext<AppPreferences>();
  const { fontSizes } = useTheme();
  const accessibilityMessageText = [
    t('ticketScreen.yourQuestion'),
    ticket?.message,
  ].join(', ');

  useScreenTitle(ticket?.subject);

  const markAsReadIfNeeded = useCallback(async () => {
    if (!ticket) {
      return;
    }
    await clearNotificationScope(['services', 'tickets', ticket.id.toString()]);
    if (!ticket.unreadCount) {
      return;
    }
    markAsRead();
  }, [markAsRead, clearNotificationScope, ticket]);

  useEffect(() => {
    markAsReadIfNeeded();
  }, [markAsReadIfNeeded]);

  const isResolved = useMemo(() => {
    if (!ticket) {
      return false;
    }
    if (MOCK_TICKET_RESOLVE) {
      // TEMP: closed tickets act as resolved unless previewing the 'resolve' step
      return (
        (ticket.status as string) === 'closed' &&
        MOCK_TICKET_STAGE !== 'resolve'
      );
    }
    return ticket.status === TicketStatus.Closed;
  }, [ticket]);

  const feedbackInserted = useMemo(() => {
    if (!isResolved || !ticket) {
      return false;
    }
    if (MOCK_TICKET_RESOLVE) {
      return MOCK_TICKET_STAGE === 'feedback';
    }
    return !!ticket.feedbackProvided;
  }, [isResolved, ticket]);

  const feedback = MOCK_TICKET_RESOLVE
    ? MOCK_TICKET_FEEDBACK
    : ticket?.feedbackProvided;

  const headerRight = useCallback(() => {
    if (!ticket?.status) {
      return null;
    }
    return (
      <Row align="center" gap={1}>
        {!isResolved && <HeaderRight ticket={ticket} />}
        <IconButton
          icon={faCircleQuestion}
          color={palettes.primary[500]}
          size={fontSizes.xl}
          accessibilityLabel={t('ticketScreen.infoModalTitle')}
          onPress={() =>
            showInfoModal(
              <TicketInfoBottomModal
                ticket={ticket}
                onClose={closeInfoModal}
              />,
            )
          }
        />
      </Row>
    );
  }, [
    ticket,
    isResolved,
    palettes,
    fontSizes,
    t,
    showInfoModal,
    closeInfoModal,
  ]);

  useEffect(() => {
    navigation.setOptions({ headerRight });
  }, [navigation, ticket, headerRight]);

  const replies = useMemo(
    () =>
      ticket?.replies.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      ) ?? [],
    [ticket],
  );

  const lastReply = replies[0];

  const canResolve = useMemo(() => {
    if (!ticket || !lastReply || isResolved) {
      return false;
    }
    const isHumanAgentReply =
      lastReply.isFromAgent && lastReply.agentId !== TicketSpecialAgent.AiAgent;
    if (MOCK_TICKET_RESOLVE) {
      // TEMP: force the in-chat resolve CTA on any ticket in the 'resolve' step
      return MOCK_TICKET_STAGE === 'resolve';
    }
    return ticket.status === TicketStatus.Pending && isHumanAgentReply;
  }, [ticket, lastReply, isResolved]);

  const onPressRate = useCallback(() => {
    navigation.navigate('TicketResolved', { ticketId: id });
  }, [navigation, id]);

  const onPressResolve = useCallback(() => {
    if (!lastReply) {
      return;
    }
    Alert.alert(
      t('ticketScreen.resolveConfirmTitle'),
      t('ticketScreen.resolveConfirmMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.confirm'),
          onPress: () =>
            navigation.navigate('TicketResolved', { ticketId: id }),
        },
      ],
      { cancelable: true },
    );
  }, [lastReply, t, navigation, id]);

  useEffect(() => {
    const changeStyle = () => {
      setStyless(prevStyles => ({
        ...prevStyles,
        text: {
          ...prevStyles.text,
          lineHeight: accessibility?.lineHeight
            ? fontSizes.sm * 1.5
            : undefined,
          marginBottom: accessibility?.paragraphSpacing ? fontSizes.sm * 2 : 0,
        },
      }));
    };
    changeStyle();
  }, [accessibility, fontSizes]);

  const keyboard = useAnimatedKeyboard();
  const animatedBottomPadding = useAnimatedStyle(() => ({
    paddingBottom: Math.max(keyboard.height.value, bottomBarHeight),
  }));

  const ItemsSeparator = useCallback(
    () => <View style={styless.separator} />,
    [styless],
  );

  // TODO: traslucent does not work anymore because now views
  // are more linear: it's needed to recalculate layouts and set
  // the flatlist to be absolutely positioned

  return (
    <Animated.View style={[GlobalStyles.grow, animatedBottomPadding]}>
      {!!ticket && <TicketHeader ticket={ticket} />}
      <FlatList
        keyboardShouldPersistTaps="handled"
        inverted
        contentContainerStyle={[
          {
            paddingTop: spacing[5],
            paddingBottom: IS_IOS ? headerHeight + spacing[5] : undefined,
          },
          paddingHorizontal,
        ]}
        refreshControl={<RefreshControl queries={[ticketQuery]} />}
        data={replies}
        keyExtractor={item => item.id.toString()}
        ListFooterComponent={
          !ticketQuery?.isLoading && !!ticket ? (
            <Pressable
              accessibilityRole="text"
              accessibilityLabel={accessibilityMessageText}
            >
              <ChatBubble
                accessibilityRole="text"
                accessibilityLabel={accessibilityMessageText}
                style={styless.requestMessage}
              >
                <HtmlMessage
                  message={ticket?.message}
                  baseStyle={styless.text}
                />
                {ticket.hasAttachments && (
                  <View>
                    {ticket.attachments.map((item, index) => (
                      <TicketAttachmentChip
                        key={index}
                        attachment={item}
                        ticketId={ticket.id}
                      />
                    ))}
                  </View>
                )}
              </ChatBubble>
            </Pressable>
          ) : undefined
        }
        renderItem={({ item: reply }) => (
          <ChatMessage
            message={reply}
            ticketId={ticket!.id}
            received={!!reply?.isFromAgent}
          />
        )}
        ItemSeparatorComponent={ItemsSeparator}
      />
      {feedbackInserted && feedback ? (
        <TicketFeedbackInfo
          rating={feedback.rating}
          comment={
            MOCK_TICKET_RESOLVE ? MOCK_TICKET_FEEDBACK.comment : undefined
          }
          createdAt={feedback.createdAt}
        />
      ) : lastReply?.needsFeedback ? (
        <VirtualOperatorFeedbackBar ticketId={id} replyId={lastReply.id} />
      ) : isResolved ? (
        <TicketRateBar onPress={onPressRate} />
      ) : canResolve ? (
        <TicketResolvePromptBar onPress={onPressResolve} />
      ) : (
        <TicketMessagingView ticketId={id} />
      )}
      <BottomModal {...infoModal} />
    </Animated.View>
  );
};

const createStyles = ({ spacing, fontSizes, colors }: Theme) =>
  StyleSheet.create({
    separator: {
      height: spacing[3],
    },
    requestMessage: {
      marginHorizontal: spacing[5],
      marginVertical: spacing[3],
    },
    icon: {
      marginRight: -spacing[3],
    },
    text: {
      padding: 0,
      fontSize: fontSizes.sm,
      color: colors.white,
      textDecorationColor: colors.white,
    },
  });
