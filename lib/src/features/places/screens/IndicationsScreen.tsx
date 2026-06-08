import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Keyboard, View } from 'react-native';
import { ActivityIndicator, Image, TextInput } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

import {
  faLocationDot,
  faMagnifyingGlassLocation,
  faMapPin,
} from '@fortawesome/free-solid-svg-icons';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { notNullish } from '@polito/lib/core';
import { EmptyState } from '@polito/lib/ui';
import { Icon } from '@polito/lib/ui';
import { IndentedDivider } from '@polito/lib/ui';
import { ListItem } from '@polito/lib/ui';
import { useTheme } from '@polito/lib/ui';
import { GlobalStyles } from '@polito/lib/ui';
import { BottomSheet as BottomSheetUI } from '@polito/lib/ui';
import { PlaceOverview } from '@polito/student-api-client';

import { debounce } from 'lodash';

import { useFeedbackContext } from '../../../core/contexts/FeedbackContext';
import { useScreenTitle } from '../../../core/hooks/useScreenTitle';
import { ItineraryPlanner } from '../components/ItineraryPlanner';
import { MapScreenProps } from '../components/MapNavigator';
import { MarkersLayer } from '../components/MarkersLayer';
import { PlacesStackParamList } from '../components/PlacesNavigator';
import { PreViewPathLayer } from '../components/PreViewPathLayer';
import { PlacesContext } from '../contexts/PlacesContext';
import { useGetCurrentCampus } from '../hooks/useGetCurrentCampus';
import { useNavigationPlaces, useSearchPlaces } from '../hooks/useSearchPlaces';
import { useGetPath, useGetPlaces } from '../queries/placesHooks';
import { NavField } from '../types';

type Props = MapScreenProps<PlacesStackParamList, 'Indications'>;

export const IndicationsScreen = ({ navigation, route }: Props) => {
  const { t } = useTranslation();
  const { dark } = useTheme();
  const campus = useGetCurrentCampus();
  const {
    setSelectedSegmentId,
    setSelectionMode,
    selectedPlace,
    setSelectedPlace,
    navSelectorRoom,
    setNavSelectorRoom,
    avoidStairs,
    setAvoidStairs,
  } = useContext(PlacesContext);
  const [_screenHeight, setScreenHeight] = useState(
    Dimensions.get('window').height,
  );
  const bottomDim = useSharedValue<number>(0);

  const [privatePaths, setPrivatePaths] = useState<boolean>(false);

  const { fromPlace: startRoom, toPlace: destRoom } = route.params;

  const [searchStart, setSearchStart] = useState(startRoom?.namePlace || '');
  const [searchDest, setSearchDest] = useState(destRoom?.namePlace || '');

  const { setFeedback } = useFeedbackContext();
  const [_isFeedbackVisible, setFeedbackVisible] = useState(false);
  const [bottomSheetHeight, setBottomSheetHeight] = useState<number>(0);

  const [debouncedSearch, setDebouncedSearch] = useState('');

  const dummyInputRef = useRef<TextInput>(null); //for managing some behaviours of the keyboard in Android

  const { fontSizes, spacing, palettes } = useTheme();

  const { data: sitePlaces, isLoading: isSearchLoading } = useSearchPlaces({
    search: debouncedSearch,
    siteId: campus?.id,
  });
  const { data: listPlaces, isLoading } = useGetPlaces({
    siteId: campus?.id,
  });
  const innerRef = useRef<BottomSheet>(null);

  const handleRoom = useCallback(
    (place: PlaceOverview | undefined, roomSelectionType: NavField) => {
      if (roomSelectionType === 'start') {
        if (place)
          navigation.setParams({
            fromPlace: {
              placeId: place.id,
              namePlace: place?.room.name
                ? place.room.name
                : place?.category.name,
            },
          });
        else navigation.setParams({ fromPlace: undefined });
      } else {
        if (place)
          navigation.setParams({
            toPlace: {
              placeId: place.id,
              namePlace: place?.room.name
                ? place.room.name
                : place?.category.name,
            },
          });
        else navigation.setParams({ toPlace: undefined });
      }
    },
    [navigation],
  );

  const handleSwitchRooms = useCallback(() => {
    setSearchStart(searchDest || '');
    setSearchDest(searchStart || '');

    navigation.setParams({
      fromPlace: destRoom || undefined,
      toPlace: startRoom || undefined,
    });
  }, [searchStart, searchDest, startRoom, destRoom, navigation]);

  const provideFeedback = useCallback(() => {
    setFeedbackVisible(true);
    setFeedback({
      text: t('indicationsScreen.pathNotFound'),
      isPersistent: false,
      action: {
        label: t('common.ok'),
        onPress: () => {
          setPrivatePaths(false);
          setNavSelectorRoom(null);
          setFeedbackVisible(false);
        },
      },
    });
  }, [setFeedback, setNavSelectorRoom, t]);

  const { filteredPlaces: places } = useNavigationPlaces({
    siteId: campus?.id,
  });

  const { data: pathFeat, isLoading: isLoadingPath } = useGetPath({
    startPlaceId: startRoom?.placeId || null,
    destPlaceId: destRoom?.placeId || null,
    avoidStairs: avoidStairs,
    generateFeedback: provideFeedback,
  });

  useEffect(() => {
    if (startRoom?.placeId && destRoom?.placeId) {
      if (pathFeat?.features.length === 0) provideFeedback();
    }
  }, [isLoadingPath, pathFeat, provideFeedback, startRoom, destRoom]);

  useEffect(() => {
    if (pathFeat && pathFeat.features.length > 0) {
      setFeedbackVisible(false); //closes automatically the feedback if it's still visible
      setPrivatePaths(pathFeat.features.some((f: any) => f.isPrivate));
    }
  }, [pathFeat]);

  const renderMapContent = useCallback(() => {
    if (pathFeat && pathFeat.features.length > 0) {
      return (
        <PreViewPathLayer
          pathFeat={pathFeat}
          bottomSheetHeight={bottomDim}
          navigation={navigation}
        />
      );
    }

    if (!pathFeat) {
      return (
        <MarkersLayer
          places={places}
          directSelection={!startRoom && destRoom ? 'start' : 'destination'}
        />
      );
    }

    return null;
  }, [places, pathFeat, bottomDim, startRoom, destRoom, navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      mapContent: renderMapContent,
    });
  }, [navigation, renderMapContent]);

  const allPlaces = useMemo(() => {
    const list = listPlaces?.data ?? [];
    return list
      .map(fr => {
        const place = sitePlaces?.find(p => p.id === fr.id) as PlaceOverview;
        if (
          !place ||
          place.category.name === 'Scale' ||
          place.category.name === 'Ascensori'
        )
          return null;

        if (debouncedSearch && debouncedSearch.length > 0) {
          if (place.room) {
            if (
              !place.room.name ||
              !place.room.name.toLowerCase().includes(debouncedSearch)
            ) {
              return null;
            }
          } else {
            if (
              !place.category.name ||
              place.category.name.toLowerCase().includes(debouncedSearch)
            ) {
              return null;
            }
          }
        }

        return { ...fr, ...place };
      })
      ?.filter(notNullish);
  }, [listPlaces?.data, debouncedSearch, sitePlaces]);

  type PlaceItem = {
    type: 'place';
    place: PlaceOverview;
  };

  const placeSelectorList = useMemo(() => {
    if (!navSelectorRoom) return [];
    return [
      ...(allPlaces ?? []).map(p => ({ type: 'place', place: p }) as PlaceItem),
    ] as PlaceItem[];
  }, [allPlaces, navSelectorRoom]);

  const triggerSearch = useMemo(
    () =>
      debounce(
        (searchTerm: string) =>
          setDebouncedSearch(searchTerm.trim().toLowerCase()),
        300,
      ),
    [],
  );

  const backActionAndroid = useCallback(() => {
    if (navSelectorRoom) {
      if (navSelectorRoom === 'start') {
        setSearchStart(debouncedSearch);
      }
      if (navSelectorRoom === 'destination') {
        setSearchDest(debouncedSearch);
      }
      handleRoom(undefined, navSelectorRoom);

      setNavSelectorRoom(null);
      return false;
    }

    setSelectionMode(true);
    navigation.goBack();

    return true;
  }, [
    navSelectorRoom,
    setNavSelectorRoom,
    setSelectionMode,
    navigation,
    handleRoom,
    debouncedSearch,
  ]);

  useEffect(() => {
    if (navSelectorRoom) {
      innerRef.current?.expand();
      return;
    }

    if (pathFeat) {
      if (privatePaths && pathFeat.stairsCount > 0) {
        innerRef.current?.snapToIndex(2);
      } else {
        innerRef.current?.snapToIndex(1);
      }

      return;
    }

    if (bottomSheetHeight === 0) {
      innerRef.current?.snapToIndex(0);
    }
  }, [navSelectorRoom, pathFeat, privatePaths, bottomSheetHeight]);

  const handleItemPress = useCallback(
    (item: PlaceItem) => {
      const itemName = item.place.room.name ?? t('common.untitled');
      if (navSelectorRoom) {
        if (navSelectorRoom === 'start') {
          setSearchStart(itemName);
        } else if (navSelectorRoom === 'destination') {
          setSearchDest(itemName);
        }
        handleRoom(item.place, navSelectorRoom);
      }
      setNavSelectorRoom(null);
    },
    [navSelectorRoom, setNavSelectorRoom, t, handleRoom],
  );

  const renderItem = useCallback(
    ({ item }: { item: PlaceItem }) => {
      return (
        <ListItem
          leadingItem={
            item.place.category.markerUrl ? (
              <Image
                source={{ uri: item.place.category.markerUrl }}
                width={30}
                height={30}
              />
            ) : (
              <Icon icon={faMapPin} size={fontSizes['2xl']} />
            )
          }
          title={item.place.room.name ?? t('common.untitled')}
          subtitle={`${item.place.category.name} - ${item.place.floor.name}`}
          onPress={() => {
            Keyboard.dismiss();
            handleItemPress(item);
          }}
        />
      );
    },
    [handleItemPress, fontSizes, t],
  );

  const listHeader = useMemo(() => {
    return (
      <View>
        <ItineraryPlanner
          searchStart={searchStart}
          searchDest={searchDest}
          distance={pathFeat?.totDistance || 0}
          stairs={pathFeat?.stairsCount || 0}
          elevators={pathFeat?.elevatorsCount || 0}
          steps={pathFeat?.stepsCount || 0}
          privatePaths={privatePaths}
          avoidStairs={avoidStairs}
          isLoadingPath={isLoadingPath}
          dark={dark}
          setSearchStart={setSearchStart}
          setSearchDest={setSearchDest}
          handleRoom={handleRoom}
          handleDebouncedSearch={setDebouncedSearch}
          handleSwitchRooms={handleSwitchRooms}
          setAvoidStairs={setAvoidStairs}
          triggerSearch={triggerSearch}
          clearStatistics={() => {
            setPrivatePaths(false);
            setNavSelectorRoom(null);
          }}
          showItinerary={() => {
            if (
              startRoom?.placeId &&
              destRoom?.placeId &&
              pathFeat?.features.length
            ) {
              setSelectedSegmentId(0);
              navigation.navigate('Itinerary', {
                pathFeat: pathFeat,
                startRoom: startRoom.placeId,
                destRoom: destRoom.placeId,
              });
            }
          }}
        />
        {navSelectorRoom && (
          <ListItem
            leadingItem={
              <Icon
                icon={faLocationDot}
                color={dark ? palettes.lightBlue[400] : palettes.lightBlue[700]}
                size={fontSizes['2xl']}
              />
            }
            title={t('indicationsScreen.mapSelectorItem')}
            onPress={() => {
              setSelectionMode(true);
              navigation.navigate('MapSelection', {});
            }}
          />
        )}
      </View>
    );
  }, [
    searchStart,
    searchDest,
    pathFeat,
    privatePaths,
    avoidStairs,
    isLoadingPath,
    dark,
    handleRoom,
    handleSwitchRooms,
    setAvoidStairs,
    triggerSearch,
    navSelectorRoom,
    palettes.lightBlue,
    fontSizes,
    t,
    setNavSelectorRoom,
    startRoom?.placeId,
    destRoom?.placeId,
    setSelectedSegmentId,
    navigation,
    setSelectionMode,
  ]);

  useEffect(() => {
    if (!selectedPlace) return;

    if (navSelectorRoom) {
      handleRoom(selectedPlace, navSelectorRoom);
      if (navSelectorRoom === 'start') {
        setSearchStart(
          selectedPlace?.room.name
            ? selectedPlace.room.name
            : selectedPlace?.category.name,
        );
      } else if (navSelectorRoom === 'destination') {
        setSearchDest(
          selectedPlace?.room.name
            ? selectedPlace.room.name
            : selectedPlace?.category.name,
        );
      }

      setNavSelectorRoom(null);
      setDebouncedSearch('');
      //setSelectionMode(false);
      setSelectedPlace(null);
    }
  }, [
    selectedPlace,
    handleRoom,
    navSelectorRoom,
    setNavSelectorRoom,
    setSelectionMode,
    setDebouncedSearch,
    setSelectedPlace,
    setSearchStart,
    setSearchDest,
  ]);

  useScreenTitle(t('indicationsScreen.title'));

  return (
    <View
      style={GlobalStyles.grow}
      pointerEvents="box-none"
      onLayout={({
        nativeEvent: {
          layout: { height },
        },
      }) => setScreenHeight(height)}
    >
      <TextInput
        ref={dummyInputRef}
        style={{ width: 0, height: 0, opacity: 0, position: 'absolute' }}
        editable={true}
      />

      <BottomSheetUI
        ref={innerRef}
        //index={0}
        snapPoints={['33%', '55%', '62%', '100%']}
        onChange={index => {
          setBottomSheetHeight(index);
        }}
        onClose={backActionAndroid}
        animatedPosition={bottomDim}
      >
        <BottomSheetFlatList<PlaceItem>
          data={placeSelectorList}
          keyExtractor={(item: PlaceItem, index: number) =>
            `${item.place.id ?? index}`
          }
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          ItemSeparatorComponent={IndentedDivider}
          ListEmptyComponent={
            isLoading || isSearchLoading ? (
              <ActivityIndicator style={{ marginVertical: spacing[8] }} />
            ) : navSelectorRoom ? (
              <EmptyState
                message={t('placesScreen.noPlacesFound')}
                icon={faMagnifyingGlassLocation}
              />
            ) : null
          }
          ListHeaderComponent={listHeader}
        />
      </BottomSheetUI>
    </View>
  );
};
