import { useCallback, useRef, useState } from 'react';

import type { IBeaconObservation } from '@polito/react-native-ibeacon';

interface BeaconCalibrationResult {
  uuid: string;
  major: number;
  minor: number;
  samples: number;
  txPower: number;
}

interface UseBeaconCalibrationOptions {
  targetUuid: string;
  targetMajor: number;
  targetMinor: number;
  sampleCount?: number;
}

export function useBeaconCalibration({
  targetUuid,
  targetMajor,
  targetMinor,
  sampleCount = 60,
}: UseBeaconCalibrationOptions) {
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] =
    useState<BeaconCalibrationResult | null>(null);

  const samplesRef = useRef<number[]>([]);

  const addObservation = useCallback(
    (beacons: IBeaconObservation[]) => {
      if (!isCalibrating) {
        return;
      }

      const beacon = beacons.find(
        b =>
          b.uuid.toUpperCase() === targetUuid.toUpperCase() &&
          Number(b.major) === targetMajor &&
          Number(b.minor) === targetMinor,
      );

      if (!beacon) {
        return;
      }

      samplesRef.current.push(beacon.rssi);

      const sampleNumber = samplesRef.current.length;

      setProgress(sampleNumber);

      if (sampleNumber >= sampleCount) {
        const txPower = calculateTxPower(samplesRef.current);

        const calibrationResult: BeaconCalibrationResult = {
          uuid: beacon.uuid,
          major: Number(beacon.major),
          minor: Number(beacon.minor),
          samples: sampleNumber,
          txPower,
        };

        setResult(calibrationResult);
        setIsCalibrating(false);
      }
    },
    [
      isCalibrating,
      sampleCount,
      targetMajor,
      targetMinor,
      targetUuid,
    ],
  );

  const startCalibration = useCallback(() => {
    samplesRef.current = [];

    setProgress(0);
    setResult(null);
    setIsCalibrating(true);
  }, []);

  const stopCalibration = useCallback(() => {
    setIsCalibrating(false);

    samplesRef.current = [];

    setProgress(0);
  }, []);

  return {
    isCalibrating,
    progress,
    sampleCount,
    result,
    startCalibration,
    stopCalibration,
    addObservation,
  };
}

function calculateTxPower(samples: number[]): number {
  if (samples.length === 0) {
    return NaN;
  }

  const sorted = [...samples].sort((a, b) => a - b);

  // Remove the lowest and highest 20%.
  const trimCount = Math.floor(sorted.length * 0.2);

  const filtered = sorted.slice(
    trimCount,
    sorted.length - trimCount,
  );

  const sum = filtered.reduce(
    (total, value) => total + value,
    0,
  );

  return sum / filtered.length;
}
