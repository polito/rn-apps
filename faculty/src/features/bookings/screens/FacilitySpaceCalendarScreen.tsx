import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import {
  faChevronDown,
  faCity,
  faMap,
} from '@fortawesome/free-solid-svg-icons';
import {
  CtaButton,
  Divider,
  Icon,
  ListItem,
  OverviewList,
  Section,
  StatefulMenuView,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ProfileStackParamList } from '../../../screens/Servizi/ServiceNavigator';
import { useGetInterdepartmentalSpaces } from '../hooks/useInterdepartmentalSpaces';

export const FacilitySpaceCalendarScreen = () => {
  const { t } = useTranslation();
  const { dark, colors } = useTheme();
  const styles = useStylesheet(createStyles);
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { data: filter, isLoading } = useGetInterdepartmentalSpaces();

  const [site, setSite] = useState<string>();
  const [location, setLocation] = useState<string>();
  const [selectedSpaceId, setSelectedSpaceId] = useState<string>();

  useEffect(() => {
    if (!filter) return;
    setSite(prev => prev ?? filter.sites[0]);
    setLocation(prev => prev ?? filter.locations[0]);
  }, [filter]);

  useEffect(() => {
    if (!filter || !site || !location) return;
    const roomsForSelection = filter.rooms.filter(
      room => room.site === site && room.location === location,
    );
    setSelectedSpaceId(prev => {
      if (prev && roomsForSelection.some(room => room.id === prev)) {
        return prev;
      }
      return roomsForSelection[0]?.id;
    });
  }, [filter, site, location]);

  const siteActions = useMemo(
    () => filter?.sites.map(item => ({ id: item, title: item })) ?? [],
    [filter?.sites],
  );

  const locationActions = useMemo(
    () => filter?.locations.map(item => ({ id: item, title: item })) ?? [],
    [filter?.locations],
  );

  const filteredRooms = useMemo(() => {
    if (!filter || !site || !location) return [];
    return filter.rooms.filter(
      room => room.site === site && room.location === location,
    );
  }, [filter, site, location]);

  useEffect(() => {
    if (!filteredRooms.length) return;
    if (!filteredRooms.some(room => room.id === selectedSpaceId)) {
      setSelectedSpaceId(filteredRooms[0].id);
    }
  }, [filteredRooms, selectedSpaceId]);

  const iconColor = dark ? colors.secondaryText : TEXT_HEADING;
  const radioColor = dark ? colors.secondaryText : ON_SURFACE;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={styles.headerTitle}>
          {t('bookingsScreen.facilitySpaceCalendar')}
        </Text>
      ),
      headerBackTitle: '',
      headerBackButtonDisplayMode: 'minimal',
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

  const renderRadio = (selected: boolean) => (
    <View style={[styles.radio, { borderColor: radioColor }]}>
      {selected && (
        <View
          style={[styles.radioSelectedInner, { backgroundColor: radioColor }]}
        />
      )}
    </View>
  );

  if (isLoading || !filter || !site || !location || !selectedSpaceId) {
    return (
      <View style={[styles.screen, styles.loadingContainer]}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
      >
        <OverviewList style={styles.filtersList} dividers={false}>
          <Pressable accessibilityRole="button">
            <StatefulMenuView
              style={styles.menu}
              title={t('common.location')}
              actions={siteActions}
              onPressAction={({ nativeEvent: { event } }) => setSite(event)}
            >
              <ListItem
                inverted
                title={site}
                titleStyle={styles.filterValue}
                subtitle={t('common.location')}
                subtitleStyle={styles.filterLabel}
                subtitleProps={{ numberOfLines: 1 }}
                containerStyle={styles.listItem}
                leadingItem={<Icon icon={faMap} size={24} color={iconColor} />}
                trailingItem={
                  <Icon
                    icon={faChevronDown}
                    size={16}
                    color={colors.secondaryText}
                  />
                }
              />
            </StatefulMenuView>
          </Pressable>
          <Divider />
          <Pressable accessibilityRole="button">
            <StatefulMenuView
              style={styles.menu}
              title={t('common.campus')}
              actions={locationActions}
              onPressAction={({ nativeEvent: { event } }) =>
                setLocation(event)
              }
            >
              <ListItem
                inverted
                title={location}
                titleStyle={styles.filterValue}
                subtitle={t('common.campus')}
                subtitleStyle={styles.filterLabel}
                subtitleProps={{ numberOfLines: 1 }}
                containerStyle={styles.listItem}
                leadingItem={<Icon icon={faCity} size={24} color={iconColor} />}
                trailingItem={
                  <Icon
                    icon={faChevronDown}
                    size={16}
                    color={colors.secondaryText}
                  />
                }
              />
            </StatefulMenuView>
          </Pressable>
        </OverviewList>

        <Section style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('bookingsScreen.chooseASpace')}
          </Text>
          <OverviewList style={styles.spacesList} dividers={false}>
            {filteredRooms.map((space, index) => {
              const selected = space.id === selectedSpaceId;
              return (
                <View key={space.id}>
                  <ListItem
                    title={space.name}
                    titleStyle={styles.listTitle}
                    subtitle={t('bookingsScreen.seats', {
                      count: space.numSeats,
                    })}
                    subtitleStyle={styles.listSubtitle}
                    subtitleProps={{ numberOfLines: 1 }}
                    containerStyle={styles.listItem}
                    onPress={() => setSelectedSpaceId(space.id)}
                    trailingItem={renderRadio(selected)}
                  />
                  {index < filteredRooms.length - 1 && <Divider />}
                </View>
              );
            })}
          </OverviewList>
        </Section>
      </ScrollView>

      <CtaButton
        title={t('bookingsScreen.showCalendar')}
        action={() =>
          navigation.navigate('VistaCalendarioSpazio', {
            spaceId: selectedSpaceId,
          })
        }
        absolute={false}
        variant="filled"
        style={styles.ctaButton}
        containerStyle={styles.ctaContainer}
        textStyle={styles.ctaButtonText}
      />
    </View>
  );
};

const TEXT_PRIMARY = '#262626';
const TEXT_HEADING = '#45556C';
const TEXT_SUBTITLE = '#314158';
const ON_SURFACE = '#62748E';
const LINK_BLUE = '#006DB4';
const ON_BUTTON_PRIMARY = '#F8FAFC';
const NATIVE_LABEL_ON_NAVIGATOR = '#171717';

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
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    loadingContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingTop: spacing[3],
      paddingBottom: spacing[4],
      gap: spacing[5],
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
    filtersList: {
      marginBottom: 0,
    },
    menu: {
      width: '100%',
    },
    filterLabel: {
      overflow: 'hidden',
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.medium,
      lineHeight: 16,
      color: dark ? colors.prose : TEXT_SUBTITLE,
    },
    filterValue: {
      flex: 0,
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      lineHeight: 20,
      color: dark ? colors.title : TEXT_PRIMARY,
    },
    section: {
      marginBottom: 0,
      gap: spacing[1],
    },
    sectionTitle: {
      fontFamily: fontFamilies.heading,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.bold,
      lineHeight: 20,
      color: dark ? colors.heading : TEXT_HEADING,
      paddingHorizontal: spacing[4],
    },
    spacesList: {
      marginBottom: 0,
    },
    listItem: {
      minHeight: 52,
      paddingVertical: spacing[1],
      paddingHorizontal: spacing[4],
    },
    listTitle: {
      flex: 0,
      overflow: 'hidden',
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      lineHeight: 20,
      color: dark ? colors.title : TEXT_PRIMARY,
      marginBottom: 0,
    },
    listSubtitle: {
      overflow: 'hidden',
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.medium,
      lineHeight: 16,
      color: dark ? colors.prose : TEXT_SUBTITLE,
    },
    radio: {
      width: 16,
      height: 16,
      borderRadius: 8,
      borderWidth: 1.5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioSelectedInner: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    ctaContainer: {
      paddingHorizontal: spacing[4],
      paddingTop: spacing[2],
      paddingBottom: Platform.select({ ios: spacing[12], android: spacing[8] }),
      alignItems: 'flex-start',
    },
    ctaButton: {
      height: 45,
      paddingVertical: spacing[3],
      paddingHorizontal: 20,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      borderRadius: shapes.lg,
      backgroundColor: LINK_BLUE,
      borderColor: LINK_BLUE,
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
