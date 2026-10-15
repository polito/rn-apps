import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Theme, useStylesheet, useTheme } from '@polito/lib/ui';
import { useIBeaconScanner } from '@polito/react-native-ibeacon';

import { DB_BEACONS } from '../hooks/useTrilateration';

const BEACON_UUID = 'CBA5D181-DD12-46A7-A3D2-9C1C5EB1E478';

const REFRESH_INTERVAL_MS = 500;
const STALE_AFTER_MS = 2000;

/*
const PROXIMITY_LABELS: Record<number, string> = {
  0: 'Unknown',
  1: 'Immediate',
  2: 'Near',
  3: 'Far',
};
*/

interface ConfiguredBeacon {
  uuid: string;
  major: number;
  minor: number;
  name?: string;
}

export const BeaconDebugScreen = () => {
  const styles = useStylesheet(createStyles);
  const { colors } = useTheme();

  const { startScanner, stopScanner, isScanning, beacons } = useIBeaconScanner({
    uuid: BEACON_UUID,
    maxAgeMs: 10000,
    cleanupIntervalMs: 500,
  });

  const [now, setNow] = useState(Date.now());

  // Avvia lo scanner all'apertura e lo arresta allo smontaggio.
  useEffect(() => {
    startScanner();

    return () => {
      stopScanner();
    };
  }, [startScanner, stopScanner]);

  // Aggiorna il tempo trascorso dall'ultima rilevazione.
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  const getBeaconName = useCallback(
    (uuid: string, major: number, minor: number) => {
      const configured = (DB_BEACONS as ConfiguredBeacon[]).find(
        beacon =>
          beacon.uuid.toLowerCase() === uuid.toLowerCase() &&
          beacon.major === major &&
          beacon.minor === minor,
      );

      return configured?.name ?? `Beacon ${major}/${minor}`;
    },
    [],
  );

  const sortedBeacons = [...beacons].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Beacon Debug</Text>

        <Text style={styles.status}>
          {isScanning ? '🟢 Scanner attivo' : '🔴 Scanner fermo'}
        </Text>

        <Text style={styles.subtitle}>Beacon rilevati: {beacons.length}</Text>

        <Text style={styles.subtitle}>
          Scadenza visualizzazione: {STALE_AFTER_MS / 1000} s
        </Text>
      </View>

      {sortedBeacons.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>In attesa di rilevazioni BLE...</Text>
        </View>
      ) : (
        sortedBeacons.map(beacon => {
          const ageMs = now - beacon.timestamp;
          const isStale = ageMs < 0 || ageMs > STALE_AFTER_MS;

          //const proximity = PROXIMITY_LABELS[beacon.proximity] ?? 'Unknown';

          const distanceAvailable =
            Number.isFinite(beacon.proximity) && beacon.proximity >= 0;

          return (
            <View
              key={`${beacon.uuid}-${beacon.major}-${beacon.minor}`}
              style={styles.card}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.beaconName}>
                  {getBeaconName(beacon.uuid, beacon.major, beacon.minor)}
                </Text>

                <View
                  style={[
                    styles.indicator,
                    {
                      backgroundColor: isStale
                        ? colors.errorCardText
                        : colors.surface,
                    },
                  ]}
                />
              </View>

              <Text style={styles.detail}>UUID: {beacon.uuid}</Text>

              <Text style={styles.detail}>
                Major: {beacon.major} · Minor: {beacon.minor}
              </Text>

              <View style={styles.metrics}>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>RSSI</Text>
                  <Text style={styles.metricValue}>{beacon.rssi} dBm</Text>
                </View>

                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Distanza</Text>
                  <Text style={styles.metricValue}>
                    {distanceAvailable
                      ? `${beacon.proximity.toFixed(2)} m`
                      : 'N/D'}
                  </Text>
                </View>

                {/*        
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Proximity</Text>
                  <Text style={styles.metricValue}>{proximity}</Text>
                </View>*/}
              </View>

              <View style={styles.ageContainer}>
                <Text style={styles.metricLabel}>Ultima rilevazione</Text>

                <Text
                  style={[
                    styles.ageValue,
                    {
                      color: isStale ? colors.errorCardText : colors.white,
                    },
                  ]}
                >
                  {ageMs < 0
                    ? 'Timestamp futuro'
                    : `${(ageMs / 1000).toFixed(1)} s fa`}
                </Text>
              </View>

              <Text style={styles.timestamp}>
                Timestamp: {beacon.timestamp}
              </Text>
            </View>
          );
        })
      )}
    </ScrollView>
  );
};

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 16,
      paddingBottom: 32,
    },
    header: {
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.white,
      marginBottom: 8,
    },
    status: {
      fontSize: 15,
      color: colors.white,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 13,
      color: colors.white,
      opacity: 0.7,
      marginTop: 4,
    },
    empty: {
      padding: 24,
      borderRadius: 12,
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    emptyText: {
      fontSize: 15,
      color: colors.white,
    },
    card: {
      padding: 16,
      marginBottom: 12,
      borderRadius: 12,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.white,
      gap: 8,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
    },
    beaconName: {
      flex: 1,
      fontSize: 17,
      fontWeight: 'bold',
      color: colors.white,
    },
    indicator: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    detail: {
      fontSize: 12,
      color: colors.white,
      opacity: 0.7,
    },
    metrics: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
      marginTop: 8,
    },
    metric: {
      flexGrow: 1,
      minWidth: 85,
      gap: 4,
    },
    metricLabel: {
      fontSize: 12,
      color: colors.white,
      opacity: 0.65,
    },
    metricValue: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.white,
    },
    ageContainer: {
      marginTop: 8,
      gap: 4,
    },
    ageValue: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.white,
    },
    timestamp: {
      fontSize: 11,
      color: colors.white,
      opacity: 0.5,
      marginTop: 4,
    },
  });
