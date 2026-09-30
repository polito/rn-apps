import { useEffect, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { useScreenTitle } from '@polito/lib/core';
import { useStylesheet, useTheme } from '@polito/lib/ui';
import { Theme } from '@polito/lib/ui';
import { CircleLayer, ShapeSource } from '@rnmapbox/maps';

import { MapScreenProps } from '../components/MapNavigator';
import { PlacesStackParamList } from '../components/PlacesNavigator';
import {
  DB_BEACONS,
  useRealTimePositioning,
} from '../hooks/useTrilateration';

type Props = MapScreenProps<PlacesStackParamList, 'BLETest'>;

export const BeaconTestScreen = ({ navigation }: Props) => {
  const styles = useStylesheet(createStyles);
  const { t } = useTranslation();
  const { colors } = useTheme();

  const { userLocation, isScanning ,startTracking } = useRealTimePositioning();

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    if (!parent) return;

    parent.setOptions({
      tabBarStyle: { display: 'none' },
    });

    return () =>
      parent.setOptions({
        tabBarStyle: undefined,
      });
  }, [navigation]);

  useScreenTitle(t('itineraryScreen.title'));

  useEffect(() => {
    startTracking();
  }, [startTracking]);

 useLayoutEffect(() => {
  navigation.setOptions({
    mapContent: () => (
      <>
        {DB_BEACONS.map((b, index) => (
          <ShapeSource
            key={`BEA_${index}`}
            id={`BEA_${index}`}
            shape={{
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [b.lng, b.lat],
              },
              properties: {},
            }}
          >
            <CircleLayer
              id={`BEA_${index}_CIRCLE`}
              style={{circleColor: colors.black}}
            />
          </ShapeSource>
        ))}

        {userLocation && (
          <ShapeSource
            id="USR_location"
            shape={{
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [userLocation.lng, userLocation.lat],
              },
              properties: {},
            }}
          >
            <CircleLayer
              id="USR_DOT"
              style={{circleColor: colors.yellow}}
            />
          </ShapeSource>
        )}
      </>
    ),
  });
}, [navigation, userLocation, styles, colors]);


  return (
    <View style={styles.container}>
      <View style={styles.panel}>
        <Text style={styles.title}>Test Trilaterazione Real-Time</Text>
        <Text>Stato: {isScanning ? '🟢 In scansione...' : '🔴 Fermo'}</Text>

        {userLocation ? (
          <Text style={styles.coords}>
            Lat: {userLocation.lat.toFixed(6)}
            {'\n'}
            Lng: {userLocation.lng.toFixed(6)}
          </Text>
        ) : (
          <Text style={styles.coords}>In attesa di segnale dai beacon...</Text>
        )}
      </View>
    </View>
  );
};

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    panel: {
      padding: 20,
      backgroundColor: colors.background,
      paddingBottom: 40,
    },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    coords: { fontFamily: 'monospace', marginTop: 10, color: colors.black },
  });
