import { Button, StyleSheet, Text, View } from 'react-native';
import { useEffect } from 'react';

import { useStylesheet } from '@polito/lib/ui';
import { Theme } from '@polito/lib/ui';
import { useIBeaconScanner } from '@polito/react-native-ibeacon'; 

import { useBeaconCalibration } from '../hooks/useBeaconCalibrationOptions'

export const BleScreenTest = () => {
  const styles = useStylesheet(createStyles);

  const { startScanner, stopScanner, isScanning, beacons } = useIBeaconScanner();

  const {
    isCalibrating,
    progress,
    sampleCount,
    result,
    startCalibration,
    stopCalibration,
    addObservation,
  } = useBeaconCalibration({
    targetUuid: 'CBA5D181-DD12-46A7-A3D2-9C1C5EB1E478',
    targetMajor: 15,
    targetMinor: 30,
    sampleCount: 60,
  });

  useEffect(() => {
    addObservation(beacons);
  }, [beacons, addObservation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ambient Room Mapping</Text>

      <View style={styles.card}>
        <Text style={styles.subtitle}> Scan Bluetooth devices</Text>
        <Button
          title={isScanning ? 'Stop' : 'Scan iBeacons'}
          onPress={() => {
            if (isScanning) {
              stopScanner();
            } else {
              startScanner('CBA5D181-DD12-46A7-A3D2-9C1C5EB1E478');
            }
          }}
        />
      </View>

            <View style={styles.card}>
        <Text style={styles.subtitle}>
          Beacon calibration
        </Text>

        <Text style={styles.texts}>
          Place the phone exactly 1 meter from the beacon.
        </Text>

        <Text style={styles.texts}>
          Samples: {progress}/{sampleCount}
        </Text>

        {!isCalibrating ? (
          <Button
            title="Calibrate txPower"
            onPress={startCalibration}
            disabled={!isScanning}
          />
        ) : (
          <Button
            title="Stop calibration"
            onPress={stopCalibration}
          />
        )}

        {result && (
          <View>
            <Text style={styles.results}>
              Beacon: {result.major}/{result.minor}
            </Text>

            <Text style={styles.results}>
              txPower: {result.txPower.toFixed(2)} dBm
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
      backgroundColor: colors.white,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
    },
    warning: {
      color: colors.white,
      textAlign: 'center',
      marginBottom: 10,
    },
    scanBox: { alignItems: 'center', marginBottom: 20 },
    scanText: { marginTop: 10, fontSize: 16, fontWeight: 'bold' },
    card: {
      backgroundColor: colors.background,
      padding: 20,
      borderRadius: 10,
      marginBottom: 20,
      shadowColor: colors.black,
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    subtitle: { fontSize: 16, fontWeight: '600', marginBottom: 10, color: colors.secondaryText },
    texts: {color: colors.white},
    results: {color: colors.errorCardText}
  });
