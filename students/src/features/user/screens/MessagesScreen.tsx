import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useTranslation } from 'react-i18next';
import { Pressable, SafeAreaView, ScrollView, StyleSheet } from 'react-native';

import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  BottomBarSpacer,
  OverviewList,
  RefreshControl,
  Section,
  Swipeable,
  SwipeableProvider,
  useTheme,
} from '@polito/lib/ui';

import { useDeleteMessage, useGetMessages } from '~/core/queries/studentHooks';

import { MessageListItem } from '../components/MessageListItem';

export const MessagesScreen = () => {
  const { spacing, colors, palettes } = useTheme();
  const messagesQuery = useGetMessages();
  const { mutateAsync: deleteMessage } = useDeleteMessage();

  const { isLoading, data: messages } = messagesQuery;
  const { t } = useTranslation();

  const handleDelete = async (messageId: number) => {
    await deleteMessage(messageId);
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={<RefreshControl queries={[messagesQuery]} manual />}
    >
      <SafeAreaView>
        <GestureHandlerRootView>
          <SwipeableProvider>
            <Section style={{ marginTop: spacing['2'] }}>
              <OverviewList
                loading={isLoading}
                emptyStateText={t('messagesScreen.empty')}
              >
                {messages?.map((message, index) => (
                  <Swipeable
                    key={message.id}
                    rightAction={
                      <Pressable
                        style={[
                          styles.deleteButton,
                          { backgroundColor: palettes.danger[600] },
                        ]}
                        accessibilityRole="button"
                        accessibilityLabel={t('messagesScreen.deleteMessage')}
                        onPress={() => handleDelete(message.id)}
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          color={colors.white}
                          size={20}
                        />
                      </Pressable>
                    }
                  >
                    {({ isSwiping }) => (
                      <MessageListItem
                        messageItem={message}
                        index={index}
                        totalData={messages.length}
                        isSwiping={isSwiping}
                      />
                    )}
                  </Swipeable>
                ))}
              </OverviewList>
            </Section>
          </SwipeableProvider>
        </GestureHandlerRootView>
        <BottomBarSpacer />
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 88,
    height: '100%',
  },
});
