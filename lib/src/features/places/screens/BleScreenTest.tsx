import { useState } from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useBleFingerprinting } from '../hooks/useBleFingerPrinting';

export const BleScreenTest = () => {
  const [locationName, setLocationName] = useState('');
  const {
    isBleReady,
    isScanning,
    countdown,
    fingerprintDB,
    estimatedLocation,
    mapLocation,
    locateMe,
  } = useBleFingerprinting();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ambient Room Mapping</Text>

      {!isBleReady && (
        <Text style={styles.warning}>Waiting for Bluetooth to power on...</Text>
      )}

      {isScanning && (
        <View style={styles.scanBox}>
          <ActivityIndicator size="large" color="blue" />
          <Text style={styles.scanText}>Scanning... {countdown}s</Text>
        </View>
      )}

      {/* PHASE 1: MAPPING */}
      <View style={styles.card}>
        <Text style={styles.subtitle}>1. Offline Phase (Map Room)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Near the Window"
          value={locationName}
          onChangeText={setLocationName}
          editable={!isScanning}
        />
        <Button
          title="Save Location Fingerprint"
          onPress={() => {
            mapLocation(locationName);
            setLocationName('');
          }}
          disabled={isScanning || !isBleReady || locationName.trim() === ''}
        />
        <Text style={styles.stats}>
          Locations mapped: {fingerprintDB.length}
        </Text>
      </View>

      {/* PHASE 2: LOCATING */}
      <View style={styles.card}>
        <Text style={styles.subtitle}>2. Online Phase (Find Me)</Text>
        <Button
          title="Where am I?"
          color="green"
          onPress={locateMe}
          disabled={isScanning || !isBleReady || fingerprintDB.length === 0}
        />

        {estimatedLocation && (
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>Estimated Location:</Text>
            <Text style={styles.resultHighlight}>{estimatedLocation}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  warning: { color: 'red', textAlign: 'center', marginBottom: 10 },
  scanBox: { alignItems: 'center', marginBottom: 20 },
  scanText: { marginTop: 10, fontSize: 16, fontWeight: 'bold' },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  subtitle: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  stats: { marginTop: 10, fontSize: 12, color: 'gray', textAlign: 'center' },
  resultBox: {
    marginTop: 20,
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#e6ffe6',
    borderRadius: 8,
  },
  resultText: { fontSize: 16 },
  resultHighlight: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'green',
    marginTop: 5,
  },
});
