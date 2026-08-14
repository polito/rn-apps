import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import {
  faCircleXmark,
  faPlus,
  faSpinner,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import {
  Badge,
  BottomBarSpacer,
  CtaButton,
  DisclosureIndicator,
  ListItem,
  OverviewList,
  ScreenDateTime,
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
import { useBookings } from '../hooks/useBookings';

const getBadgeStyle = (
  status: string,
  dark: boolean,
  palettes: Theme['palettes'],
) => {
  const darkBgOpacity = 'CC';
  switch (status) {
    case 'in attesa':
      return {
        backgroundColor: dark
          ? palettes.warning[800] + darkBgOpacity
          : '#FFEDD4',
        foregroundColor: dark ? palettes.warning[200] : '#CA3500',
        icon: faSpinner,
      };
    case 'accettata':
      return {
        backgroundColor: dark
          ? palettes.success[800] + darkBgOpacity
          : '#DCFCE7',
        foregroundColor: dark ? palettes.success[200] : '#008236',
        icon: faCircleCheck,
      };
    case 'respinta':
      return {
        backgroundColor: dark
          ? palettes.danger[800] + darkBgOpacity
          : '#FFE4E6',
        foregroundColor: dark ? palettes.danger[200] : '#C70036',
        icon: faCircleXmark,
      };
    default:
      return {
        backgroundColor: dark
          ? palettes.muted[600] + darkBgOpacity
          : palettes.muted[200],
        foregroundColor: dark ? palettes.muted[200] : palettes.muted[600],
        icon: undefined,
      };
  }
};

const getStatusLabel = (status: string, t: (key: string) => string) => {
  switch (status) {
    case 'in attesa':
      return t('bookingsScreen.status.pending');
    case 'accettata':
      return t('bookingsScreen.status.accepted');
    case 'respinta':
      return t('bookingsScreen.status.rejected');
    default:
      return status;
  }
};

const getBookingDetailRoute = (type: number): 'RequestDetails' | null => {
  switch (type) {
    case 0:
    case 1:
    case 2:
      return 'RequestDetails';
    default:
      return null;
  }
};

const formatBookingTitle = (
  title: string,
  t: (key: string) => string,
): string =>
  title
    .replace(/^Richiesta aula/, t('other.request'))
    .replace(/^Richiesta eventi/, t('other.request'))
    .replace(/^Prenotazione spazio/, t('other.booking'));

export const BookingScreen = () => {
  const { t } = useTranslation();
  const { dark, colors, palettes } = useTheme();
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
                const badge = getBadgeStyle(booking.status, dark, palettes);
                const detailRoute = getBookingDetailRoute(booking.type);

                return (
                  <ListItem
                    key={booking.id}
                    title={formatBookingTitle(booking.title, t)}
                    titleStyle={styles.listTitle}
                    subtitle={
                      <ScreenDateTime
                        date={booking.date}
                        time={booking.time}
                        inListItem
                      />
                    }
                    onPress={() => {
                      if (!detailRoute) return;
                      setSelectedBooking(booking);
                      navigation.navigate(detailRoute);
                    }}
                    trailingItem={
                      <View style={styles.trailing}>
                        <Badge
                          text={getStatusLabel(booking.status, t)}
                          backgroundColor={badge.backgroundColor}
                          foregroundColor={badge.foregroundColor}
                          icon={badge.icon}
                          style={styles.badge}
                        />
                        <DisclosureIndicator />
                      </View>
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
        style={styles.ctaButton}
        containerStyle={styles.ctaContainer}
        textStyle={styles.ctaButtonText}
      />
    </>
  );
};

const NATIVE_LABEL_ON_NAVIGATOR = '#171717';
const TEXT_HEADING = '#45556C';
const TEXT_PRIMARY = '#262626';
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
    listTitle: {
      overflow: 'hidden',
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      lineHeight: 20,
      color: dark ? colors.title : TEXT_PRIMARY,
      marginBottom: spacing[1],
    },
    trailing: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[1],
    },
    badge: {
      paddingVertical: spacing[1],
      paddingHorizontal: spacing[2.5],
      justifyContent: 'center',
      alignItems: 'center',
      gap: spacing[1.5],
      borderRadius: 20,
      borderWidth: 0,
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
