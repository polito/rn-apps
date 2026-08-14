import { ReactElement, useEffect, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import {
  faCircleXmark,
  faDesktop,
  faEye,
  faGrip,
  faLocationDot,
  faPen,
  faPeopleLine,
  faPlug,
  faRotate,
  faSpinner,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import {
  Badge,
  BottomBarSpacer,
  Card,
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

const getActiveStatusLabel = (value: boolean, t: (key: string) => string) =>
  value ? t('common.activeStatus.true') : t('common.activeStatus.false');

const parseBookingDescription = (details: string, eventType?: string) => {
  if (!details) return '';
  if (eventType && details.startsWith(`${eventType} — `)) {
    return details.slice(eventType.length + 3);
  }
  if (eventType && details === eventType) return '';
  return details;
};

export const RequestDetailsScreen = () => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { selectedBooking, isOwnBooking } = useBookings();
  const { dark, colors, fontSizes, palettes } = useTheme();
  const bottomBarHeight = useBottomTabBarHeight();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={styles.headerTitle}>{t('other.requestRoom')}</Text>
      ),
      headerLeft: undefined,
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

  useEffect(() => {
    if (selectedBooking && !isOwnBooking(selectedBooking)) {
      navigation.goBack();
    }
  }, [selectedBooking, isOwnBooking, navigation]);

  if (!selectedBooking) return null;

  const isOwn = isOwnBooking(selectedBooking);

  const badge = getBadgeStyle(selectedBooking.status, dark, palettes);
  const iconColor = dark ? colors.secondaryText : TEXT_HEADING;
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
            <Badge
              text={getStatusLabel(selectedBooking.status, t)}
              backgroundColor={badge.backgroundColor}
              foregroundColor={badge.foregroundColor}
              icon={badge.icon}
              style={styles.badge}
            />
          </View>
        </View>

        <Section style={styles.section}>
          <SectionHeader
            title={t('other.characteristics')}
            titleStyle={styles.sectionTitle}
            ellipsizeTitle={false}
          />
          <OverviewList indented>{characteristicItems}</OverviewList>
        </Section>

        {!!detailsText && (
          <Section style={styles.section}>
            <SectionHeader
              title={t('other.details')}
              titleStyle={styles.sectionTitle}
              ellipsizeTitle={false}
            />
            <Card>
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
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={t('common.delete')}
            style={styles.deleteButton}
            onPress={() =>
              Alert.alert(
                t('common.comingSoon'),
                t('bookingsScreen.bookEventComingSoon'),
              )
            }
          >
            <Icon icon={faTrash} size={fontSizes.xl} color={BUTTON_DANGER_ON} />
            <Text style={styles.deleteButtonText}>{t('common.delete')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={t('common.edit')}
            style={styles.editButton}
            onPress={() =>
              Alert.alert(
                t('common.comingSoon'),
                t('bookingsScreen.bookEventComingSoon'),
              )
            }
          >
            <Icon icon={faPen} size={fontSizes.xl} color={ON_BUTTON_PRIMARY} />
            <Text style={styles.editButtonText}>{t('common.edit')}</Text>
          </TouchableOpacity>
        </CtaButtonContainer>
      )}
    </View>
  );
};

const NATIVE_LABEL = '#171717';
const TEXT_TITLE = '#002B49';
const TEXT_HEADING = '#45556C';
const TEXT_PRIMARY = '#262626';
const TEXT_SUBTITLE = '#314158';
const BUTTON_DANGER_BORDER = '#EC003F';
const BUTTON_DANGER_BG = 'rgba(255, 241, 242, 0.70)';
const BUTTON_DANGER_ON = '#C70036';
const BUTTON_PRIMARY = '#006DB4';
const ON_BUTTON_PRIMARY = '#F8FAFC';

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
    deleteButton: {
      height: 45,
      paddingVertical: spacing[3],
      paddingHorizontal: 20,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: spacing[2],
      flexGrow: 1,
      flexShrink: 0,
      flexBasis: 0,
      borderRadius: shapes.lg,
      borderWidth: 1,
      borderColor: BUTTON_DANGER_BORDER,
      backgroundColor: dark ? colors.background : BUTTON_DANGER_BG,
      elevation: 0,
    },
    deleteButtonText: {
      color: BUTTON_DANGER_ON,
      fontFamily: fontFamilies.heading,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      lineHeight: 20,
    },
    editButton: {
      height: 45,
      paddingVertical: spacing[3],
      paddingHorizontal: 20,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: spacing[2],
      flexGrow: 1,
      flexShrink: 0,
      flexBasis: 0,
      borderRadius: shapes.lg,
      backgroundColor: BUTTON_PRIMARY,
      elevation: 0,
    },
    editButtonText: {
      color: ON_BUTTON_PRIMARY,
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
      color: dark ? colors.title : NATIVE_LABEL,
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
      color: dark ? colors.title : TEXT_TITLE,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing[3],
    },
    badge: {
      paddingVertical: spacing[1],
      paddingHorizontal: spacing[2.5],
      borderRadius: 20,
      borderWidth: 0,
    },
    section: {
      marginBottom: 0,
    },
    sectionTitle: {
      fontFamily: fontFamilies.heading,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.bold,
      lineHeight: 20,
      color: dark ? colors.heading : TEXT_HEADING,
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
      color: dark ? colors.title : TEXT_PRIMARY,
    },
    listSubtitle: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.normal,
      lineHeight: 16,
      color: dark ? colors.prose : TEXT_SUBTITLE,
    },
    detailsText: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.normal,
      lineHeight: 20,
      color: dark ? colors.prose : TEXT_PRIMARY,
      padding: spacing[4],
    },
  });
