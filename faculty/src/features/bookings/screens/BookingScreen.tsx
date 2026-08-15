import { useTranslation } from 'react-i18next';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { faPlus, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import {
  BottomBarSpacer,
  CtaButton,
  OverviewList,
  Section,
  SectionHeader,
  Theme,
  useStylesheet,
} from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ProfileStackParamList } from '../../../screens/Servizi/ServiceNavigator';
import { BookingListItem } from '../components/BookingListItem';
import { useBookingsBlurHeader } from '../hooks/useBookingsBlurHeader';
import { useBookings } from '../hooks/useBookings';
import { bookingsColors } from '../utils/bookingsTheme';
import { getBookingDetailRoute } from '../utils/bookingStatus';

export const BookingScreen = () => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { bookings, setSelectedBooking } = useBookings();

  const reservations = bookings.filter(booking => booking.type === 2);

  useBookingsBlurHeader({
    title: t('bookingsScreen.title'),
    headerBackTitle: t('common.services'),
  });

  return (
    <>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
      >
        <SafeAreaView>
          <Section style={styles.section}>
            <SectionHeader
              title={t('bookingsScreen.sectionTitle')}
              titleStyle={styles.sectionTitle}
              subtitle={t('bookingsScreen.sectionDescription')}
              subtitleStyle={styles.sectionSubtitle}
              ellipsizeTitle={false}
            />
            <OverviewList
              dividers
              emptyStateText={t('bookingsScreen.emptyState')}
              emptyStateCaption={t('bookingsScreen.emptyStateCaption')}
              emptyStateIcon={faTriangleExclamation}
              emptyStateIconSize={40}
              style={styles.list}
            >
              {reservations.map(booking => {
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
        style={styles.ctaButton}
        containerStyle={styles.ctaContainer}
        textStyle={styles.ctaButtonText}
      />
    </>
  );
};

const createStyles = ({
  dark,
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  shapes,
}: Theme) =>
  StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
    },
    section: {
      marginTop: spacing[3],
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
    sectionSubtitle: {
      color: colors.prose,
      fontSize: fontSizes.xs,
      marginTop: spacing[1],
    },
    ctaContainer: {
      padding: spacing[4],
      alignItems: 'flex-start',
    },
    ctaButton: {
      height: 45,
      paddingVertical: spacing[3],
      paddingHorizontal: 20,
      justifyContent: 'center',
      alignItems: 'center',
      gap: spacing[2],
      flexGrow: 1,
      flexShrink: 0,
      flexBasis: 0,
      width: '100%',
      borderRadius: shapes.lg,
      backgroundColor: bookingsColors.buttonPrimary,
      borderColor: bookingsColors.buttonPrimary,
      elevation: 0,
    },
    ctaButtonText: {
      color: bookingsColors.onButtonPrimary,
      textAlign: 'center',
      fontFamily: fontFamilies.heading,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      lineHeight: 20,
    },
  });
