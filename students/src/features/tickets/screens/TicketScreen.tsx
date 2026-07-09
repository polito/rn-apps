import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { usePreferencesContext } from '@polito/lib/core';
import {
  ChatBubble,
  GlobalStyles,
  RefreshControl,
  Text,
  type Theme,
  useSafeAreaSpacing,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { TicketStatus } from '@polito/student-api-client';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppPreferences } from '~/core/types/preferences';

import { useNotifications } from '../../../core/hooks/useNotifications';
import {
  isResolvedTicketStatus,
  useGetTicket,
  useMarkTicketAsClosed,
  useMarkTicketAsRead,
} from '../../../core/queries/ticketHooks';
import { ServiceStackParamList } from '../../services/components/ServicesNavigator';
import { ChatMessage } from '../components/ChatMessage';
import { HtmlMessage } from '../components/HtmlMessage';
import { TicketAttachmentChip } from '../components/TicketAttachmentChip';
import { TicketAutoresolvedBar } from '../components/TicketAutoresolvedBar';
import { TicketDuplicateBar } from '../components/TicketDuplicateBar';
import { TicketFeedbackInfo } from '../components/TicketFeedbackInfo';
import { TicketHeader } from '../components/TicketHeader';
import { TicketMessagingView } from '../components/TicketMessagingView';
import { TicketRateBar } from '../components/TicketRateBar';
import { TicketWaitingOperatorBar } from '../components/TicketWaitingOperatorBar';
import { VirtualOperatorFeedbackBar } from '../components/VirtualOperatorFeedbackBar';

type Props = NativeStackScreenProps<ServiceStackParamList, 'Ticket'>;

export const TicketScreen = ({ route, navigation }: Props) => {
  const { id } = route.params;
  const styles = useStylesheet(createStyles);
  const ticketQuery = useGetTicket(id);
  const { mutate: markAsRead } = useMarkTicketAsRead(id);
  const { mutateAsync: markTicketAsClosed } = useMarkTicketAsClosed(id);
  const { spacing } = useTheme();
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

  const isAutoResolved = useMemo(
    () => ticket?.status === TicketStatus.Autoresolved,
    [ticket],
  );

  const isDuplicate = useMemo(
    () => ticket?.status === TicketStatus.Duplicate,
    [ticket],
  );

  const isResolved = useMemo(
    () => isResolvedTicketStatus(ticket?.status),
    [ticket?.status],
  );

  const feedback = ticket?.providedFeedback;

  const feedbackInserted = useMemo(() => {
    if ((!isResolved && !isAutoResolved) || !ticket) {
      return false;
    }
    return !!feedback;
  }, [isResolved, isAutoResolved, ticket, feedback]);
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
  }, [t, navigation, id, markTicketAsClosed]);

  const onPressGoToLinkedTicket = useCallback(() => {
    if (ticket?.duplicateId != null) {
      navigation.push('Ticket', { id: ticket.duplicateId });
    }
  }, [navigation, ticket]);

  const onVirtualOperatorAccepted = useCallback(() => {
    navigation.replace('TicketAutoResolved', { ticketId: id });
  }, [navigation, id]);

  const replies = useMemo(
    () =>
      [...(ticket?.replies ?? [])].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      ),
    [ticket?.replies],
  );

  const replyNeedingFeedback = useMemo(
    () =>
      [...(ticket?.replies ?? [])]
        .filter(reply => reply.needsFeedback === true)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0],
    [ticket?.replies],
  );

  const showVirtualOperatorFeedback = useMemo(() => {
    if (
      !ticket ||
      isAutoResolved ||
      isDuplicate ||
      isResolved ||
      feedbackInserted
    ) {
      return false;
    }
    return replyNeedingFeedback != null;
  }, [
    ticket,
    isAutoResolved,
    isDuplicate,
    isResolved,
    feedbackInserted,
    replyNeedingFeedback,
  ]);

  const showResolvedRateBar = useMemo(
    () => isResolved && !feedbackInserted && ticket?.needsFeedback === true,
    [isResolved, feedbackInserted, ticket?.needsFeedback],
  );

  const showAutoresolvedRateBar = useMemo(
    () => isAutoResolved && !feedbackInserted,
    [isAutoResolved, feedbackInserted],
  );

  const isWaitingForOperator = useMemo(() => {
    if (
      !ticket ||
      isAutoResolved ||
      isDuplicate ||
      isResolved ||
      feedbackInserted ||
      showVirtualOperatorFeedback
    ) {
      return false;
    }
    if (ticket.status !== TicketStatus.Pending) {
      return false;
    }
    return (ticket.replies ?? []).some(reply => reply.isFromAgent);
  }, [
    ticket,
    isAutoResolved,
    isDuplicate,
    isResolved,
    feedbackInserted,
    showVirtualOperatorFeedback,
  ]);

  const isMessagingDisabled = useMemo(
    () =>
      (isResolved && !showResolvedRateBar) ||
      (isAutoResolved && !showAutoresolvedRateBar) ||
      isDuplicate ||
      feedbackInserted ||
      isWaitingForOperator ||
      showVirtualOperatorFeedback,
    [
      isResolved,
      showResolvedRateBar,
      isAutoResolved,
      showAutoresolvedRateBar,
      isDuplicate,
      feedbackInserted,
      isWaitingForOperator,
      showVirtualOperatorFeedback,
    ],
  );

  const headerRight = useCallback(() => {
    if (!ticket?.status) {
      return null;
    }
    const disabled =
      isResolved ||
      isAutoResolved ||
      isWaitingForOperator ||
      showVirtualOperatorFeedback;
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
  }, [
    ticket,
    isResolved,
    isAutoResolved,
    isWaitingForOperator,
    showVirtualOperatorFeedback,
    onPressMarkResolved,
    styles,
    t,
  ]);

  useEffect(() => {
    navigation.setOptions({ headerRight });
  }, [navigation, ticket, headerRight]);

  const onPressRate = useCallback(() => {
    navigation.navigate('TicketResolved', { ticketId: id });
  }, [navigation, id]);

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

  const bottomBarMode = useMemo(() => {
    if (isDuplicate) {
      return 'duplicate';
    }
    if (feedbackInserted && feedback) {
      return 'feedback';
    }
    if (showVirtualOperatorFeedback) {
      return 'vo-feedback';
    }
    if (isWaitingForOperator) {
      return 'waiting';
    }
    if (isAutoResolved && showAutoresolvedRateBar) {
      return 'autoresolved';
    }
    if (showResolvedRateBar) {
      return 'resolved';
    }
    return 'messaging';
  }, [
    isDuplicate,
    feedbackInserted,
    feedback,
    showVirtualOperatorFeedback,
    isWaitingForOperator,
    isAutoResolved,
    showAutoresolvedRateBar,
    showResolvedRateBar,
  ]);

  // TODO: traslucent does not work anymore because now views
  // are more linear: it's needed to recalculate layouts and set
  // the flatlist to be absolutely positioned

  return (
    <Animated.View style={[GlobalStyles.grow, animatedBottomPadding]}>
      {!!ticket && (
        <TicketHeader
          ticket={ticket}
          onPress={() => navigation.navigate('TicketInfo', { id })}
        />
      )}
      <FlatList
        keyboardShouldPersistTaps="handled"
        inverted
        removeClippedSubviews={Platform.OS !== 'android'}
        contentContainerStyle={[
          {
            paddingTop: spacing[5],
            paddingBottom: spacing[5],
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
                    {(ticket.attachments ?? []).map((item, index) => (
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
      <View key={bottomBarMode}>
        {isDuplicate ? (
          <TicketDuplicateBar onPress={onPressGoToLinkedTicket} />
        ) : feedbackInserted && feedback ? (
          <TicketFeedbackInfo
            rating={feedback.rating}
            createdAt={feedback.createdAt}
          />
        ) : showVirtualOperatorFeedback ? (
          <VirtualOperatorFeedbackBar
            ticketId={id}
            replyId={replyNeedingFeedback!.id}
            onAccepted={onVirtualOperatorAccepted}
          />
        ) : isWaitingForOperator ? (
          <TicketWaitingOperatorBar />
        ) : showAutoresolvedRateBar ? (
          <TicketAutoresolvedBar onPress={onPressRate} />
        ) : showResolvedRateBar ? (
          <TicketRateBar onPress={onPressRate} />
        ) : isMessagingDisabled ? null : (
          <TicketMessagingView ticketId={id} />
        )}
      </View>
    </Animated.View>
  );
};

const createStyles = ({
  spacing,
  fontSizes,
  fontWeights,
  fontFamilies,
  colors,
  palettes,
}: Theme) =>
  StyleSheet.create({
    separator: {
      height: spacing[3],
    },
    requestMessage: {
      marginHorizontal: spacing[5],
      marginVertical: spacing[3],
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
    text: {
      padding: 0,
      fontSize: fontSizes.sm,
      color: colors.white,
      textDecorationColor: colors.white,
    },
  });
