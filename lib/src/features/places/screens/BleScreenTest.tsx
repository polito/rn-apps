import { Button, StyleSheet, Text, View } from 'react-native';

import { useStylesheet } from '@polito/lib/ui';
import { Theme } from '@polito/lib/ui';
import { useIBeaconScanner } from '@polito/react-native-ibeacon';

export const BleScreenTest = () => {
  const styles = useStylesheet(createStyles);

  const { startScanner, stopScanner, isScanning } = useIBeaconScanner();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ambient Room Mapping</Text>

      {/* PHASE 2: LOCATING */}
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
    subtitle: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  });
