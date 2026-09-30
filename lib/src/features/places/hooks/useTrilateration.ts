import { useEffect, useRef, useState } from 'react';
import { useIBeaconScanner } from '@polito/react-native-ibeacon';

// BEACON DATABASE
export const DB_BEACONS = [
  {
    uuid: 'CBA5D181-DD12-46A7-A3D2-9C1C5EB1E478',
    major: 15,
    minor: 30,
    lat: 45.061993,
    lng: 7.661547,
  }, 
  {
    uuid: 'CBA5D181-DD12-46A7-A3D2-9C1C5EB1E478',
    major: 12,
    minor: 40,
    lat: 45.061969,
    lng: 7.66154,
  },
    /*{
    uuid: 'CBA5D181-DD12-46A7-A3D2-9C1C5EB1E478',
    major: 1,
    minor: 1,
    lat: 45.061969,
    lng: 7.66154,
  }, //BEACON FEDERICO*/
  {
    uuid: 'BEA_STAMPANTE',
    major: 10,
    minor: 28,
    lat: 45.061942,
    lng: 7.661606,
  },
];

const BUFFER_SIZE = 5; //   Reduced to 5 for a better positioning

export function useRealTimePositioning() {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [isScanning, setIsScanning] = useState(false);

  // Buffering proximity field of the iBeacon type
  const distanceBuffer = useRef<Record<string, number[]>>({});

  const {
    startScanner,
    stopScanner,
    isScanning: scannerIsScanning,
    beacons,
  } = useIBeaconScanner();

  const getBeaconKey = (uuid: string, major: number, minor: number) => {
    return `${uuid.toUpperCase()}-${major}-${minor}`;
  };

  //Starting buffering
  useEffect(() => {
    distanceBuffer.current = {};
    DB_BEACONS.forEach(beacon => {
      const key = getBeaconKey(beacon.uuid, beacon.major, beacon.minor);
      distanceBuffer.current[key] = [];
    });
  }, []);

  // Synchronizing scan state
  useEffect(() => {
    setIsScanning(scannerIsScanning);
  }, [scannerIsScanning]);

  useEffect(() => {
    if (!beacons || beacons.length === 0) return;

    beacons.forEach(beacon => {
      // We skip non valid proximity distances
      if (beacon.proximity === undefined || beacon.proximity <= 0) return;

      const beaconUuid = beacon.uuid.toUpperCase();
      const beaconMajor = Number(beacon.major);
      const beaconMinor = Number(beacon.minor);

      const dbBeacon = DB_BEACONS.find(
        candidate =>
          candidate.uuid.toUpperCase() === beaconUuid &&
          candidate.major === beaconMajor &&
          candidate.minor === beaconMinor,
      );

      if (!dbBeacon) return;

      const key = getBeaconKey(beaconUuid, beaconMajor, beaconMinor);

      if (!distanceBuffer.current[key]) {
        distanceBuffer.current[key] = [];
      }

      distanceBuffer.current[key].push(beacon.proximity);
      if (distanceBuffer.current[key].length > BUFFER_SIZE) {
        distanceBuffer.current[key].shift();
      }
    });
  }, [beacons]);

  useEffect(() => {
    const interval = setInterval(() => {
      const activeBeacons: Array<(typeof DB_BEACONS)[number] & { distance: number }> = [];

      DB_BEACONS.forEach(beacon => {
        const key = getBeaconKey(beacon.uuid, beacon.major, beacon.minor);
        const readings = distanceBuffer.current[key];
        if (!readings || readings.length === 0) return;

        const sum = readings.reduce((total, dist) => total + dist, 0);
        const avgDistance = sum / readings.length;

        activeBeacons.push({
          ...beacon,
          distance: avgDistance,
        });
      });

      if (activeBeacons.length < 2) return;

      let sumLat = 0;
      let sumLng = 0;
      let sumWeights = 0;

      activeBeacons.forEach(beacon => {
        const weight = 1 / (Math.pow(beacon.distance, 2) + 0.001);

        sumLat += beacon.lat * weight;
        sumLng += beacon.lng * weight;
        sumWeights += weight;
      });

      if (sumWeights > 0) {
        setUserLocation({
          lat: sumLat / sumWeights,
          lng: sumLng / sumWeights,
        });
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const startTracking = (uuidToTrack: string = 'CBA5D181-DD12-46A7-A3D2-9C1C5EB1E478') => {
    if (scannerIsScanning) return;
    
    Object.keys(distanceBuffer.current).forEach(key => {
      distanceBuffer.current[key] = [];
    });
    
    startScanner(uuidToTrack);
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