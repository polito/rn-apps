import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import { faCity, faMap } from '@fortawesome/free-solid-svg-icons';
import {
  CtaButton,
  Divider,
  ListItem,
  OverviewList,
  Section,
  Text,
  Theme,
  useHideTabs,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ProfileStackParamList } from '../../../screens/Servizi/ServiceNavigator';
import { SelectMenuField } from '../components/SelectMenuField';
import { useGetInterdepartmentalSpaces } from '../hooks/useInterdepartmentalSpaces';

export const FacilitySpaceCalendarScreen = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useStylesheet(createStyles);
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { data: filter, isLoading } = useGetInterdepartmentalSpaces();

  useHideTabs(undefined, undefined, { hideOnIos: true });

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

  const radioColor = colors.secondaryText;

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
          <SelectMenuField
            inverted
            icon={faMap}
            title={t('common.location')}
            value={site}
            options={siteActions}
            onSelect={setSite}
            iconSize={24}
            containerStyle={styles.listItem}
          />
          <Divider />
          <SelectMenuField
            inverted
            icon={faCity}
            title={t('common.campus')}
            value={location}
            options={locationActions}
            onSelect={setLocation}
            iconSize={24}
            containerStyle={styles.listItem}
          />
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
    filtersList: {
      marginBottom: 0,
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
      color: colors.heading,
      paddingHorizontal: spacing[4],
    },
    listItem: {
      minHeight: 52,
      paddingVertical: spacing[1],
      paddingHorizontal: spacing[4],
    },
    spacesList: {
      marginBottom: 0,
    },
    listTitle: {
      flex: 0,
      overflow: 'hidden',
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      lineHeight: 20,
      color: colors.title,
      marginBottom: 0,
    },
    listSubtitle: {
      overflow: 'hidden',
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.medium,
      lineHeight: 16,
      color: colors.prose,
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
      paddingBottom: spacing[12],
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
