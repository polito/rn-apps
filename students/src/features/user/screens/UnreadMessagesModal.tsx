import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  faCheckCircle,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { useScreenReader } from '@polito/lib';
import { CtaButton } from '@polito/lib';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useHideTabs } from '../../../core/hooks/useHideTabs';
import {
  useGetModalMessages,
  useInvalidateMessages,
  useMarkMessageAsRead,
} from '../../../core/queries/studentHooks';
import { MessageScreenContent } from '../components/MessageScreenContent';

type Props = NativeStackScreenProps<any, 'MessagesModal'>;

export const UnreadMessagesModal = ({ navigation }: Props) => {
  const { data: messages } = useGetModalMessages();

  const invalidateMessages = useInvalidateMessages();
  const { t } = useTranslation();
  const [messagesReadCount, setMessageReadCount] = useState(0);
  const messagesToReadCount = messages?.length || 0;
  const isLastMessageToRead = messagesReadCount + 1 === messagesToReadCount;
  const { mutate } = useMarkMessageAsRead(false);
  const { isScreenReaderEnabled, announce } = useScreenReader();

  const { bottom } = useSafeAreaInsets();

  useEffect(() => {
    if (!messagesToReadCount) {
      navigation.goBack();
    }
  }, [messagesToReadCount, navigation]);

  useEffect(() => {
    isScreenReaderEnabled().then(isEnabled => {
      if (!isEnabled) return;
      announce(
        t('messagesScreen.youHaveUnreadMessages', {
          total: messagesToReadCount,
        }),
      );
    });
  }, [announce, isScreenReaderEnabled, t, messagesToReadCount]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: t('messagesScreen.unreadMessages', {
        read: messagesReadCount + 1,
        total: messagesToReadCount,
      }),
    });
  }, [t, messagesReadCount, navigation, messagesToReadCount]);

  useHideTabs(undefined, () => invalidateMessages.run());

  const currentMessage = messages?.[messagesReadCount];

  const onConfirm = async () => {
    if (currentMessage) {
      await new Promise(ok => mutate(currentMessage.id, { onSettled: ok }));
    }
    if (isLastMessageToRead) {
      navigation.goBack();
    } else {
      setMessageReadCount(m => m + 1);
    }
  };

  return (
    <>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {currentMessage && (
          <MessageScreenContent message={currentMessage} modal />
        )}
      </ScrollView>
      <View
        style={{
          paddingVertical: bottom,
        }}
      >
        <CtaButton
          absolute={false}
          title={t(
            isLastMessageToRead
              ? 'messagesScreen.end'
              : 'messagesScreen.readNext',
          )}
          action={onConfirm}
          icon={isLastMessageToRead ? faCheckCircle : faChevronRight}
        />
      </View>
    </>
  );
};
