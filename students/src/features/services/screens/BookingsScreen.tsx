import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView } from 'react-native';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { setTimeoutAccessibilityInfoHelper } from '@polito/lib';
import { BottomBarSpacer } from '@polito/lib';
import { CtaButton } from '@polito/lib';
import { OverviewList } from '@polito/lib';
import { RefreshControl } from '@polito/lib';
import { Section } from '@polito/lib';
import { SectionHeader } from '@polito/lib';
import { useTheme } from '@polito/lib';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useGetBookings } from '../../../core/queries/bookingHooks';
import { BookingListItem } from '../../bookings/components/BookingListItem';
import { ServiceStackParamList } from '../components/ServicesNavigator';

type Props = NativeStackScreenProps<ServiceStackParamList, 'Bookings'>;
const createBookingEnabled = true;

export const BookingsScreen = ({ navigation }: Props) => {
  const bookingsQuery = useGetBookings();
  const { t } = useTranslation();
  const { spacing } = useTheme();

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
