import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ProfileStackParamList } from '../../../screens/Servizi/ServiceNavigator';
import { BookingRequestsList } from '../components/BookingRequestsList';
import { useBookingRequestsHeader } from '../hooks/useBookingRequestsHeader';
import { useBookings } from '../hooks/useBookings';

type BookingRequestsRouteName = 'PrenotaSpaziEventi' | 'PrenotaSpaziStrutture';

const BOOKING_REQUESTS_CONFIG: Record<
  BookingRequestsRouteName,
  {
    bookingType: number;
    titleKey: string;
    ctaKey: string;
  }
> = {
  PrenotaSpaziEventi: {
    bookingType: 1,
    titleKey: 'other.requestEventsPlaces',
    ctaKey: 'other.newRequest',
  },
  PrenotaSpaziStrutture: {
    bookingType: 2,
    titleKey: 'other.bookStructurePlaces',
    ctaKey: 'bookingsScreen.newBooking',
  },
};

export const BookingRequestsScreen = () => {
  const { t } = useTranslation();
  const route =
    useRoute<RouteProp<ProfileStackParamList, BookingRequestsRouteName>>();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { bookings, setSelectedBooking } = useBookings();

  const config = BOOKING_REQUESTS_CONFIG[route.name];

  useBookingRequestsHeader(t(config.titleKey));

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      e.preventDefault();
      navigation.navigate('Prenotazione');
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <BookingRequestsList
      bookings={bookings.filter(b => b.type === config.bookingType)}
      onItemPress={item => {
        setSelectedBooking(item);
        navigation.navigate('RequestDetails');
      }}
      ctaTitle={t(config.ctaKey)}
      onCtaPress={() => navigation.navigate('RichiediSpazio')}
    />
  );
};
