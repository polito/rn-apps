import { SafeAreaView, ScrollView } from 'react-native';

import {
  BottomBarSpacer,
  OverviewList,
  RefreshControl,
  Section,
} from '@polito/lib/ui';

import { useGetJobOffers } from '../../../core/queries/jobOfferHooks';
import { JobOfferListItem } from '../components/JobOfferListItem';

export const JobOffersScreen = () => {
  const jobOffersQuery = useGetJobOffers();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={<RefreshControl queries={[jobOffersQuery]} manual />}
    >
      <SafeAreaView>
        <Section>
          <OverviewList loading={jobOffersQuery.isLoading}>
            {jobOffersQuery?.data?.map((jobOffer, index) => (
              <JobOfferListItem
                jobOffer={jobOffer}
                key={jobOffer.id}
                index={index}
                totalData={jobOffersQuery.data?.length || 0}
              />
            ))}
          </OverviewList>
        </Section>
        <BottomBarSpacer />
      </SafeAreaView>
    </ScrollView>
  );
};
