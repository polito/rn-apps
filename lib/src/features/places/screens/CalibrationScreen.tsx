import {
  Alert,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import { Theme } from '@polito/lib/ui';
import { useStylesheet } from '@polito/lib/ui';
import { useIBeaconCalibrator } from '@polito/react-native-ibeacon';

const BEACON_UUID = 'CBA5D181-DD12-46A7-A3D2-9C1C5EB1E478';

export const CalibrationScreen = () => {
  const { startCalibration, isCalibrating, averageRssi, timeLeft, calibrationError } = useIBeaconCalibrator();
  const styles = useStylesheet(createStyles);

  const handleStart = async () => {
    try {
      // Ascolta per 10 secondi (10000 ms)
      const result = await startCalibration(BEACON_UUID, 10000);
      Alert.alert("Terminato", `Il VERO TxPower (a 1 metro) è: ${result.toFixed(1)} dBm`);
    } catch (error: any) {
      Alert.alert("Errore", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Calibrazione RSSI</Text>
          <Text style={styles.subtitle}>
            Calcola la potenza media del segnale per configurare il beacon.
          </Text>
        </View>

        {/* Istruzioni */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Come procedere:</Text>
          <View style={styles.stepContainer}>
            <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>1</Text></View>
            <Text style={styles.stepText}>Posiziona il dispositivo a ESATTAMENTE 1 metro dal beacon.</Text>
          </View>
          <View style={styles.stepContainer}>
            <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>2</Text></View>
            <Text style={styles.stepText}>Premi il pulsante qui sotto e resta fermo per 10 secondi.</Text>
          </View>
        </View>

        {/* Mostra gli errori se ci sono */}
        {calibrationError && (
          <Text style={styles.errorText}>
            {calibrationError}
          </Text>
        )}

        {/* Pulsante di avvio e Loading */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, isCalibrating && styles.disabledButton]}
            onPress={handleStart}
            disabled={isCalibrating}
          >
            {isCalibrating ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ActivityIndicator color={styles.primaryButtonText.color} style={{ marginRight: 10 }} />
                <Text style={styles.primaryButtonText}>Acquisizione in corso... {timeLeft}s</Text>
              </View>
            ) : (
              <Text style={styles.primaryButtonText}>Inizia Misurazione</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Risultato finale */}
        {averageRssi !== null && !isCalibrating && (
          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>Valore misurato:</Text>
            <Text style={styles.statusValueCalibrated}>{averageRssi.toFixed(1)} dBm</Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background, 
    },
    container: {
      padding: 24,
    },
    header: {
      marginBottom: 30,
      marginTop: 10,
    },
    title: {
      fontSize: 28,
      fontWeight: '800',
      color: colors.title, 
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.secondaryText,
      lineHeight: 22,
    },
    card: {
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: 20,
      shadowColor: colors.surfaceDark,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
      marginBottom: 30,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.title,
      marginBottom: 16,
    },
    stepContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    stepBadge: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    stepBadgeText: {
      color: colors.title,
      fontWeight: 'bold',
      fontSize: 14,
    },
    stepText: {
      flex: 1,
      fontSize: 15,
      color: colors.secondaryText,
      lineHeight: 20,
    },
    statusContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.background,
      padding: 16,
      borderRadius: 12,
      marginBottom: 24,
      marginTop: 20,
    },
    statusLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.title,
    },
    statusValueCalibrated: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.white, 
    },
    statusValueDefault: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.secondaryText,
    },
    errorText: {
      color: colors.errorCardText,
      textAlign: 'center',
      marginBottom: 20,
      fontWeight: '500',
    },
    actionsContainer: {
      marginTop: 10,
    },
    primaryButton: {
      backgroundColor: colors.background,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 4,
    },
    disabledButton: {
      backgroundColor: colors.disableTitle,
    },
    primaryButtonText: {
      color: colors.title,
      fontSize: 16,
      fontWeight: '700',
    },
    secondaryButton: {
      backgroundColor: colors.translucentSurface,
      borderWidth: 1.5,
      borderColor: colors.errorCardText,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    secondaryButtonText: {
      color: colors.errorCardText,
      fontSize: 16,
      fontWeight: '600',
    },
  });