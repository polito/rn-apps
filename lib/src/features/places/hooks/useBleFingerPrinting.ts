import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';

import { requestBluetoothPermissions } from '../../../core/permissions/permissions.android';
import { Fingerprint } from '../types';
import { bleManager } from '../utils/bleManager';

export const useBleFingerprinting = () => {
  const [isBleReady, setIsBleReady] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [fingerprintDB, setFingerprintDB] = useState<Fingerprint[]>([]);
  const [estimatedLocation, setEstimatedLocation] = useState<string | null>(
    null,
  );

  const tempReadingsRef = useRef<Record<string, number[]>>({});

  // Listen to Bluetooth State
  useEffect(() => {
    const subscription = bleManager.onStateChange(state => {
      setIsBleReady(state === 'PoweredOn');
    }, true);
    return () => subscription.remove();
  }, []);

  // KNN Distance Calculator (Euclidean Distance)
  const calculateDistance = (
    currentScan: Record<string, number>,
    savedFingerprint: Record<string, number>,
  ) => {
    let distance = 0;
    const allMacs = new Set([
      ...Object.keys(currentScan),
      ...Object.keys(savedFingerprint),
    ]);

    allMacs.forEach(mac => {
      // Penalty for missing devices: If a device is in the map but not in the current scan,
      // we assume it has a very weak signal (-100 dBm)
      const rssi1 = currentScan[mac] || -100;
      const rssi2 = savedFingerprint[mac] || -100;
      distance += Math.pow(rssi1 - rssi2, 2);
    });

    return Math.sqrt(distance);
  };

  const runScan = useCallback(
    async (mode: 'MAP' | 'LOCATE', locationName?: string) => {
      if (!(await requestBluetoothPermissions())) return;

      if (isScanning) return;

      if (!isBleReady) {
        Alert.alert(
          'Bluetooth Not Ready',
          'Please wait for Bluetooth to initialize.',
        );
        return;
      }

      setIsScanning(true);
      setCountdown(5); // 5 seconds of scanning
      setEstimatedLocation(null);
      tempReadingsRef.current = {};

      ////console.log(`\n--- STARTING AMBIENT SCAN (${mode}) ---`);

      // SCAN ALL DEVICES (No beacon filter)
      bleManager.startDeviceScan(
        null,
        { allowDuplicates: true },
        (error, device) => {
          if (error) {
            //console.error('Scan error:', error);
            return;
          }

          // Capture everything stronger than -90 dBm
          if (device && device.id && device.rssi && device.rssi > -75) {
            if (!tempReadingsRef.current[device.id]) {
              tempReadingsRef.current[device.id] = [];
            }
            tempReadingsRef.current[device.id].push(device.rssi);
          }
        },
      );

      // Timer to stop the scan
      let currentSeconds = 5;
      const interval = setInterval(() => {
        currentSeconds--;
        setCountdown(currentSeconds);

        if (currentSeconds <= 0) {
          clearInterval(interval);
          bleManager.stopDeviceScan();
          setIsScanning(false);

          // Process Data: Average the RSSI
          const finalSignals: Record<string, number> = {};
          for (const id in tempReadingsRef.current) {
            const readings = tempReadingsRef.current[id];
            // Only keep ambient devices we saw at least 3 times in 5 seconds (filters out ghosts)
            if (readings.length >= 3) {
              const sum = readings.reduce((a, b) => a + b, 0);
              finalSignals[id] = Math.round(sum / readings.length);
            }
          }

          //console.log(
          //  `Captured ${Object.keys(finalSignals).length} stable ambient devices.`,
          //);

          if (Object.keys(finalSignals).length === 0) {
            Alert.alert(
              'Scan Failed',
              'No stable Bluetooth signals found. Try moving to a different spot.',
            );
            return;
          }

          // Handle Map vs Locate
          if (mode === 'MAP' && locationName) {
            const newFingerprint = { locationName, signals: finalSignals };
            setFingerprintDB(prev => [...prev, newFingerprint]);

            //console.log(`✅ MAPPED: ${locationName}`);
            //console.log(JSON.stringify(newFingerprint, null, 2));
            Alert.alert(
              'Success',
              `Mapped ${locationName} with ${Object.keys(finalSignals).length} devices.`,
            );
          } else if (mode === 'LOCATE') {
            if (fingerprintDB.length === 0) return;

            let bestMatch = '';
            let lowestDistance = Infinity;

            fingerprintDB.forEach(fp => {
              const distance = calculateDistance(finalSignals, fp.signals);
              /*console.log(
                `Distance to ${fp.locationName}: ${distance.toFixed(2)}`,
              );*/

              if (distance < lowestDistance) {
                lowestDistance = distance;
                bestMatch = fp.locationName;
              }
            });

            //console.log(`📍 YOU ARE AT: ${bestMatch}`);
            setEstimatedLocation(bestMatch);
          }
        }
      }, 1000);
    },
    [isScanning, isBleReady, fingerprintDB],
  );

  return {
    isBleReady,
    isScanning,
    countdown,
    fingerprintDB,
    estimatedLocation,
    mapLocation: (name: string) => runScan('MAP', name),
    locateMe: () => runScan('LOCATE'),
  };
};
