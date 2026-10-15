import { useEffect, useRef, useState } from 'react';

import { useIBeaconScanner } from '@polito/react-native-ibeacon';

const UUID_TO_TRACK = 'CBA5D181-DD12-46A7-A3D2-9C1C5EB1E478'; // UUID of the iBeacons to track

// BEACON DATABASE
export const DB_BEACONS = [
  {
    name: 'BEACON_GIACOMO',
    uuid: UUID_TO_TRACK,
    major: 15,
    minor: 30,
    lat: 45.061993,
    lng: 7.661547,
  } /*Giacomo*/,
  {
    name: 'BEACON_TOME',
    uuid: UUID_TO_TRACK,
    major: 12,
    minor: 40,
    lat: 45.062001,
    lng: 7.661591,
  } /*Tomé */,
  {
    name: 'BEACON_FEDERICO',
    uuid: UUID_TO_TRACK,
    major: 42,
    minor: 118,
    lat: 45.061969,
    lng: 7.66154,
  } /*Federico */,
  {
    name: 'BEACON_STAMPANTE',
    uuid: UUID_TO_TRACK,
    major: 10,
    minor: 28,
    lat: 45.061942,
    lng: 7.661606,
  } /*Stampante*/,
];

const BUFFER_SIZE = 5; //   Reduced to 5 for a better positioning

//Stampati i beacon che trova con un riferimento temporale in modo da caprie quali stiamo effettivamente scansionando

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
  } = useIBeaconScanner({ uuid: UUID_TO_TRACK }); //da parametrizzare (default: MAX_AGE = 2000, CLEAN_UP = 500), passali come oggetto

  const getBeaconKey = (uuid: string, major: number, minor: number) => {
    return `${uuid.toUpperCase()}-${major}-${minor}`;
  };

  useEffect(() => {
    console.log('Beacons detected:', beacons);
  }, [beacons]);

  //Starting buffering
  useEffect(() => {
    distanceBuffer.current = {};
    DB_BEACONS.forEach(beacon => {
      const key = getBeaconKey(beacon.uuid, beacon.major, beacon.minor);
      distanceBuffer.current[key] = [];
    });
  }, [userLocation]); //to check: cambia veramente se triggerato dall'update della user Location

  // Synchronizing scan state
  useEffect(() => {
    setIsScanning(scannerIsScanning);
  }, [scannerIsScanning]);

  useEffect(() => {
    if (!beacons || beacons.length === 0) return;

    console.log('Beacons detected:', beacons);

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
      const activeBeacons: Array<
        (typeof DB_BEACONS)[number] & { distance: number }
      > = [];

      DB_BEACONS.forEach(beacon => {
        const key = getBeaconKey(beacon.uuid, beacon.major, beacon.minor);
        const readings = distanceBuffer.current[key];
        if (!readings || readings.length === 0) return;

        const sum = readings.reduce((total, dist) => total + dist, 0);
        const avgDistance = sum / readings.length;

        activeBeacons.push({
          ...beacon,
          distance: readings[readings.length - 1], // Use the most recent reading
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

  const startTracking = (uuidToTrack: string = UUID_TO_TRACK) => {
    if (scannerIsScanning) return;

    Object.keys(distanceBuffer.current).forEach(key => {
      distanceBuffer.current[key] = [];
    });

    startScanner(); //da definire un interval in modo da fare un re-render in base al tempo che decido
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
