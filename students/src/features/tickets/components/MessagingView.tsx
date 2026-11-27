import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, StyleSheet, View, ViewProps } from 'react-native';

import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
import {
  Col,
  IconButton,
  Row,
  type Theme,
  TranslucentTextField,
  TranslucentView,
  useStylesheet,
} from '@polito/lib/ui';

import { Attachment } from '../../services/types/Attachment';
import { AttachmentChip } from './AttachmentChip';
import { AttachmentMenu } from './AttachmentMenu';

interface Props extends ViewProps {
  message?: string;
  onMessageChange?: (message: string) => void;
  onSend?: () => void;
  attachment?: Attachment;
  onAttachmentChange: (attachment?: Attachment) => void;
  loading?: boolean;
  disabled?: boolean;
  showSendButton?: boolean;
  translucent?: boolean;
  numberOfLines?: number;
  textFieldStyle?: ViewProps['style'];
}

export const MessagingView = ({
  message,
  onMessageChange,
  onSend,
  attachment,
  onAttachmentChange,
  loading = false,
  disabled = false,
  showSendButton = true,
  translucent = true,
  numberOfLines = 1,
  textFieldStyle,
  ...props
}: Props) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);

  const replayAccessibilityLabel = useMemo(() => {
    const baseText = t('ticketScreen.reply');
    if (!disabled) {
      return [baseText, t('messagingView.activeReplay')].join(', ');
    } else {
      return [baseText, t('common.disabledPreviousValue')].join(', ');
    }
  }, [disabled, t]);

  return (
    <View
      {...props}
      style={[styles.wrapper, translucent && styles.translucent, props.style]}
    >
      {translucent && <TranslucentView fallbackOpacity={1} />}
      <Col>
        {!!attachment && (
          <AttachmentChip
            attachment={attachment}
            onClearAttachment={() => onAttachmentChange(undefined)}
            style={styles.attachmentContainer}
          />
        )}
        <Row align="flex-end">
          <Pressable
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={t('messagingView.pickFile')}
            accessibilityState={{ disabled }}
          >
            <AttachmentMenu
              disabled={disabled}
              onAttachmentChange={onAttachmentChange}
            >
              <IconButton
                accessibilityRole="button"
                accessibilityLabel={t('messagingView.pickFile')}
                icon={faPaperclip}
                size={22}
                style={styles.actionButton}
                disabled={disabled}
              />
            </AttachmentMenu>
          </Pressable>
          <TranslucentTextField
            label={
              showSendButton
                ? t('ticketScreen.reply')
                : t('ticketScreen.sendFirstMessage')
            }
            accessibilityLabel={replayAccessibilityLabel}
            value={message}
            autoCapitalize="sentences"
            onChangeText={onMessageChange}
            multiline
            editable={!disabled}
            containerStyle={{ flex: 1 }}
            style={[{ maxHeight: 220 }, { flexGrow: 1 }, textFieldStyle]}
            numberOfLines={numberOfLines}
          />
          {showSendButton && (
            <IconButton
              accessibilityRole="button"
              accessibilityLabel={t('ticketScreen.send')}
              disabled={!message?.length || loading}
              onPress={onSend}
              icon={faPaperPlane}
              size={22}
              loading={loading}
              style={styles.actionButton}
            />
          )}
        </Row>
      </Col>
    </View>
  );
};

const createStyles = ({ spacing, colors, safeAreaInsets }: Theme) =>
  StyleSheet.create({
    wrapper: {
      paddingVertical: spacing[2],
      paddingLeft: Math.max(safeAreaInsets.left, spacing[2]),
      paddingRight: Math.max(safeAreaInsets.right, spacing[2]),
    },
    translucent: {
      borderColor: colors.divider,
      borderTopWidth: StyleSheet.hairlineWidth,
    },
    attachmentContainer: {
      marginLeft: spacing[10],
      marginRight: spacing[2],
      marginBottom: spacing[2],
    },
    actionButton: {
      opacity: Platform.select({ ios: 0.8 }),
      padding: spacing[2.5],
    },
  });
