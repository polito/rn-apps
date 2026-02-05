import { SafeAreaView, ScrollView } from 'react-native';

import {
  BottomBarSpacer,
  OverviewList,
  RefreshControl,
  Section,
} from '@polito/lib/ui';

import { useGetNews } from '../../../core/queries/newsHooks';
import { NewsListItem } from '../components/NewsListItem';

export const NewsScreen = () => {
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
              />
            ))}
          </OverviewList>
        </Section>
        <BottomBarSpacer />
      </SafeAreaView>
    </ScrollView>
  );
};
