import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { open } from 'react-native-file-viewer';

import {
  type Theme,
  ThemeContext,
  darkTheme,
  useStylesheet,
} from '@polito/lib/ui';
import { TicketAttachment } from '@polito/student-api-client';

import { usePressableFeedback } from '~/core/hooks/usePressableFeedback';

import {
  useGetTicketAttachment,
  useGetTicketReplyAttachment,
} from '../../../core/queries/ticketHooks';
import { AttachmentChip } from './AttachmentChip';

interface TicketAttachmentChipProps {
  attachment: TicketAttachment;
  replyId?: number;
  ticketId: number;
}

export const TicketAttachmentChip = ({
  attachment,
  ticketId,
  replyId,
}: TicketAttachmentChipProps) => {
  const styles = useStylesheet(createStyles);
  const pressableFeedback = usePressableFeedback('opacity');
  const [shouldOpen, setShouldOpen] = useState<boolean>(false);
  const isReply = useMemo(() => replyId !== undefined, [replyId]);

  const { isFetching: isDownloadingReplyAttachment, data: replyAttachment } =
    useGetTicketReplyAttachment(
      {
        replyId: replyId ?? 0,
        ticketId,
        attachmentId: attachment.id,
      },
      attachment.filename,
      isReply && shouldOpen,
    );

  const { isFetching: isDownloadingTicketAttachment, data: ticketAttachment } =
    useGetTicketAttachment(
      {
        ticketId,
        attachmentId: attachment.id,
      },
      attachment.filename,
      !isReply && shouldOpen,
    );

  const onPressAttachment = () => setShouldOpen(true);

  useEffect(() => {
    if (!shouldOpen || !ticketAttachment) return;
    open(ticketAttachment);
    setShouldOpen(false);
  }, [shouldOpen, ticketAttachment]);

  useEffect(() => {
    if (!shouldOpen || !replyAttachment) return;
    open(replyAttachment);
    setShouldOpen(false);
  }, [shouldOpen, replyAttachment]);

  return (
    <ThemeContext.Provider value={darkTheme}>
      <Pressable
        onPress={onPressAttachment}
        android_ripple={pressableFeedback.androidRipple}
        style={pressableFeedback.style(styles.container)}
      >
        <AttachmentChip
          attachment={{
            name: attachment.filename,
            size: attachment.sizeInKiloBytes,
            uri: null,
            type: attachment.mimeType,
          }}
          loading={
            isDownloadingReplyAttachment || isDownloadingTicketAttachment
          }
        />
      </Pressable>
    </ThemeContext.Provider>
  );
};

const createStyles = ({ shapes, spacing }: Theme) =>
  StyleSheet.create({
    container: {
      maxWidth: '100%',
      marginTop: spacing[4],
      // Matches the chip shape, clipping the Android ripple to its corners
      borderRadius: shapes.xl,
      overflow: 'hidden',
    },
  });
