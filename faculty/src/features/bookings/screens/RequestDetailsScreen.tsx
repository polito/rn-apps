import { ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import {
  faDesktop,
  faEye,
  faGrip,
  faLocationDot,
  faPen,
  faPeopleLine,
  faPlug,
  faRotate,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import {
  BottomBarSpacer,
  Card,
  CtaButton,
  CtaButtonContainer,
  Icon,
  ListItem,
  OverviewList,
  ScreenDateTime,
  Section,
  SectionHeader,
  Text,
  Theme,
  faSeat,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ProfileStackParamList } from '../../../screens/Servizi/ServiceNavigator';
import { BookingStatusBadge } from '../components/BookingStatusBadge';
import { useBookingsBlurHeader } from '../hooks/useBookingsBlurHeader';
import { useBookings } from '../hooks/useBookings';
import { bookingsColors } from '../utils/bookingsTheme';
import { parseBookingDescription } from '../utils/bookingStatus';

const getActiveStatusLabel = (value: boolean, t: (key: string) => string) =>
  value ? t('common.activeStatus.true') : t('common.activeStatus.false');

export const RequestDetailsScreen = () => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { selectedBooking, isOwnBooking } = useBookings();
  const { dark, colors, fontSizes } = useTheme();
  const bottomBarHeight = useBottomTabBarHeight();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();

  useBookingsBlurHeader({
    title: t('other.requestRoom'),
    headerBackTitle: t('common.services'),
  });

  useEffect(() => {
    if (selectedBooking && !isOwnBooking(selectedBooking)) {
      navigation.goBack();
    }
  }, [selectedBooking, isOwnBooking, navigation]);

  if (!selectedBooking) return null;

  const isOwn = isOwnBooking(selectedBooking);

  const iconColor = dark ? colors.secondaryText : bookingsColors.textHeading;
  const isFacilityBooking = selectedBooking.type === 2;
  const eventTypeLabel =
    selectedBooking.eventType ??
    (isFacilityBooking
      ? selectedBooking.details.split(' — ')[0]?.trim()
      : undefined);
  const detailsText = isFacilityBooking
    ? parseBookingDescription(selectedBooking.details, eventTypeLabel)
    : selectedBooking.details;

  const characteristicItems = ((): ReactElement[] => {
    const items: ReactElement[] = [];

    if (isFacilityBooking) {
      if (eventTypeLabel) {
        items.push(
          <ListItem
            key="eventType"
            leadingItem={
              <Icon icon={faGrip} size={fontSizes['2xl']} color={iconColor} />
            }
            title={t('bookingsScreen.typeOfEvent')}
            titleStyle={styles.listTitle}
            subtitle={eventTypeLabel}
            subtitleStyle={styles.listSubtitle}
            containerStyle={styles.listItem}
          />,
        );
      }

      if (selectedBooking.capacity != null) {
        items.push(
          <ListItem
            key="capacity"
            leadingItem={<Icon icon={faSeat} size={28} color={iconColor} />}
            title={t('bookingsScreen.specifySeats')}
            titleStyle={styles.listTitle}
            subtitle={t('bookingsScreen.availableSeats', {
              count: selectedBooking.capacity,
            })}
            subtitleStyle={styles.listSubtitle}
            containerStyle={styles.listItem}
          />,
        );
      }

      items.push(
        <ListItem
          key="recurringEvent"
          leadingItem={
            <Icon icon={faRotate} size={fontSizes['2xl']} color={iconColor} />
          }
          title={t('bookingsScreen.recurringEvent')}
          titleStyle={styles.listTitle}
          subtitle={getActiveStatusLabel(
            selectedBooking.recurringEvent ?? false,
            t,
          )}
          subtitleStyle={styles.listSubtitle}
          containerStyle={styles.listItem}
        />,
        <ListItem
          key="visibleToOthers"
          leadingItem={
            <Icon icon={faEye} size={fontSizes['2xl']} color={iconColor} />
          }
          title={t('bookingsScreen.visibleToOthers')}
          titleStyle={styles.listTitle}
          subtitle={getActiveStatusLabel(
            selectedBooking.visibleToOthers ?? true,
            t,
          )}
          subtitleStyle={styles.listSubtitle}
          containerStyle={styles.listItem}
        />,
      );
    } else {
      if (selectedBooking.capacity != null) {
        items.push(
          <ListItem
            key="capacity"
            leadingItem={
              <Icon
                icon={faPeopleLine}
                size={fontSizes['2xl']}
                color={iconColor}
              />
            }
            title={t('other.capacity')}
            titleStyle={styles.listTitle}
            subtitle={t('other.peopleCount', {
              count: selectedBooking.capacity,
            })}
            subtitleStyle={styles.listSubtitle}
            containerStyle={styles.listItem}
          />,
        );
      }

      if (
        selectedBooking.chairType &&
        selectedBooking.chairType !== 'Indifferente'
      ) {
        items.push(
          <ListItem
            key="deskType"
            leadingItem={
              <Icon
                icon={faDesktop}
                size={fontSizes['2xl']}
                color={iconColor}
              />
            }
            title={t('other.deskType')}
            titleStyle={styles.listTitle}
            subtitle={selectedBooking.chairType}
            subtitleStyle={styles.listSubtitle}
            containerStyle={styles.listItem}
          />,
        );
      }

      if (selectedBooking.powerOutput != null) {
        items.push(
          <ListItem
            key="outlets"
            leadingItem={
              <Icon icon={faPlug} size={fontSizes['2xl']} color={iconColor} />
            }
            title={t('other.outlets')}
            titleStyle={styles.listTitle}
            subtitle={
              selectedBooking.powerOutput
                ? t('bookingSeatScreen.seatStatus.available')
                : t('bookingSeatScreen.seatStatus.notAvailable')
            }
            subtitleStyle={styles.listSubtitle}
            containerStyle={styles.listItem}
          />,
        );
      }

      if (selectedBooking.where) {
        items.push(
          <ListItem
            key="campus"
            leadingItem={
              <Icon
                icon={faLocationDot}
                size={fontSizes['2xl']}
                color={iconColor}
              />
            }
            title={t('common.campus')}
            titleStyle={styles.listTitle}
            subtitle={selectedBooking.where}
            subtitleStyle={styles.listSubtitle}
            containerStyle={styles.listItem}
          />,
        );
      }
    }

    return items;
  })();

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.headerBlock}>
          <Text style={styles.title} numberOfLines={2}>
            {selectedBooking.title}
          </Text>
          <View style={styles.metaRow}>
            <ScreenDateTime
              date={selectedBooking.date}
              time={selectedBooking.time}
            />
            <BookingStatusBadge status={selectedBooking.status} />
          </View>
        </View>

        <Section style={styles.section}>
          <SectionHeader
            title={t('other.characteristics')}
            titleStyle={styles.sectionTitle}
            ellipsizeTitle={false}
          />
          <OverviewList indented dividers style={styles.list}>
            {characteristicItems}
          </OverviewList>
        </Section>

        {!!detailsText && (
          <Section style={styles.section}>
            <SectionHeader
              title={t('other.details')}
              titleStyle={styles.sectionTitle}
              ellipsizeTitle={false}
            />
            <Card style={styles.list}>
              <Text style={styles.detailsText}>{detailsText}</Text>
            </Card>
          </Section>
        )}

        {selectedBooking.status === 'in attesa' && isOwn ? (
          <>
            <View style={styles.ctaScrollSpacer} />
            <BottomBarSpacer />
          </>
        ) : (
          <BottomBarSpacer />
        )}
      </ScrollView>

      {selectedBooking.status === 'in attesa' && isOwn && (
        <CtaButtonContainer
          absolute
          style={[styles.ctaRow, { bottom: bottomBarHeight }]}
        >
          <CtaButton
            title={t('common.delete')}
            icon={faTrash}
            action={() =>
              Alert.alert(
                t('common.comingSoon'),
                t('bookingsScreen.bookEventComingSoon'),
              )
            }
            absolute={false}
            variant="outlined"
            destructive
            containerStyle={styles.ctaButtonContainer}
            style={styles.ctaButton}
            textStyle={styles.ctaButtonText}
          />
          <CtaButton
            title={t('common.edit')}
            icon={faPen}
            action={() =>
              Alert.alert(
                t('common.comingSoon'),
                t('bookingsScreen.bookEventComingSoon'),
              )
            }
            absolute={false}
            containerStyle={styles.ctaButtonContainer}
            style={styles.ctaButton}
            textStyle={styles.ctaButtonText}
          />
        </CtaButtonContainer>
      )}
    </View>
  );
};

const createStyles = ({
  dark,
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  shapes,
  spacing,
}: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingTop: spacing[4],
      paddingBottom: spacing[4],
      gap: spacing[5],
    },
    ctaScrollSpacer: {
      height: 45 + spacing[20],
    },
    ctaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing[4],
      paddingTop: spacing[4],
      paddingBottom: spacing[4],
      gap: spacing[3],
    },
    ctaButtonContainer: {
      flex: 1,
      padding: 0,
    },
    ctaButton: {
      height: 45,
      paddingVertical: spacing[3],
      paddingHorizontal: 20,
      borderRadius: shapes.lg,
      elevation: 0,
    },
    ctaButtonText: {
      fontFamily: fontFamilies.heading,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      lineHeight: 20,
    },
    headerTitle: {
      fontFamily: fontFamilies.heading,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.semibold,
      lineHeight: 22,
      color: dark ? colors.title : bookingsColors.nativeLabelOnNavigator,
      textAlign: 'center',
    },
    headerBlock: {
      paddingHorizontal: spacing[4],
      gap: spacing[2],
    },
    title: {
      fontFamily: fontFamilies.heading,
      fontSize: fontSizes.xl,
      fontWeight: fontWeights.bold,
      lineHeight: 24,
      color: dark ? colors.title : bookingsColors.textTitle,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing[3],
    },
    section: {
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
    listItem: {
      minHeight: 52,
      paddingVertical: spacing[1],
    },
    listTitle: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      lineHeight: 20,
      color: dark ? colors.title : bookingsColors.textPrimary,
    },
    listSubtitle: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.normal,
      lineHeight: 16,
      color: dark ? colors.prose : bookingsColors.textSubtitle,
    },
    detailsText: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.normal,
      lineHeight: 20,
      color: dark ? colors.prose : bookingsColors.textPrimary,
      padding: spacing[4],
    },
  });
