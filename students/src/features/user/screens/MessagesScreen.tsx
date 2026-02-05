import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView } from 'react-native';

import {
  BottomBarSpacer,
  OverviewList,
  RefreshControl,
  Section,
  useTheme,
} from '@polito/lib/ui';

import { useGetMessages } from '../../../core/queries/studentHooks';
import { MessageListItem } from '../components/MessageListItem';

export const MessagesScreen = () => {
  const { spacing } = useTheme();
  const messagesQuery = useGetMessages();

  const { isLoading, data: messages } = messagesQuery;
  const { t } = useTranslation();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={<RefreshControl queries={[messagesQuery]} manual />}
    >
      <SafeAreaView>
        <Section style={{ marginTop: spacing['2'] }}>
          <OverviewList
            loading={isLoading}
            emptyStateText={t('messagesScreen.empty')}
          >
            {messages?.map((message, index) => (
              <MessageListItem
                messageItem={message}
                key={message.id}
                index={index}
                totalData={messages.length}
              />
            ))}
          </OverviewList>
        </Section>
        <BottomBarSpacer />
      </SafeAreaView>
    </ScrollView>
  );
};
