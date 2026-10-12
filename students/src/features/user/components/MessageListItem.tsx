import { useTranslation } from 'react-i18next';

import { formatDateTime, getHtmlTextContent } from '@polito/lib/core';
import { useAccessibility } from '@polito/lib/core';
import { ListItem } from '@polito/lib/ui';
import { Message } from '@polito/student-api-client';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useMarkMessageAsRead } from '../../../core/queries/studentHooks';
import { UserStackParamList } from './UserNavigator';

interface Props {
  messageItem: Message;
  index: number;
  totalData: number;
  isSwiping: boolean;
}

export const MessageListItem = ({
  messageItem,
  index,
  totalData,
  isSwiping,
}: Props) => {
  const { t } = useTranslation();
  const { mutate: markAsRead } = useMarkMessageAsRead();
  const { accessibilityListLabel } = useAccessibility();
  const navigation =
    useNavigation<NativeStackNavigationProp<UserStackParamList>>();
  const accessibilityLabel = accessibilityListLabel(index, totalData);
  const title = getHtmlTextContent(messageItem?.title);
  const sentAt = formatDateTime(messageItem.sentAt);

  const onPressItem = () => {
    if (isSwiping) return;

    if (!messageItem.isRead) {
      markAsRead(messageItem.id);
    }
    navigation.navigate('Message', {
      id: messageItem.id,
    });
  };

  return (
    <ListItem
      unread={!messageItem.isRead}
      title={title}
      isAction={true}
      onPress={onPressItem}
      accessibilityLabel={[
        accessibilityLabel,
        title,
        t('messagesScreen.sentAt'),
        sentAt,
      ].join(', ')}
      subtitle={sentAt}
    />
  );
};
