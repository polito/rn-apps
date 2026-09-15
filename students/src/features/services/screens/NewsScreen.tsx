import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, View } from 'react-native';

import {
  BottomBarSpacer,
  OverviewList,
  RefreshControl,
  Section,
} from '@polito/lib/ui';

import { useAccessibility } from '../../../core/hooks/useAccessibilty';
import { useGetNews } from '../../../core/queries/newsHooks';
import { NewsListItem } from '../components/NewsListItem';

export const NewsScreen = () => {
  const { t } = useTranslation();
  const newsQuery = useGetNews();
  const { getListAccessibilityProps } = useAccessibility();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={<RefreshControl queries={[newsQuery]} manual />}
    >
      <SafeAreaView>
        <Section>
          <View
            {...getListAccessibilityProps(
              t('newsScreen.title'),
              newsQuery?.data?.length ?? 0,
            )}
          >
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
          </View>
        </Section>
        <BottomBarSpacer />
      </SafeAreaView>
    </ScrollView>
  );
};
