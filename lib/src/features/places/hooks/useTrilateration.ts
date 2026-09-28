import { useEffect, useRef, useState } from 'react';

//import { parseIBeacon } from '../utils/parseIBeaconData';

// Il tuo singleton

// 1. IL DATABASE DEI BEACON
// Sostituisci lat e lng con le coordinate Mapbox reali della tua stanza
export const DB_BEACONS = [
  {
    uuid: '00A82381-B393-4AA3-893F-8ED7F01E8966',
    lat: 45.061993,
    lng: 7.661547,
    txPower: -59,
  }, //BEACON GIACOMO
  {
    uuid: '7F65CFA2-CB2C-4D2A-A488-8B79B96047E7',
    lat: 45.061969,
    lng: 7.66154,
    txPower: -59,
  }, //BEACON FEDERICO
  {
    uuid: '07DA29F7-3A6C-46CB-920C-8386273FC84E',
    lat: 45.061918,
    lng: 7.661676,
    txPower: -59,
  }, //BEACON GIUSEPPE
  // { uuid: 'BEA_STAMPANTE', lat: 45.061942, lng: 7.661606 }, //BEACON STAMPANTE (mio telefono)
];

export function useRealTimeTrilateration() {
  const [userLocation, _setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Buffer per la Media Mobile: memorizza gli ultimi N valori RSSI per ogni beacon
  const rssiBuffer = useRef<Record<string, number[]>>({});

  useEffect(() => {
    // Buffer setup
    DB_BEACONS.forEach(b => {
      rssiBuffer.current[b.uuid] = [];
    });
  }, []);

  const startTracking = () => {
    setIsScanning(true);

    // 1. ACCENDI LO SCANNER
    /*
    bleManager.startDeviceScan(
      null,
      { scanMode: ScanMode.LowLatency, allowDuplicates: true },
      (error, device) => {
        if (error) return;

        // Se il dispositivo ha un nome e fa parte dei nostri beacon (BEA_A, BEA_B, BEA_C)
        if (device && device.manufacturerData && device.rssi) {
          const beacon = parseIBeacon(device.manufacturerData, device.rssi);

          if (!beacon) return;
          if (rssiBuffer.current[beacon.uuid]) {
            // Aggiungi il nuovo RSSI all'array (teniamo solo gli ultimi 10 valori per averlo reattivo ma stabile)
            rssiBuffer.current[beacon.uuid].push(device.rssi ?? 0);

            if (rssiBuffer.current[beacon.uuid].length > 10) {
              rssiBuffer.current[beacon.uuid].shift(); // Rimuovi il più vecchio
            }
          }
        }
      },
    );

    // 2. IL MOTORE DI CALCOLO (Gira ogni 500 millisecondi)
    const interval = setInterval(() => {
      const activeBeacons: any[] = [];

      DB_BEACONS.forEach(beacon => {
        const readings = rssiBuffer.current[beacon.uuid];
        if (readings && readings.length > 0) {
          // Calcola la media dell'RSSI
          const sum = readings.reduce((a, b) => a + b, 0);
          const avgRssi = sum / readings.length;

          // Converti in Metri
          // Usiamo n=2.5 come fattore di decadimento standard per una stanza
          const distance = Math.pow(
            10,
            (beacon.txPower - avgRssi) / (10 * 2.5),
          );

          activeBeacons.push({ ...beacon, distance });
        }
      });

      // Se vediamo almeno 2 beacon, calcoliamo la posizione
      if (activeBeacons.length >= 2) {
        let sumLat = 0;
        let sumLng = 0;
        let sumWeights = 0;

        activeBeacons.forEach(b => {
          // Peso = inverso della distanza al quadrato
          const weight = 1 / (Math.pow(b.distance, 2) + 0.001);
          sumLat += b.lat * weight;
          sumLng += b.lng * weight;
          sumWeights += weight;
        });

        setUserLocation({
          lat: sumLat / sumWeights,
          lng: sumLng / sumWeights,
        });
      }
    }, 500);

    // Salva l'ID dell'intervallo nel ref per pulirlo dopo se necessario
    return () => {
      clearInterval(interval);
      bleManager.stopDeviceScan();
      setIsScanning(false);
    };*/
  };

  /*  const stopTracking = () => {
    bleManager.stopDeviceScan();
    setIsScanning(false);
  };*/

  return { userLocation, isScanning, startTracking /*stopTracking*/ };
}
