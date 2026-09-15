import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';

import {
  faPlus,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
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
import { useBookings } from '../hooks/useBookings';

export const BookingScreen = () => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { bookings, setSelectedBooking } = useBookings();

  const reservations = bookings.filter(booking => booking.type === 2);

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
              emptyStateSpacing={8}
              style={styles.list}
            >
              {reservations.map(booking => (
                <BookingListItem
                  key={booking.id}
                  booking={booking}
                  showDisclosure
                  onPress={() => {
                    setSelectedBooking(booking);
                    navigation.navigate('RequestDetails');
                  }}
                />
              ))}
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
  colors,
  palettes,
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
      color: colors.heading,
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
      backgroundColor: palettes.navy[500],
      borderColor: palettes.navy[500],
      elevation: 0,
    },
    ctaButtonText: {
      color: palettes.gray[50],
      textAlign: 'center',
      fontFamily: fontFamilies.heading,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      lineHeight: 20,
    },
  });
