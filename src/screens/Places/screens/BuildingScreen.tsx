import { useContext, useEffect, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Linking, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  faDiamondTurnRight,
  faSignsPost,
} from '@fortawesome/free-solid-svg-icons';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { ActivityIndicator } from '../../../ui/components/ActivityIndicator';
import { BottomSheet } from '../../../ui/components/BottomSheet';
import { Col } from '../../../ui/components/Col';
import { EmptyState } from '../../../ui/components/EmptyState';
import { IconButton } from '../../../ui/components/IconButton';
import { ListItem } from '../../../ui/components/ListItem';
import { OverviewList } from '../../../ui/components/OverviewList';
import { Section } from '../../../ui/components/Section';
import { SectionHeader } from '../../../ui/components/SectionHeader';
import { Text } from '../../../ui/components/Text';
import { useStylesheet } from '../../../ui/hooks/useStylesheet';
import { useTheme } from '../../../ui/hooks/useTheme';
import { Theme } from '../../../ui/types/Theme';
import { ResponseError } from '@polito/api-client/runtime';
import { useHeaderHeight } from '@react-navigation/elements';
import {
  CameraBounds,
  CameraPadding,
  FillLayer,
  LineLayer,
  ShapeSource,
} from '@rnmapbox/maps';

import { Polygon } from 'geojson';

import { useScreenTitle } from '../../../core/hooks/useScreenTitle';
import { useGetBuilding, useGetSite } from '../../../core/queries/placesHooks';
import { GlobalStyles } from '../../../core/components/GlobalStyles';
import { MapScreenProps } from '../components/MapNavigator';
import { MarkersLayer } from '../components/MarkersLayer';
import { PlacesStackParamList } from '../components/PlacesNavigator';
import { PlacesContext } from '../contexts/PlacesContext';
import { useGetCurrentCampus } from '../hooks/useGetCurrentCampus';
import { useSearchPlaces } from '../hooks/useSearchPlaces';
import { formatPlaceCategory } from '../utils/category';
import { getCoordinatesBounds } from '../utils/getCoordinatesBounds';

type Props = MapScreenProps<PlacesStackParamList, 'Building'>;

export const BuildingScreen = ({ navigation, route }: Props) => {
  const { palettes } = useTheme();
  const styles = useStylesheet(createStyles);
  const { t } = useTranslation();
  const { fontSizes, spacing } = useTheme();
  const headerHeight = useHeaderHeight();
  const safeAreaInsets = useSafeAreaInsets();
  const { setFloorId, floorId } = useContext(PlacesContext);
  const { siteId, buildingId } = route.params;
  const campus = useGetCurrentCampus();
  const {
    data: building,
    isLoading: isLoadingBuilding,
    error: getBuildingError,
  } = useGetBuilding(siteId ?? campus?.id, buildingId);
  const site = useGetSite(siteId);
  const { data: places, isLoading: isLoadingPlaces } = useSearchPlaces({
    siteId: siteId ?? campus?.id,
    floorId: floorId,
  });
  const isLoading = isLoadingBuilding || isLoadingPlaces;
  const placeName = building?.name ?? t('common.untitled');

  useEffect(() => {
    setFloorId(undefined);
  }, [setFloorId]);

  useScreenTitle(
    (getBuildingError as ResponseError)?.response?.status === 404
      ? t('common.notFound')
      : t('placeScreen.placeDetail'),
  );

  
  useLayoutEffect(() => {
     
    if (building) {
      const { latitude, longitude } = building;
      const bounds: CameraPadding & Partial<CameraBounds> = {
        paddingTop: headerHeight,
        paddingLeft: 8,
        paddingRight: 8,
        paddingBottom: Dimensions.get('window').height / 2 - headerHeight,
      };
      if (building.geoJson?.geometry.type === 'Polygon') {
        const coordinates = (building.geoJson.geometry as Polygon).coordinates;
        if (coordinates?.length > 0) {
          const { sw, ne } = getCoordinatesBounds(
            coordinates.flat() as unknown as [number, number][],
          );
          bounds.sw = sw;
          bounds.ne = ne;
        }
      }
      navigation.setOptions({
       
                
        mapOptions: {
          camera: {
            centerCoordinate: bounds.sw ? undefined : [longitude, latitude],
            padding: bounds.sw ? undefined : bounds,
            bounds: bounds.sw ? (bounds as CameraBounds) : undefined,
            zoomLevel: bounds.sw ? undefined : 19,
          },
        },
        mapContent: () => (
          <>
            <MarkersLayer selectedPoiId={buildingId} places={places} />
            {building?.geoJson != null && (
              <ShapeSource
                id="placeHighlightSource"
                shape={building?.geoJson as any} // TODO fix incompatible types
              >
                <LineLayer
                  id="placeHighlightLine"
                  aboveLayerID="indoor"
                  style={{
                    lineColor: palettes.secondary[600],
                    lineWidth: 2,
                  }}
                />
                <FillLayer
                  id="placeHighlightFill"
                  aboveLayerID="indoor"
                  style={{
                    fillColor: `${palettes.secondary[600]}33`,
                  }}
                />
              </ShapeSource>
            )}
          </>
        ),
      });
    }
  }, [
    building,
    buildingId,
    headerHeight,
    navigation,
    palettes.secondary,
    places,
    safeAreaInsets.top,
    spacing,
  ]);

  if (isLoading) {
    return (
      <View style={GlobalStyles.grow} pointerEvents="box-none">
        <BottomSheet
        
          middleSnapPoint={50}
          handleStyle={{ paddingVertical: undefined }}
        >
          <ActivityIndicator style={{ marginVertical: spacing[8] }} />
        </BottomSheet>
      </View>
    );
  }

  if (
    getBuildingError &&
    (getBuildingError as ResponseError).response.status === 404
  ) {
    return (
      <View style={GlobalStyles.grow} pointerEvents="box-none">
        <BottomSheet
          middleSnapPoint={50}
          handleStyle={{ paddingVertical: undefined }}
        >
          <EmptyState
            message={t('placeScreen.placeNotFound')}
            icon={faSignsPost}
          />
        </BottomSheet>
      </View>
    );
  }

  if (!building) {
    return null;
  }

  return (
    <View style={GlobalStyles.grow} pointerEvents="box-none">
      <BottomSheet
        middleSnapPoint={50}
        handleStyle={{ paddingVertical: undefined }}
      >
        <BottomSheetScrollView>
          <Col ph={5} mb={5}>
            <Text variant="title" style={styles.title}>
              {placeName}
            </Text>
            <Text>{site?.name || campus?.name}</Text>
            <Text variant="caption" style={{ textTransform: 'capitalize' }}>
              {formatPlaceCategory(building?.category.name)}
            </Text>
          </Col>

          <Section>
            <SectionHeader title="Location" separator={false} />
            <OverviewList translucent>
              <ListItem
                inverted
                multilineTitle
                title={(site?.name || campus?.name) ?? '--'}
                subtitle={t('common.campus')}
                trailingItem={
                  <IconButton
                    icon={faDiamondTurnRight}
                    size={fontSizes.xl}
                    adjustSpacing="right"
                    accessibilityLabel={t('common.navigate')}
                    onPress={() => {
                      const scheme = Platform.select({
                        ios: 'maps://0,0?q=',
                        android: 'geo:0,0?q=',
                      });
                      const latLng = [
                        building?.latitude,
                        building?.longitude,
                      ].join(',');
                      const label = building?.name;
                      const url = Platform.select({
                        ios: `${scheme}${label}@${latLng}`,
                        android: `${scheme}${latLng}(${label})`,
                      })!;
                      Linking.openURL(url);
                    }}
                  />
                }
              />
            </OverviewList>
          </Section>
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
};

const createStyles = ({ fontSizes }: Theme) =>
  StyleSheet.create({
    title: {
      fontSize: fontSizes['2xl'],
    },
  });