import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import {
  BottomBarSpacer,
  OverviewList,
  Section,
  SectionHeader,
  TextButton,
  Theme,
  useStylesheet,
} from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ProfileStackParamList } from '../../../screens/Servizi/ServiceNavigator';
import { BookingActionCard } from '../components/BookingActionCard';
import { BookingListItem } from '../components/BookingListItem';
import { useBookingsBlurHeader } from '../hooks/useBookingsBlurHeader';
import { useBookings } from '../hooks/useBookings';
import { bookingsColors } from '../utils/bookingsTheme';
import { getBookingDetailRoute } from '../utils/bookingStatus';

const VISIBLE_COUNT = 3;

export const NewReservationScreen = () => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { bookings, setSelectedBooking } = useBookings();
  const [showAllReservations, setShowAllReservations] = useState(false);

  const reservations = useMemo(
    () => bookings.filter(booking => booking.type === 2),
    [bookings],
  );

  const visibleReservations = showAllReservations
    ? reservations
    : reservations.slice(0, VISIBLE_COUNT);
  const reservationsMoreCount = Math.max(
    0,
    reservations.length - VISIBLE_COUNT,
  );

  useBookingsBlurHeader({
    title: t('bookingsScreen.title'),
    headerBackTitle: t('common.services'),
  });

  const renderShowOthers = (
    moreCount: number,
    expanded: boolean,
    onPress: () => void,
  ) => {
    if (expanded || moreCount <= 0) return undefined;

    return (
      <TextButton
        accessibilityRole="button"
        onPress={onPress}
        style={styles.showOthers}
      >
        {t('bookingsScreen.showOthers', { count: moreCount })}
      </TextButton>
    );
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.scrollContent}
    >
      <SafeAreaView>
        <View style={styles.actionCards}>
          <BookingActionCard
            label={t('bookingsScreen.requestSpaceLabel')}
            title={t('bookingsScreen.requestSpaceTitle')}
            onPress={() => navigation.navigate('CalendarioSpaziStrutture')}
          />
          <BookingActionCard
            label={t('bookingsScreen.bookEventLabel')}
            title={t('bookingsScreen.bookEventTitle')}
            onPress={() =>
              Alert.alert(
                t('bookingsScreen.bookEventTitle'),
                t('bookingsScreen.bookEventComingSoon'),
              )
            }
          />
        </View>

        <Section style={styles.section}>
          <SectionHeader
            title={t('bookingsScreen.recentReservations')}
            titleStyle={styles.sectionTitle}
            ellipsizeTitle={false}
            trailingItem={renderShowOthers(
              reservationsMoreCount,
              showAllReservations,
              () => setShowAllReservations(true),
            )}
          />
          <OverviewList
            dividers
            emptyStateText={t('bookingsScreen.emptyState')}
            emptyStateCaption={t('bookingsScreen.emptyStateCaption')}
            emptyStateIcon={faTriangleExclamation}
            emptyStateIconSize={40}
            style={styles.list}
          >
            {visibleReservations.map(booking => {
              const detailRoute = getBookingDetailRoute(booking.type);

              return (
                <BookingListItem
                  key={booking.id}
                  booking={booking}
                  showDisclosure
                  onPress={() => {
                    if (!detailRoute) return;
                    setSelectedBooking(booking);
                    navigation.navigate(detailRoute);
                  }}
                />
              );
            })}
          </OverviewList>
        </Section>

        <Section style={styles.section}>
          <SectionHeader
            title={t('bookingsScreen.bookedEvents')}
            titleStyle={styles.sectionTitle}
            ellipsizeTitle={false}
          />
          <OverviewList
            dividers
            emptyStateText={t('bookingsScreen.emptyEvents')}
            emptyStateCaption={t('bookingsScreen.emptyEventsCaption')}
            emptyStateIcon={faTriangleExclamation}
            emptyStateIconSize={40}
            style={styles.list}
          />
        </Section>

        <BottomBarSpacer />
      </SafeAreaView>
    </ScrollView>
  );
};

const createStyles = ({
  dark,
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
}: Theme) =>
  StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
      paddingTop: spacing[3],
      gap: spacing[4],
    },
    actionCards: {
      flexDirection: 'row',
      gap: spacing[4],
      paddingHorizontal: spacing[6],
    },
    section: {
      marginTop: spacing[5],
      marginBottom: 0,
    },
    list: {
      elevation: 0,
    },
    sectionTitle: {
      fontFamily: fontFamilies.heading,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.bold,
      lineHeight: 20,
      color: dark ? colors.heading : bookingsColors.textHeading,
    },
    showOthers: {
      marginEnd: spacing[1],
      padding: 0,
      marginRight: 0,
    },
  });
