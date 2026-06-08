import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  BackHandler,
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  faChevronDown,
  faCrosshairs,
  faElevator,
  faExpand,
} from '@fortawesome/free-solid-svg-icons';
import { useScreenTitle } from '@polito/lib/core';
import { usePreferencesContext } from '@polito/lib/core';
import { CtaButton } from '@polito/lib/ui';
import { Divider } from '@polito/lib/ui';
import { Icon } from '@polito/lib/ui';
import { IconButton } from '@polito/lib/ui';
import { Row } from '@polito/lib/ui';
import { StatefulMenuView } from '@polito/lib/ui';
import { Text } from '@polito/lib/ui';
import { TranslucentCard } from '@polito/lib/ui';
import { TranslucentView } from '@polito/lib/ui';
import { useStylesheet } from '@polito/lib/ui';
import { useTheme } from '@polito/lib/ui';
import { Theme } from '@polito/lib/ui';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import Mapbox from '@rnmapbox/maps';

import { IS_ANDROID } from '../../../core/constants';
import { MapScreenProps } from '../components/MapNavigator';
import { MarkersLayer } from '../components/MarkersLayer';
import { PlacesStackParamList } from '../components/PlacesNavigator';
import { MapNavigatorContext } from '../contexts/MapNavigatorContext';
import { PlacesContext } from '../contexts/PlacesContext';
import { useGetCurrentCampus } from '../hooks/useGetCurrentCampus';
import { useNavigationPlaces } from '../hooks/useSearchPlaces';

type Props = MapScreenProps<PlacesStackParamList, 'MapSelection'>;

const screenHeight = Dimensions.get('window').height;
const SELECTOR_HEIGHT = screenHeight * 0.58;

export const MapSelectionScreen = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const {
    selectedPlace,
    setSelectedPlace,
    floorId,
    setFloorId,
    navSelectorRoom,
  } = useContext(PlacesContext);
  const { fontSizes, dark, palettes, spacing, colors } = useTheme();
  const campus = useGetCurrentCampus();
  const { cameraRef } = useContext(MapNavigatorContext);
  const bottomSheetPosition = useSharedValue(0);
  const { accessibility } = usePreferencesContext();
  //  const [confirmSelection, setConfirmSelection] = useState<boolean>(false);
  const bottomTabBarHeight = useBottomTabBarHeight();

  const ANDROID_OFFSET = Platform.OS === 'android' ? 0.015 * screenHeight : 0;
  const insets = useSafeAreaInsets();

  const { filteredPlaces: places } = useNavigationPlaces({
    siteId: campus?.id,
    floorId: floorId,
  });

  const initUserPosition = useCallback(async () => {
    if (!campus) {
      return;
    }

    const location = await Mapbox.locationManager.getLastKnownLocation();
    if (navSelectorRoom === 'start' && location) {
      const { latitude: latCampus, longitude: lonCampus, extent } = campus;
      const { latitude: userLat, longitude: userLon } = location.coords;

      const minLon = lonCampus - extent;
      const maxLon = lonCampus + extent;
      const minLat = latCampus - extent;
      const maxLat = latCampus + extent;

      const isInside =
        userLon >= minLon &&
        userLon <= maxLon &&
        userLat >= minLat &&
        userLat <= maxLat;

      return isInside;
    }
  }, [navSelectorRoom, campus]);

  /*
  useCallback(() => {
    if (!confirmSelection) setSelectedPlace(null);
  }, [confirmSelection, setSelectedPlace]);*/

  const floorActions = useMemo(() => {
    if (!campus?.floors) return [];
    return [...campus.floors] // copia per non mutare l’originale
      .sort((a, b) => a.level - b.level)
      .map(f => ({
        id: f.id,
        title: f.name,
      }));
  }, [campus?.floors]);

  const centerToUserLocation = useCallback(async () => {
    const location = await Mapbox.locationManager.getLastKnownLocation();
    if (location) {
      const { latitude, longitude } = location.coords;
      cameraRef.current?.flyTo([longitude, latitude]);
    }
  }, [cameraRef]);

  const centerToCurrentCampus = useCallback(async () => {
    if (!campus || !cameraRef.current) {
      return;
    }
    const { latitude, longitude, extent } = campus;
    cameraRef.current.fitBounds(
      [longitude - extent, latitude - extent],
      [longitude + extent, latitude + extent],
      undefined,
      2000,
    );
  }, [cameraRef, campus]);

  useEffect(() => {
    initUserPosition().then(isInside => {
      if (isInside && navSelectorRoom === 'start') {
        centerToUserLocation();
      }
    });
  }, [navSelectorRoom, initUserPosition, centerToUserLocation]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        setSelectedPlace(null);

        return false; // Allow default back button behavior
      };

      // Listen for the Android hardware back button
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [setSelectedPlace]),
  );

  const floorSelectorButton = (
    <TranslucentCard
      {...(accessibility?.fontSize && Number(accessibility?.fontSize) >= 150
        ? { style: { height: 55 } }
        : {})}
    >
      <TouchableOpacity
        accessibilityLabel={t('placesScreen.changeFloor')}
        disabled={floorId != null}
      >
        <Row ph={3} pv={2.5} gap={1} align="center">
          {accessibility?.fontSize && Number(accessibility?.fontSize) < 150 && (
            <Icon icon={faElevator} />
          )}
          <Text
            ellipsizeMode="tail"
            numberOfLines={1}
            {...(accessibility?.fontSize &&
            Number(accessibility?.fontSize) >= 150
              ? { style: { height: 75, marginVertical: -20, maxWidth: 250 } }
              : {
                  flexShrink: 1,
                  flexGrow: 1,
                  marginRight: 20,
                })}
          >
            {campus?.floors.find(f => f.id === floorId)?.name}
          </Text>
          <Icon
            icon={faChevronDown}
            size={fontSizes.xs}
            style={styles.chevronIcon}
          />
        </Row>
      </TouchableOpacity>
    </TranslucentCard>
  );

  const ctaButton = useMemo(() => {
    return (
      <CtaButton
        absolute={false}
        title={t('mapSelectionScreen.confirmSelection')}
        disabled={selectedPlace ? false : true}
        action={() => {
          navigation.goBack();
        }}
      />
    );
  }, [navigation, selectedPlace, t]);

  const controlsAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: 1,
      transform: [
        {
          translateY:
            Math.max(0.53 * screenHeight, bottomSheetPosition.value) +
            (Platform.OS === 'android' ? ANDROID_OFFSET : 0),
        },
      ],
    };
  });

  const renderMapContent = useCallback(
    () => <MarkersLayer places={places} />,
    [places],
  );
  useLayoutEffect(() => {
    navigation.setOptions({
      mapContent: renderMapContent,
    });
  }, [navigation, renderMapContent]);

  useScreenTitle(t('mapSelectionScreen.title'));

  return (
    <>
      <TranslucentView
        style={{
          ...styles.translucentView,
          backgroundColor: Platform.select({ android: colors.background }),
        }}
      />
      <Animated.View style={[styles.controls, controlsAnimatedStyle]}>
        <Row
          style={{
            ...styles.rowControls,
            bottom: bottomTabBarHeight / 3,
          }}
          align="stretch"
          justify="space-between"
        >
          <TranslucentCard>
            <IconButton
              icon={faCrosshairs}
              size={spacing[6]}
              style={styles.icon}
              accessibilityLabel={t('placesScreen.goToMyPosition')}
              onPress={centerToUserLocation}
            />
            <Divider style={styles.divider} size={1} />
            <IconButton
              icon={faExpand}
              size={spacing[6]}
              style={styles.icon}
              accessibilityLabel={t('placesScreen.viewWholeCampus')}
              onPress={centerToCurrentCampus}
            />
          </TranslucentCard>
          <StatefulMenuView
            style={styles.statefulMenu}
            onPressAction={({ nativeEvent: { event: selectedFloorId } }) => {
              setFloorId(selectedFloorId);
            }}
            actions={floorActions}
          >
            {floorSelectorButton}
          </StatefulMenuView>
        </Row>
      </Animated.View>
      <View
        style={{
          ...styles.markerSelectorContainer,
          bottom: IS_ANDROID
            ? insets.bottom <= 40
              ? bottomTabBarHeight / 2 - insets.bottom
              : bottomTabBarHeight * 0.7 - insets.bottom
            : bottomTabBarHeight * 0.85 - insets.bottom,
        }}
      >
        <View style={styles.textContainer}>
          <View style={styles.textGrid}>
            {selectedPlace ? (
              <>
                <Text
                  style={[
                    styles.text,
                    {
                      fontSize: fontSizes.lg,
                      color: palettes.gray[dark ? 300 : 600],
                    },
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {navSelectorRoom === 'start'
                    ? t('mapSelectionScreen.fromPlaceSelected')
                    : navSelectorRoom === 'destination'
                      ? t('mapSelectionScreen.toPlaceSelected')
                      : t('mapSelectionScreen.placeSelected')}
                </Text>
                <Text
                  style={[
                    styles.textSelected,
                    {
                      fontSize: fontSizes.md,
                      color: palettes.gray[dark ? 300 : 600],
                    },
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {`${selectedPlace?.room.name ? selectedPlace.room.name : selectedPlace?.category.name} - ${selectedPlace?.floor.name}`}
                </Text>
              </>
            ) : (
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: fontSizes.md,
                    color: palettes.gray[dark ? 300 : 600],
                  },
                ]}
              >
                {t('mapSelectionScreen.selectionLabel')}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.ctaButtonContainer}>{ctaButton}</View>
      </View>
    </>
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    translucentView: {
      top: SELECTOR_HEIGHT,
    },
    controls: {
      position: 'absolute',
      display: 'flex',
      flexDirection: 'row',
      left: spacing[5],
      right: spacing[5],
      alignItems: 'flex-start',
      gap: spacing[3],
      alignSelf: 'stretch',
    },
    divider: {
      alignSelf: 'stretch',
    },
    rowControls: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    chevronIcon: {
      position: 'absolute',
      right: 15,
    },
    markerSelectorContainer: {
      position: 'absolute',
      display: 'flex',
      width: '100%',
      paddingHorizontal: spacing[5],
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: IS_ANDROID ? spacing[1] : spacing[7],
    },
    textContainer: {
      display: 'flex',
      paddingVertical: spacing[4],
      paddingHorizontal: spacing[2],
      flexDirection: 'column',
      alignItems: 'flex-start',
      alignSelf: 'stretch',
    },
    textGrid: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      gap: spacing[2],
      alignSelf: 'stretch',
    },
    text: {
      overflow: 'hidden',
      fontFamily: 'Montserrat',
      fontSize: 16,
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: 21,
    },
    textSelected: {
      overflow: 'hidden',
      fontFamily: 'Montserrat',
      fontSize: 16,
      fontStyle: 'normal',
      fontWeight: 600,
      lineHeight: 21,
    },
    icon: {
      alignItems: 'center',
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
    },
    ctaButtonContainer: {
      display: 'flex',
      bottom: spacing[4],
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'stretch',
    },
    statefulMenu: {
      maxWidth: '60%',
    },
  });
