import { useEffect, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet } from 'react-native';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import {
  IconButton,
  Text,
  Theme,
  useStylesheet,
} from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ProfileStackParamList } from '../../../screens/Servizi/ServiceNavigator';
import { BookingRequestsList } from '../components/BookingRequestsList';
import { useBookings } from '../hooks/useBookings';

export const BookStructureRoomScreen = () => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { bookings, setSelectedBooking } = useBookings();

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      e.preventDefault();
      navigation.navigate('Prenotazione');
    });

    return unsubscribe;
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <IconButton
          icon={faArrowLeft}
          size={22}
          onPress={() => navigation.navigate('Prenotazione')}
        />
      ),
      headerTitle: () => (
        <Text variant="heading" style={styles.headerTitle}>
          {t('other.bookStructurePlaces')}
        </Text>
      ),
    });
  }, [navigation, t, styles.headerTitle]);

  return (
    <BookingRequestsList
      bookings={bookings.filter(b => b.type === 2)}
      onItemPress={item => {
        setSelectedBooking(item);
        navigation.navigate('RequestDetails');
      }}
      ctaTitle={t('bookingsScreen.newBooking')}
      onCtaPress={() => navigation.navigate('RichiediSpazio')}
    />
  );
};

const createStyles = ({ fontFamilies, fontSizes, fontWeights }: Theme) =>
  StyleSheet.create({
    headerTitle: {
      width: '100%',
      textAlign: 'center',
      marginLeft: Platform.select({ android: -25, default: -55 }),
      fontFamily: fontFamilies.heading,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.semibold,
    },
  });
