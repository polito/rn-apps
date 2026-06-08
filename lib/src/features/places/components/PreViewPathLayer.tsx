import React, { useLayoutEffect } from 'react';
import { Platform } from 'react-native';
import { SharedValue } from 'react-native-reanimated';

import { courseColors } from '@polito/lib/features/courses';
import {
  NavigationResponse,
  NavigationResponseFeature,
} from '@polito/student-api-client';
import { Images, LineLayer, ShapeSource, SymbolLayer } from '@rnmapbox/maps';

import { useGetSite } from '../queries/placesHooks';
import { getCoordinatesBounds } from '../utils/getCoordinatesBounds';
import { getIcon } from '../utils/getIconPath';
import { MapNavigationProp } from './MapNavigator';
import { PlacesStackParamList } from './PlacesNavigator';

const start_selection = require('assets/icons/start_selection.png');
const destination_selection = require('assets/icons/destination_selection.png');
const up = require('assets/icons/up.png');
const down = require('assets/icons/down.png');
const start = require('assets/icons/start.png');
const destination = require('assets/icons/destination.png');
const private_access = require('assets/icons/private.png');

type Props = {
  pathFeat: NavigationResponse;
  bottomSheetHeight: SharedValue<number>;
  navigation: MapNavigationProp<PlacesStackParamList, 'Indications', undefined>;
};

export const PreViewPathLayer = ({
  pathFeat,
  bottomSheetHeight,
  navigation,
}: Props) => {
  useLayoutEffect(() => {
    if (!pathFeat?.features?.length) return;

    const coordinates = pathFeat.features.flatMap(
      (feat: NavigationResponseFeature) =>
        feat.features.geometry.coordinates as [number, number][],
    );

    if (!coordinates.length) return;

    const bounds = getCoordinatesBounds(coordinates);

    navigation.setOptions({
      mapOptions: {
        camera: {
          bounds: {
            ne: bounds.ne,
            sw: bounds.sw,
            paddingTop: 90,
            paddingLeft: 90,
            paddingRight: 90,
            paddingBottom: bottomSheetHeight.value,
          },
          animationDuration: 1200,
        },
      },
    });
  }, [pathFeat, navigation, bottomSheetHeight]);

  const floorMapNames = useGetSite('TO_CENCIT')?.floors;

  return (
    <>
      {Platform.OS === 'android' && (
        <Images
          images={{
            start_selection,
            destination_selection,
            start,
            destination,
            up,
            down,
            private_access,
          }}
        />
      )}

      {pathFeat.features.map(
        ({
          features,
          startPoint: { coordinates: startP },
          endPoint: { coordinates: endP },
          segmentId,
          isPrivate: privateSegment,
        }: NavigationResponseFeature) => (
          <React.Fragment key={`path-fragment-${segmentId}`}>
            <ShapeSource id={`line-source-${segmentId}`} shape={features}>
              <LineLayer
                id={`line-layer-${segmentId}`}
                style={{
                  lineWidth: 8,
                  lineCap: 'round' as const,
                  lineJoin: 'round' as const,
                  lineOpacity: 1,
                  lineColor:
                    courseColors[segmentId % courseColors.length].color,
                  ...(privateSegment && { lineDasharray: [2, 2] }),
                }}
              />
            </ShapeSource>
            <ShapeSource
              id={`start-point-source-${segmentId}`}
              shape={{
                type: 'FeatureCollection',
                features: [
                  {
                    type: 'Feature',
                    geometry: { type: 'Point', coordinates: startP },
                    properties: {},
                  },
                ],
              }}
            >
              <SymbolLayer
                id={`start-point-layer-${segmentId}`}
                style={{
                  ...styles.startIcon,
                  iconImage:
                    segmentId === 0
                      ? 'start_selection'
                      : !privateSegment
                        ? 'start'
                        : 'private_access',
                }}
              />
            </ShapeSource>

            <ShapeSource
              id={`end-point-source-${segmentId}`}
              shape={{
                type: 'FeatureCollection',
                features: [
                  {
                    type: 'Feature',
                    geometry: { type: 'Point', coordinates: endP },
                    properties: {},
                  },
                ],
              }}
            >
              <SymbolLayer
                id={`end-point-layer-${segmentId}`}
                style={{
                  ...styles.icon,
                  iconImage:
                    segmentId === pathFeat.features.length - 1
                      ? 'destination_selection'
                      : !privateSegment
                        ? getIcon(
                            segmentId || 0,
                            floorMapNames || [],
                            pathFeat.features,
                          )
                        : 'start',
                }}
              />
            </ShapeSource>
          </React.Fragment>
        ),
      )}
    </>
  );
};

const styles = {
  startIcon: {
    iconSize: 0.35,
    iconAllowOverlap: true,
  },
  icon: {
    iconSize: 0.45,
    iconAllowOverlap: true,
  },
};
