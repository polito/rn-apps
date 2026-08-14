import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Platform,
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
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ProfileStackParamList } from '../../../screens/Servizi/ServiceNavigator';
import { BookingListItem } from '../components/BookingListItem';
import { useBookings } from '../hooks/useBookings';
import { getBookingDetailRoute } from '../utils/bookingStatus';

export const BookingScreen = () => {
  const { t } = useTranslation();
  const { dark, colors } = useTheme();
  const styles = useStylesheet(createStyles);
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { bookings, setSelectedBooking } = useBookings();

  const reservations = bookings.filter(booking => booking.type === 2);

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
              emptyStateText={t('bookingsScreen.emptyState')}
              emptyStateCaption={t('bookingsScreen.emptyStateCaption')}
              emptyStateIcon={faTriangleExclamation}
              emptyStateIconSize={40}
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

const NATIVE_LABEL_ON_NAVIGATOR = '#171717';
const TEXT_HEADING = '#45556C';
const BUTTON_PRIMARY = '#006DB4';
const ON_BUTTON_PRIMARY = '#F8FAFC';

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
      backgroundColor: BUTTON_PRIMARY,
      borderColor: BUTTON_PRIMARY,
      elevation: 0,
    },
    ctaButtonText: {
      color: ON_BUTTON_PRIMARY,
      textAlign: 'center',
      fontFamily: fontFamilies.heading,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      lineHeight: 20,
    },
  });
