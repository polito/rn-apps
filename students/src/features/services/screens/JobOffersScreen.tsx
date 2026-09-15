import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AccessibilityInfo,
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native';

import {
  BottomBarSpacer,
  OverviewList,
  RefreshControl,
  Section,
} from '@polito/lib/ui';

import { useGetJobOffers } from '../../../core/queries/jobOfferHooks';
import { JobOfferListItem } from '../components/JobOfferListItem';

export const JobOffersScreen = () => {
  const { t } = useTranslation();
  const jobOffersQuery = useGetJobOffers();

  const listLabel = `${t('jobOffersScreen.jobOffersList')} - ${jobOffersQuery.data?.length || 0} ${t('jobOffersScreen.jobOffersAvailable')}`;

  useEffect(() => {
    if (!jobOffersQuery.isLoading && jobOffersQuery.data) {
      AccessibilityInfo.announceForAccessibility(
        t('jobOffersScreen.listLoaded', { count: jobOffersQuery.data.length }),
      );
    }
  }, [jobOffersQuery.isLoading, jobOffersQuery.data, t]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={<RefreshControl queries={[jobOffersQuery]} manual />}
    >
      <SafeAreaView>
        <Section>
          <View accessibilityRole="list" accessibilityLabel={listLabel}>
            <OverviewList
              loading={jobOffersQuery.isLoading}
              emptyStateText={t('jobOffersScreen.emptyState')}
            >
              {jobOffersQuery?.data?.map((jobOffer, index) => (
                <JobOfferListItem
                  jobOffer={jobOffer}
                  key={jobOffer.id}
                  index={index}
                  totalData={jobOffersQuery.data?.length || 0}
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
