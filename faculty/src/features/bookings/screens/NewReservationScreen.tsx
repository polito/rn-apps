import { useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { faChevronRight, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import {
  BottomBarSpacer,
  Icon,
  OverviewList,
  Section,
  SectionHeader,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ProfileStackParamList } from '../../../screens/Servizi/ServiceNavigator';
import { BookingActionCard } from '../components/BookingActionCard';
import { BookingListItem } from '../components/BookingListItem';
import { useBookings } from '../hooks/useBookings';
import { getBookingDetailRoute } from '../utils/bookingStatus';

const VISIBLE_COUNT = 3;

export const NewReservationScreen = () => {
  const { t } = useTranslation();
  const { dark, colors, fontSizes } = useTheme();
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={styles.headerTitle}>{t('bookingsScreen.title')}</Text>
      ),
      headerBackTitle: t('common.services'),
      headerBackButtonDisplayMode: 'default',
      headerTransparent: Platform.OS === 'ios',
      headerBlurEffect: dark
        ? 'systemUltraThinMaterialDark'
        : 'systemUltraThinMaterialLight',
      headerShadowVisible: true,
      headerStyle: {
        backgroundColor: Platform.select({
          ios: undefined,
          android: colors.headersBackground,
        }),
      },
    });
  }, [navigation, t, styles.headerTitle, dark, colors.headersBackground]);

  const renderShowOthers = (
    moreCount: number,
    expanded: boolean,
    onPress: () => void,
  ) => {
    if (expanded || moreCount <= 0) return undefined;

    return (
      <TouchableOpacity
        accessibilityRole="button"
        onPress={onPress}
        style={styles.showOthers}
      >
        <Text style={styles.showOthersText}>
          {t('bookingsScreen.showOthers', { count: moreCount })}
        </Text>
        <Icon
          icon={faChevronRight}
          size={fontSizes.xs}
          color={dark ? colors.link : TEXT_LINK}
        />
      </TouchableOpacity>
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
            emptyStateText={t('bookingsScreen.emptyState')}
            emptyStateCaption={t('bookingsScreen.emptyStateCaption')}
            emptyStateIcon={faTriangleExclamation}
            emptyStateIconSize={40}
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
            emptyStateText={t('bookingsScreen.emptyEvents')}
            emptyStateCaption={t('bookingsScreen.emptyEventsCaption')}
            emptyStateIcon={faTriangleExclamation}
            emptyStateIconSize={40}
          />
        </Section>

        <BottomBarSpacer />
      </SafeAreaView>
    </ScrollView>
  );
};

const NATIVE_LABEL_ON_NAVIGATOR = '#171717';
const TEXT_HEADING = '#45556C';
const TEXT_LINK = '#004C7A';

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
    headerTitle: {
      fontFamily: fontFamilies.heading,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.semibold,
      lineHeight: 22,
      letterSpacing: 0,
      color: dark ? colors.title : NATIVE_LABEL_ON_NAVIGATOR,
      textAlign: 'center',
    },
    sectionTitle: {
      fontFamily: fontFamilies.heading,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.bold,
      lineHeight: 20,
      color: dark ? colors.heading : TEXT_HEADING,
    },
    showOthers: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[0.5],
      marginEnd: spacing[1],
    },
    showOthersText: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.medium,
      lineHeight: 16,
      color: dark ? colors.link : TEXT_LINK,
      textAlign: 'right',
    },
  });
