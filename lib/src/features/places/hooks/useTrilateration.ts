import { useEffect, useRef, useState } from 'react';

import { useIBeaconScanner } from '@polito/react-native-ibeacon';

// Il tuo singleton

// 1. IL DATABASE DEI BEACON
// Sostituisci lat e lng con le coordinate Mapbox reali della tua stanza
export const DB_BEACONS = [
  {
    uuid: 'CBA5D181-DD12-46A7-A3D2-9C1C5EB1E478',
    major: 15,
    minor: 30,
    lat: 45.061993,
    lng: 7.661547,
    txPower: -59,
  }, //BEACON GIACOMO
  {
    uuid: 'CBA5D181-DD12-46A7-A3D2-9C1C5EB1E478',
    major: 1,
    minor: 1,
    lat: 45.061969,
    lng: 7.66154,
    txPower: -59,
  }, //BEACON FEDERICO
  {
    uuid: 'CBA5D181-DD12-46A7-A3D2-9C1C5EB1E478',
    major: 1,
    minor: 1,
    lat: 45.061918,
    lng: 7.661676,
    txPower: -59,
  }, //BEACON GIUSEPPE
  {
    uuid: 'BEA_STAMPANTE',
    major: 10,
    minor: 28,
    lat: 45.061942,
    lng: 7.661606,
    txPower: -59,
  }, //BEACON STAMPANTE (mio telefono)
];

export function useRealTimeTrilateration() {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [isScanning, setIsScanning] = useState(false);

  const rssiBuffer = useRef<Record<string, number[]>>({});

  const {
    startScanner,
    stopScanner,
    isScanning: scannerIsScanning,
    beacons,
  } = useIBeaconScanner();

  const getBeaconKey = (uuid: string, major: number, minor: number) => {
    return `${uuid.toUpperCase()}-${major}-${minor}`;
  };

  useEffect(() => {
    rssiBuffer.current = {};

    DB_BEACONS.forEach(beacon => {
      const key = getBeaconKey(beacon.uuid, beacon.major, beacon.minor);

      rssiBuffer.current[key] = [];
    });
  }, []);

  useEffect(() => {
    setIsScanning(scannerIsScanning);
  }, [scannerIsScanning]);

  useEffect(() => {
    if (beacons.length === 0) {
      return;
    }

    beacons.forEach(beacon => {
      const dbBeacon = DB_BEACONS.find(
        candidate =>
          candidate.uuid.toUpperCase() === beacon.uuid.toUpperCase() &&
          candidate.major === beacon.major &&
          candidate.minor === beacon.minor,
      );

      if (!dbBeacon) {
        return;
      }

      const key = getBeaconKey(beacon.uuid, beacon.major, beacon.minor);

      if (!rssiBuffer.current[key]) {
        rssiBuffer.current[key] = [];
      }

      rssiBuffer.current[key].push(beacon.rssi);

      if (rssiBuffer.current[key].length > 10) {
        rssiBuffer.current[key].shift();
      }
    });
  }, [beacons]);

  useEffect(() => {
    const interval = setInterval(() => {
      const activeBeacons: Array<
        (typeof DB_BEACONS)[number] & {
          distance: number;
        }
      > = [];

      DB_BEACONS.forEach(beacon => {
        const key = getBeaconKey(beacon.uuid, beacon.major, beacon.minor);

        const readings = rssiBuffer.current[key];

        if (!readings || readings.length === 0) {
          return;
        }

        const sum = readings.reduce((total, rssi) => total + rssi, 0);

        const avgRssi = sum / readings.length;

        const distance = Math.pow(10, (beacon.txPower - avgRssi) / (10 * 2.5));

        activeBeacons.push({
          ...beacon,
          distance,
        });
      });

      if (activeBeacons.length < 2) {
        return;
      }

      let sumLat = 0;
      let sumLng = 0;
      let sumWeights = 0;

      activeBeacons.forEach(beacon => {
        const weight = 1 / (Math.pow(beacon.distance, 2) + 0.001);

        sumLat += beacon.lat * weight;
        sumLng += beacon.lng * weight;
        sumWeights += weight;
      });

      if (sumWeights === 0) {
        return;
      }

      setUserLocation({
        lat: sumLat / sumWeights,
        lng: sumLng / sumWeights,
      });
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const startTracking = () => {
    if (scannerIsScanning) {
      return;
    }

    const uuid = DB_BEACONS[0]?.uuid;

    if (!uuid) {
      console.warn('[iBeacon] Nessun beacon configurato');
      return;
    }

    startScanner(uuid);
  };

  const stopTracking = () => {
    stopScanner();
  };

  return {
    userLocation,
    isScanning,
    startTracking,
    stopTracking,
  };
}
