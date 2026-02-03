import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { TicketReply } from '@polito/api-client/models/TicketReply';
import { ChatBubble } from '@polito/lib';
import { Text } from '@polito/lib';
import { useStylesheet } from '@polito/lib';
import { Theme } from '@polito/lib';

import { HtmlMessage } from './HtmlMessage';
import { TicketAttachmentChip } from './TicketAttachmentChip';

interface ChatMessageProps {
  received: boolean;
  message: TicketReply;
  ticketId: number;
}

export const ChatMessage = ({
  received,
  message,
  ticketId,
}: ChatMessageProps) => {
  const styles = useStylesheet(createStyles);
  const { t } = useTranslation();

  const messageFirstPart = !message.agentId
    ? t('ticketScreen.incomingMessage')
    : [t('ticketScreen.outgoingMessage'), message.agentId].join(', ');
  const accessibilityMessageText = [messageFirstPart, message.message].join(
    ', ',
  );

  const Attachments = useCallback(
    () =>
      message.attachments?.length ? (
        <View style={styles.attachmentContainer}>
          {message.attachments.map((item, index) => {
            return (
              <TicketAttachmentChip
                key={index}
                attachment={item}
                ticketId={ticketId}
                replyId={message.id}
              />
            );
          })}
        </View>
      ) : null,
    [styles, message, ticketId],
  );

  return (
    <Pressable
      accessibilityRole="text"
      accessibilityLabel={accessibilityMessageText}
    >
      <ChatBubble
        accessibilityRole="text"
        accessibilityLabel={accessibilityMessageText}
        direction={received ? 'incoming' : 'outgoing'}
        time={message.createdAt}
        style={styles.bubbleContainer}
      >
        {message.agentId && (
          <Text style={styles.agentText}>
            {t('common.agent')} {message.agentId}
          </Text>
        )}
        <HtmlMessage
          message={message.message?.trim() ?? ''}
          baseStyle={styles.text}
        />
        <Attachments />
      </ChatBubble>
    </Pressable>
  );
};

const createStyles = ({ fontWeights, spacing, fontSizes, colors }: Theme) =>
  StyleSheet.create({
    // Theme-independent hardcoded color
    // eslint-disable-next-line react-native/no-color-literals
    agentText: {
      color: 'white',
      fontWeight: fontWeights.semibold,
      marginBottom: spacing[2],
    },
    attachmentContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    bubbleContainer: {
      marginHorizontal: spacing[5],
    },
    text: {
      padding: 0,
      fontSize: fontSizes.sm,
      color: colors.white,
      textDecorationColor: colors.white,
    },
  });
