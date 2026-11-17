import { SafeAreaView, ScrollView } from 'react-native';

import {
  BottomBarSpacer,
  OverviewList,
  RefreshControl,
  Section,
} from '../../../ui';
import { NewsListItem } from '../components/NewsListItem';
import { useGetNews } from '../queries/newsHooks';

type Props = {
  isUnread?: (newsItemId: number) => boolean;
};

export const NewsScreen = ({ isUnread }: Props) => {
  const newsQuery = useGetNews();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={<RefreshControl queries={[newsQuery]} manual />}
    >
      <SafeAreaView>
        <Section>
          <OverviewList loading={newsQuery.isLoading}>
            {newsQuery?.data?.map((newsItem, index) => (
              <NewsListItem
                newsItem={newsItem}
                key={newsItem.id}
                index={index}
                totalData={newsQuery?.data?.length || 0}
                unread={isUnread?.(newsItem.id)}
              />
            ))}
          </OverviewList>
        </Section>
        <BottomBarSpacer />
      </SafeAreaView>
    </ScrollView>
  );
};
