import { ComponentType, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageURISource, Platform, StyleSheet, View } from 'react-native';
import { PERMISSIONS, request } from 'react-native-permissions';

import { NavigationResponse, PlaceOverview } from '@polito/student-api-client';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Images,
  RasterLayer,
  RasterSource,
  UserLocation,
} from '@rnmapbox/maps';

import { notNullish } from '../../../core/utils/predicates';
import { Divider, TranslucentView } from '../../../ui/components';
import { createHeaderCloseButton } from '../../../ui/components/HeaderCloseButton';
import { HeaderLogoNoProps } from '../../../ui/components/HeaderLogo';
import { useTheme } from '../../../ui/hooks/useTheme';
import { useTitlesStyles } from '../../../ui/hooks/useTitlesStyles';
import { INTERIORS_MIN_ZOOM, MAX_ZOOM, RASTER_TILE_SIZE } from '../constants';
import { PlacesContext } from '../contexts/PlacesContext';
import { usePlaceCategoriesMap } from '../hooks/usePlaceCategoriesMap';
import { BuildingScreen } from '../screens/BuildingScreen';
import { EventPlacesScreen } from '../screens/EventPlacesScreen';
import { FreeRoomsScreen } from '../screens/FreeRoomsScreen';
import { IndicationsScreen } from '../screens/IndicationsScreen';
import { ItineraryScreen } from '../screens/ItineraryScreen';
import { MapSelectionScreen } from '../screens/MapSelectionScreen';
import { PlaceScreen } from '../screens/PlaceScreen';
import { PlacesScreen } from '../screens/PlacesScreen';
import { NavField, NavigationPlaceType } from '../types';
import { createMapNavigator } from './MapNavigator';

export type PlacesStackParamList = {
  Places: {
    categoryId?: string;
    subCategoryId?: string;
    pitch?: number;
  };
  Place: {
    placeId: string;
    isCrossNavigation?: boolean;
    long?: string | null;
    lat?: string | null;
    name?: string;
  };
  EventPlaces: {
    placeIds: string[];
    eventName?: string;
    isCrossNavigation?: boolean;
  };
  Building: {
    siteId: string;
    buildingId: string;
  };
  Indications: {
    fromPlace?: NavigationPlaceType;
    toPlace?: NavigationPlaceType;
  };
  MapSelection: {};
  Itinerary: {
    pathFeat: NavigationResponse;
    startRoom: string;
    destRoom: string;
  };
  PlaceCategories: undefined;
  MessagesModal: undefined;
  FreeRooms: undefined;
};

const Map = createMapNavigator();

const MapDefaultContent = () => {
  const theme = useTheme();
  const colorScheme = useMemo(() => (theme.dark ? 'dark' : 'light'), [theme]);
  const { floorId } = useContext(PlacesContext);
  const categories = usePlaceCategoriesMap();
  const images = useMemo<Record<string, ImageURISource>>(
    () =>
      categories
        ? Object.fromEntries(
            [
              ...new Set(
                Object.values(categories)
                  .map(c => c.markerUrl)
                  .filter(notNullish),
              ),
            ].map(uri => [uri, { uri }]),
          )
        : {},
    [categories],
  );

  return (
    <>
      <UserLocation />

      {/* Marker images */}
      <Images images={images} />

      {/* Outdoor map */}
      <RasterSource
        key={`outdoorSource:${colorScheme}`}
        id="outdoorSource"
        tileUrlTemplates={[
          `https://app.didattica.polito.it/tiles/${colorScheme}/{z}/{x}/{y}.png`,
        ]}
        tileSize={RASTER_TILE_SIZE}
        maxZoomLevel={MAX_ZOOM}
      >
        <RasterLayer
          id="outdoor"
          aboveLayerID="background"
          style={{ rasterOpacity: 1 }}
        />
      </RasterSource>

      {/* Indoor map */}
      <RasterSource
        key={`indoorSource:${colorScheme}:${floorId}`}
        id="indoorSource"
        tileUrlTemplates={[
          `https://app.didattica.polito.it/tiles/int-${colorScheme}-${floorId?.toLowerCase()}/{z}/{x}/{y}.png`,
        ]}
        tileSize={RASTER_TILE_SIZE}
        minZoomLevel={INTERIORS_MIN_ZOOM}
        maxZoomLevel={MAX_ZOOM}
      >
        <RasterLayer
          id="indoor"
          aboveLayerID="outdoor"
          style={{ rasterOpacity: 1 }}
        />
      </RasterSource>
    </>
  );
};

type UnreadMessageModalProps = NativeStackNavigationProp<
  PlacesStackParamList,
  'MessagesModal',
  undefined
>;
interface PlacesNavigatorProps {
  unreadMessagesModal: ComponentType<any>;
}

export const PlacesNavigator = ({
  unreadMessagesModal,
}: PlacesNavigatorProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [floorId, setFloorId] = useState<string>();
  const [selectedSegmentId, setSelectedSegmentId] = useState<number>();
  const [selectionMode, setSelectionMode] = useState<boolean>(false);
  const [selectedPlace, setSelectedPlace] = useState<PlaceOverview | null>(
    null,
  );
  const [navSelectorRoom, setNavSelectorRoom] = useState<NavField | null>(null);
  const [avoidStairs, setAvoidStairs] = useState<boolean>(false);

  const checkAndSetFloorId = (id?: string) => {
    if (id) {
      setFloorId(id);
    }
  };

  const handleSelectSegment = (index: number, floor: string) => {
    if (selectedSegmentId === index) {
      setSelectedSegmentId(index);
    } else {
      setSelectedSegmentId(index);
      checkAndSetFloorId(floor);
    }
  };

  const handleSelectedPlace = (place: PlaceOverview | null) => {
    if (place) {
      setSelectedPlace(place);
    } else setSelectedPlace(null);
  };

  useEffect(() => {
    const perm = Platform.select({
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    });
    if (perm) request(perm).catch(console.error);
  }, []);

  return (
    <PlacesContext.Provider
      value={{
        floorId,
        setFloorId: checkAndSetFloorId,
        selectedSegmentId,
        setSelectedSegmentId,
        selectionMode,
        setSelectionMode,
        handleSelectSegment,
        selectedPlace,
        setSelectedPlace: handleSelectedPlace,
        navSelectorRoom,
        setNavSelectorRoom,
        avoidStairs,
        setAvoidStairs,
      }}
    >
      <Map.Navigator
        id="PlacesTabNavigator"
        screenOptions={{
          orientation: 'portrait',
          headerBackButtonDisplayMode: 'default',
          headerTransparent: true,
          headerBackground: () => (
            <View style={StyleSheet.absoluteFill}>
              <TranslucentView fallbackOpacity={1} />
              <Divider
                style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
              />
            </View>
          ),
          mapDefaultOptions: {
            camera: {
              animationDuration: 2000,
              animationMode: 'flyTo',
              maxZoomLevel: MAX_ZOOM,
            },
            attributionEnabled: false,
            compassEnabled: false,
            styleJSON: JSON.stringify({
              version: 8,
              glyphs:
                'https://app.didattica.polito.it/maps_fonts/{fontstack}/{range}.pbf',
              sources: {},
              layers: [],
            }),
          },
          mapDefaultContent: MapDefaultContent,
          ...useTitlesStyles(theme),
        }}
      >
        <Map.Screen
          name="Places"
          component={PlacesScreen}
          options={{ title: t('placesScreen.title') }}
          getId={({ params }: { params: any }) =>
            [params?.categoryId, params?.subCategoryId].join()
          }
        />
        <Map.Screen
          name="Place"
          component={PlaceScreen}
          options={{
            title: t('placeScreen.title'),
          }}
        />
        <Map.Screen
          name="EventPlaces"
          component={EventPlacesScreen}
          options={{
            title: t('eventPlacesScreen.title'),
          }}
        />
        <Map.Screen
          name="Building"
          component={BuildingScreen}
          options={{
            title: t('common.building'),
          }}
        />
        <Map.Screen
          name="MessagesModal"
          component={unreadMessagesModal}
          options={({
            navigation,
          }: {
            navigation: UnreadMessageModalProps;
          }) => ({
            headerTitle: t('messagesScreen.title'),
            headerLargeTitle: false,
            presentation: 'modal',
            headerLeft: HeaderLogoNoProps,
            headerRight: createHeaderCloseButton(navigation),
          })}
        />
        <Map.Screen
          name="Indications"
          component={IndicationsScreen}
          options={{
            title: t('indicationsScreen.title'),
          }}
        />
        <Map.Screen
          name="MapSelection"
          component={MapSelectionScreen}
          options={{
            title: t('mapSelectionScreen.title'),
          }}
        />
        <Map.Screen
          name="Itinerary"
          component={ItineraryScreen}
          options={{
            title: t('itineraryScreen.title'),
          }}
        />
        <Map.Screen
          name="FreeRooms"
          component={FreeRoomsScreen}
          options={{
            title: t('freeRoomsScreen.title'),
          }}
        />
      </Map.Navigator>
    </PlacesContext.Provider>
  );
};
