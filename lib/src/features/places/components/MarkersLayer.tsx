import { useMemo } from 'react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { PlaceCategory, PlaceOverview } from '@polito/student-api-client';
import { useNavigation } from '@react-navigation/native';
import { Images, ShapeSource, SymbolLayer } from '@rnmapbox/maps';

import { capitalize } from 'lodash';

import { usePreferencesContext } from '../../../core/contexts/PreferencesContext';
import { notNullish } from '../../../core/utils/predicates';
import { useTheme } from '../../../ui/hooks/useTheme';
import { DEFAULT_CATEGORY_MARKER } from '../constants';
import { PlacesContext } from '../contexts/PlacesContext';
import { usePlaceCategoriesMap } from '../hooks/usePlaceCategoriesMap';
import { NavField, SearchPlace, isPlace } from '../types';

const start_selection = require('assets/icons/start_selection.png');
const destination_selection = require('assets/icons/destination_selection.png');
const up = require('assets/icons/up.png');
const down = require('assets/icons/down.png');
const start = require('assets/icons/start.png');
const destination = require('assets/icons/destination.png');
const private_access = require('assets/icons/private.png');

interface MarkersLayerProps {
  selectedPoiId?: string;
  search?: string;
  places?: SearchPlace[];
  displayFloor?: boolean;
  categoryId?: string;
  subCategoryId?: string;
  isCrossNavigation?: boolean;
  directSelection?: NavField;
}

export const MarkersLayer = ({
  selectedPoiId,
  places = [],
  displayFloor,
  categoryId,
  subCategoryId,
  search,
  isCrossNavigation = false,
  directSelection,
}: MarkersLayerProps) => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const { dark, fontSizes, colors } = useTheme();
  const placeCategoriesMap = usePlaceCategoriesMap();
  const { accessibility } = usePreferencesContext();
  const {
    selectedPlace,
    setSelectedPlace,
    navSelectorRoom,
    setNavSelectorRoom,
    selectionMode,
  } = useContext(PlacesContext);

  const selectedId = selectedPlace?.id ?? '';
  //const [selectedId, setSelectedId] = useState<string>('');

  const pois = useMemo((): (SearchPlace &
    PlaceCategory & { siteId: string })[] => {
    if (!placeCategoriesMap) return [];

    let result = places;
    if (!search) {
      result = result?.filter(
        p =>
          selectedPoiId === p.id ||
          (categoryId != null && p.category.id === categoryId) ||
          (subCategoryId != null &&
            (!p.category.subCategory?.id ||
              p.category.subCategory.id === subCategoryId)) ||
          (p.category.id === 'UFF'
            ? !!(p as PlaceOverview).room.name
            : !p.category.subCategory?.id ||
              !!placeCategoriesMap[p.category.subCategory.id]?.highlighted),
      );
    }
    if (
      accessibility?.fontSize &&
      accessibility.fontSize >= 150 &&
      selectedId
    ) {
      const selected = result.find(x => x.id === selectedId);
      if (selected) {
        const R = 6371000; // Earth radius in metres
        const degToRad = (deg: number) => (deg * Math.PI) / 180;

        result = result.filter(p => {
          if (p.id === selectedId) return true;

          const dLat = degToRad(p.latitude - selected.latitude);
          const dLon = degToRad(p.longitude - selected.longitude);
          const meanLat = degToRad((p.latitude + selected.latitude) / 2);
          const dx = dLon * Math.cos(meanLat) * R;
          const dy = dLat * R;
          const distance = Math.sqrt(dx * dx + dy * dy);

          return distance > 200;
        });
      }
    }

    return result?.map(poi => {
      const category = placeCategoriesMap[poi.category.id] ?? {};
      const subcategory = poi.category.subCategory?.id
        ? placeCategoriesMap[poi.category.subCategory.id]
        : null;
      const categoryData = {
        ...category,
        ...(subcategory ?? {}),
      };
      delete (categoryData as any).id;
      delete (categoryData as any).name;

      return {
        ...DEFAULT_CATEGORY_MARKER,
        ...poi,
        ...categoryData,
        siteId: isPlace(poi) ? poi.site.id : poi.siteId,
        priority:
          selectedPoiId === poi.id
            ? 0
            : (subcategory?.priority ?? category.priority ?? 100),
      };
    });
  }, [
    accessibility?.fontSize,
    selectedId,
    categoryId,
    placeCategoriesMap,
    places,
    search,
    selectedPoiId,
    subCategoryId,
  ]);

  if (!pois) return null;

  return (
    <ShapeSource
      id="markersSource"
      shape={{
        type: 'FeatureCollection',
        features: pois.map((p, i) => ({
          type: 'Feature',
          id: `poi-point-${p.id}`,
          properties: {
            id: p.id ?? '',
            dark,
            index: i,
            markerUrl: p.markerUrl ?? '',
            priority: p.priority ?? 100,
            name: capitalize(
              isPlace(p)
                ? [
                    p.room.name ??
                      p.category.subCategory?.name ??
                      p.category.name,
                    displayFloor
                      ? `${t('common.floor')} ${p.floor.level}`
                      : null,
                  ]
                    .filter(notNullish)
                    .join('\n')
                : capitalize(p.name ?? ''),
            ),
            color: p.color ?? '#000000',
          },
          geometry: {
            type: 'Point',
            coordinates: [p.longitude, p.latitude],
          },
        })),
      }}
      onPress={({ features }) => {
        const selectedPoi = features?.[0]
          ? pois?.[features[0].properties?.index]
          : null;

        const isAccessibleFont =
          accessibility?.fontSize && accessibility.fontSize >= 150;

        if (selectedPoi) {
          if (selectionMode && isPlace(selectedPoi)) {
            if (selectedId === selectedPoi.id) {
              setSelectedPlace(null);
              //setSelectedId('');
            } else {
              if (directSelection) {
                const screen = 'MapSelection';
                const params = {};

                const stackName = isCrossNavigation
                  ? navigation.getId() === 'AgendaTabNavigator'
                    ? 'PlacesAgendaStack'
                    : 'PlacesTeachingStack'
                  : 'PlacesTab';

                setNavSelectorRoom(directSelection);

                setSelectedPlace(selectedPoi);
                //setSelectedId(selectedPoi.id);

                navigation.navigate(stackName, {
                  screen,
                  params,
                });
              } else {
                setSelectedPlace(selectedPoi);
                //setSelectedId(selectedPoi.id);
              }
            }
          } else {
            if (isAccessibleFont) {
              // If already selected, navigate to the detail page
              if (selectedId === selectedPoi.id) {
                const screen = isPlace(selectedPoi) ? 'Place' : 'Building';
                const params =
                  screen === 'Place'
                    ? {
                        placeId: selectedPoi.id,
                        ...(isCrossNavigation && { isCrossNavigation: true }),
                      }
                    : {
                        siteId: selectedPoi.siteId,
                        buildingId: selectedPoi.id,
                      };

                const stackName = isCrossNavigation
                  ? navigation.getId() === 'AgendaTabNavigator'
                    ? 'PlacesAgendaStack'
                    : 'PlacesTeachingStack'
                  : 'PlacesTab';
                navigation.navigate(stackName, {
                  screen,
                  params,
                });
              } else {
                //setSelectedId(selectedPoi.id);
              }
            } else {
              const screen = isPlace(selectedPoi) ? 'Place' : 'Building';
              const params =
                screen === 'Place'
                  ? {
                      placeId: selectedPoi.id,
                      ...(isCrossNavigation && { isCrossNavigation: true }),
                    }
                  : {
                      siteId: selectedPoi.siteId,
                      buildingId: selectedPoi.id,
                    };

              const stackName = isCrossNavigation
                ? navigation.getId() === 'AgendaTabNavigator'
                  ? 'PlacesAgendaStack'
                  : 'PlacesTeachingStack'
                : 'PlacesTab';

              navigation.navigate(stackName, {
                screen,
                params,
              });
            }
          }
        } else if (isAccessibleFont) {
          //setSelectedId('');
        }
      }}
    >
      <Images
        images={{
          start_selection,
          destination_selection,
          up,
          down,
          start,
          destination,
          private_access,
        }}
      />
      <SymbolLayer
        id={`markers-${selectedId}`}
        key={`markers-${selectedId}`}
        aboveLayerID="indoor"
        style={{
          iconImage: [
            'case',
            ['==', ['get', 'id'], selectedId],
            (navSelectorRoom === 'start' || directSelection === 'start') &&
            selectionMode
              ? 'start_selection'
              : (navSelectorRoom === 'destination' ||
                    directSelection === 'destination') &&
                  selectionMode
                ? 'destination_selection'
                : ['get', 'markerUrl'],
            ['get', 'markerUrl'],
          ],
          iconSize: ['case', ['==', ['get', 'id'], selectedId], 0.3, 0.35],
          symbolSortKey: ['get', 'priority'],
          textField:
            accessibility?.fontSize && Number(accessibility?.fontSize) >= 150
              ? [
                  'case',
                  ['==', ['get', 'id'], ['literal', selectedId ?? '']],
                  ['get', 'name'],
                  '',
                ]
              : ['get', 'name'],
          textSize:
            accessibility?.fontSize && accessibility.fontSize < 150
              ? fontSizes['2xs']
              : fontSizes['3xl'],
          textFont: ['Open Sans Semibold'],
          textColor: ['get', 'color'],
          textOffset: [0, 1.2],
          textAnchor: 'top',
          textOptional: true,
          textAllowOverlap:
            accessibility?.fontSize && accessibility.fontSize < 150
              ? false
              : true,
          textHaloBlur: 0.5,
          textHaloColor: dark ? colors.black : colors.white,
          textHaloWidth: dark
            ? accessibility?.fontSize && accessibility.fontSize < 150
              ? 0
              : 6
            : accessibility?.fontSize && accessibility.fontSize < 150
              ? 0.8
              : 6,
        }}
      />
    </ShapeSource>
  );
};
