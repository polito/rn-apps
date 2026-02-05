import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Button,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import {
  faArrowLeft,
  faFilePdf,
  faPen,
} from '@fortawesome/free-solid-svg-icons';
import {
  Badge,
  CtaButton,
  IconButton,
  Row,
  Section,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useCourses } from '../../core/contexts/CoursesContext';
import { ProfileStackParamList } from './ServiceNavigator';

export const SignatureScreen = () => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { selectedDoc, updateTbsDocStatus } = useCourses();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { spacing } = useTheme();

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <IconButton
          icon={faArrowLeft}
          size={22}
          onPress={() => navigation.navigate('DigitalSignature')}
        />
      ),
      headerTitle: () => (
        <Text
          variant="heading"
          style={{
            textAlign: 'center',
            width: '100%',
            marginLeft: Platform.OS === 'android' ? -25 : -55,
          }}
        >
          {t('other.digitalSignature')}
        </Text>
      ),
    });
  }, [navigation, t]);

  if (!selectedDoc) return null;

  const getBadgeColors = (signers: number) => {
    switch (signers) {
      case 1:
        return { backgroundColor: '#D4EDDA', foregroundColor: '#155724' };
      default:
        return { backgroundColor: '#FFF3CD', foregroundColor: '#856404' };
    }
  };

  const { backgroundColor, foregroundColor } = getBadgeColors(
    selectedDoc.numberOfSignatures,
  );

  return (
    <>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Section>
          <Row style={{ alignItems: 'center' }}>
            <View style={{ flex: 2 }}>
              <Text
                variant="heading"
                style={styles.TitleText}
                numberOfLines={2}
              >
                {selectedDoc?.title}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'flex-end',
                paddingRight: spacing[4],
              }}
            >
              {selectedDoc.status === 'firmato' ? (
                <Badge
                  text={
                    selectedDoc.numberOfSignatures === 1
                      ? t('other.completedSigns')
                      : t('other.waitingForSigns')
                  }
                  backgroundColor={backgroundColor}
                  foregroundColor={foregroundColor}
                />
              ) : (
                <View />
              )}
            </View>
          </Row>

          <View style={{ marginBottom: spacing[4] }} />

          <Text style={styles.dateText}>
            {t('other.uploadedBy')} {selectedDoc?.uploadedBy}
          </Text>
        </Section>
      </ScrollView>

      <CtaButton
        title={t('other.showPrev')}
        style={{ marginBottom: -5 }}
        absolute={false}
        variant="outlined"
        icon={faFilePdf}
        action={() => {
          Alert.alert('Anteprima', 'Funzione non ancora implementata.');
        }}
      />

      {selectedDoc.status === 'da firmare' ? (
        <CtaButton
          title={t('other.sign')}
          action={() => {
            Alert.alert(t('other.confirm'), t('other.alertSignature'), [
              { text: t('common.cancel'), style: 'cancel' },
              {
                text: t('other.confirm'),
                onPress: () => setShowOtpModal(true),
              },
            ]);
          }}
          absolute={false}
          variant="filled"
          icon={faPen}
        />
      ) : (
        <View />
      )}

      {/* OTP & PIN Modal */}
      <Modal visible={showOtpModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text variant="heading">Inserisci OTP e PIN</Text>

            <TextInput
              placeholder="OTP"
              keyboardType="numeric"
              style={styles.input}
              value={otp}
              onChangeText={setOtp}
              maxLength={4}
            />

            <TextInput
              placeholder="PIN"
              keyboardType="numeric"
              style={styles.input}
              value={pin}
              onChangeText={setPin}
              secureTextEntry
              maxLength={4}
            />

            <View style={styles.modalButtons}>
              <Button title="Annulla" onPress={() => setShowOtpModal(false)} />
              <View style={{ width: 10 }} />
              <Button
                title={t('other.verify')}
                onPress={() => {
                  if (otp === '1234' && pin === '1234') {
                    updateTbsDocStatus(selectedDoc.id, 'firmato');
                    setShowOtpModal(false);
                    navigation.navigate('DigitalSignature');
                  } else {
                    Alert.alert(t('other.error'), t('other.OTPPIN'));
                  }
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const createStyles = ({ colors, palettes, spacing }: Theme) =>
  StyleSheet.create({
    TitleText: {
      fontSize: 20,
      marginTop: spacing[4],
      marginLeft: spacing[4],
    },
    dateText: {
      fontSize: 16,
      color: palettes.gray[500],
      marginTop: spacing[1],
      marginLeft: spacing[4],
    },
    input: {
      borderWidth: 1,
      borderColor: palettes.gray[300],
      borderRadius: 8,
      padding: 10,
      marginTop: 12,
      fontSize: 16,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: undefined,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      backgroundColor: colors.white,
      padding: 20,
      borderRadius: 10,
      width: '80%',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 20,
    },
  });
