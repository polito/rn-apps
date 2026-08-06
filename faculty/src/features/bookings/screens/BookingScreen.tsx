import { useEffect, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import {
  faChevronLeft,
  faPlus,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  Badge,
  BottomBarSpacer,
  CtaButton,
  ListItem,
  OverviewList,
  Section,
  SectionHeader,
  Text,
  useTheme,
} from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ProfileStackParamList } from '../../../screens/Servizi/ServiceNavigator';
import { useBookings } from '../hooks/useBookings';

const getBadgeColors = (status: string) => {
  switch (status) {
    case 'in attesa':
      return {
        backgroundColor: '#FFF3CD',
        foregroundColor: '#856404',
      };
    case 'accettata':
      return {
        backgroundColor: '#D4EDDA',
        foregroundColor: '#155724',
      };
    case 'respinta':
      return {
        backgroundColor: '#F8D7DA',
        foregroundColor: '#721C24',
      };
    default:
      return {
        backgroundColor: '#E2E3E5',
        foregroundColor: '#6C757D',
      };
  }
};

const getStatusLabel = (status: string, t: (key: string) => string) => {
  switch (status) {
    case 'in attesa':
      return t('other.waiting');
    case 'accettata':
      return t('other.accepted');
    case 'respinta':
      return t('other.rejected');
    default:
      return status;
  }
};

const getBookingDetailRoute = (
  type: number,
): keyof ProfileStackParamList | null => {
  switch (type) {
    case 0:
      return 'Booking0';
    case 1:
      return 'Booking1';
    case 2:
      return 'Booking2';
    default:
      return null;
  }
};

export const BookingScreen = () => {
  const { t } = useTranslation();
  const { spacing, colors, fontSizes, palettes } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { bookings, setSelectedBooking } = useBookings();

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      e.preventDefault();
      navigation.navigate('Servizi');
    });

    return unsubscribe;
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('Servizi')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing[1.5],
            paddingLeft: spacing[1],
          }}
          accessibilityRole="button"
          accessibilityLabel={t('common.services')}
        >
          <FontAwesomeIcon
            icon={faChevronLeft}
            size={22}
            color={palettes.primary[500]}
          />
          <Text
            variant="link"
            style={{
              color: palettes.primary[500],
              fontSize: fontSizes.xl,
            }}
          >
            {t('common.services')}
          </Text>
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <Text
          variant="heading"
          style={{
            textAlign: 'center',
            width: '100%',
            marginLeft: Platform.OS === 'android' ? -25 : -55,
          }}
        >
          {t('other.bookPlaces')}
        </Text>
      ),
    });
  }, [navigation, t, spacing, fontSizes, palettes]);

  return (
    <>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <SafeAreaView>
          <Section style={{ marginTop: spacing[3] }}>
            <SectionHeader
              title={t('bookingsScreen.sectionTitle')}
              subtitle={t('bookingsScreen.sectionDescription')}
              subtitleStyle={{
                color: colors.prose,
                fontSize: fontSizes.xs,
                marginTop: spacing[1],
              }}
              ellipsizeTitle={false}
            />
            <OverviewList
              emptyStateText={t('bookingsScreen.emptyState')}
              emptyStateCaption={t('bookingsScreen.emptyStateCaption')}
              emptyStateIcon={faTriangleExclamation}
              emptyStateIconSize={40}
            >
              {bookings.map(booking => {
                const { backgroundColor, foregroundColor } = getBadgeColors(
                  booking.status,
                );
                const detailRoute = getBookingDetailRoute(booking.type);

                return (
                  <ListItem
                    key={booking.id}
                    title={booking.title
                      .replace(/^Richiesta aula/, t('other.request'))
                      .replace(/^Richiesta eventi/, t('other.request'))
                      .replace(/^Prenotazione spazio/, t('other.booking'))}
                    subtitle={`${booking.date} ${booking.time}`}
                    onPress={() => {
                      if (!detailRoute) return;
                      setSelectedBooking(booking);
                      navigation.navigate(detailRoute);
                    }}
                    trailingItem={
                      <Badge
                        text={getStatusLabel(booking.status, t)}
                        backgroundColor={backgroundColor}
                        foregroundColor={foregroundColor}
                      />
                    }
                  />
                );
              })}
            </OverviewList>
          </Section>
          <BottomBarSpacer />
        </SafeAreaView>
      </ScrollView>
      <CtaButton
        action={() => {
          navigation.navigate('NuovaPrenotazione');
        }}
        title={t('bookingsScreen.newBooking')}
        icon={faPlus}
        variant="filled"
      />
    </>
  );
};
