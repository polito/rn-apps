import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, View } from 'react-native';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { setTimeoutAccessibilityInfoHelper } from '@polito/lib/core';
import {
  BottomBarSpacer,
  CtaButton,
  OverviewList,
  RefreshControl,
  Section,
  SectionHeader,
  useTheme,
} from '@polito/lib/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useAccessibility } from '../../../core/hooks/useAccessibilty';
import { useGetBookings } from '../../../core/queries/bookingHooks';
import { BookingListItem } from '../../bookings/components/BookingListItem';
import { ServiceStackParamList } from '../components/ServicesNavigator';

type Props = NativeStackScreenProps<ServiceStackParamList, 'Bookings'>;
const createBookingEnabled = true;

export const BookingsScreen = ({ navigation }: Props) => {
  const bookingsQuery = useGetBookings();
  const { t } = useTranslation();
  const { spacing } = useTheme();
  const { getListAccessibilityProps } = useAccessibility();

  useEffect(() => {
    if (
      !bookingsQuery?.isLoading &&
      !bookingsQuery?.isError &&
      bookingsQuery?.isSuccess &&
      bookingsQuery?.data?.length === 0
    ) {
      setTimeoutAccessibilityInfoHelper(t('bookingsScreen.emptyState'), 500);
    }
  }, [bookingsQuery, t]);

  return (
    <>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={<RefreshControl queries={[bookingsQuery]} manual />}
      >
        <SafeAreaView>
          <Section style={{ marginTop: spacing[2] }}>
            <SectionHeader title={t('bookingsScreen.sectionTitle')} />
            <View
              {...getListAccessibilityProps(
                t('bookingsScreen.sectionTitle'),
                bookingsQuery.data?.length ?? 0,
              )}
            >
              <OverviewList
                loading={bookingsQuery.isLoading}
                emptyStateText={t('bookingsScreen.emptyState')}
              >
                {bookingsQuery?.data?.map((booking, index) => (
                  <BookingListItem
                    booking={booking}
                    key={booking.id}
                    index={index}
                    totalData={bookingsQuery.data?.length || 0}
                  />
                ))}
              </OverviewList>
            </View>
          </Section>
          <BottomBarSpacer />
        </SafeAreaView>
      </ScrollView>
      {createBookingEnabled && (
        <CtaButton
          action={() => {
            navigation.navigate('BookingTopic');
          }}
          title={t('bookingsScreen.newBooking')}
          icon={faPlus}
        />
      )}
    </>
  );
};
