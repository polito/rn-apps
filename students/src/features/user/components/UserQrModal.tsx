import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { isTablet as isTabletHelper } from 'react-native-device-info';

import { Text, type Theme, useStylesheet } from '@polito/lib/ui';

import { QrCodeModal } from '../../../core/components/QrCodeModal';
import { QrEsc } from '../../../core/components/QrEsc.tsx';

const QR_SIZE_PHONE = 206;
const QR_SIZE_TABLET = 340;
/** Card padding allowance: two 18px padding layers per side. */
const CARD_PADDING = 72;

type Props = {
  visible: boolean;
  onClose?: () => void;
  dismissable?: boolean;
  student: {
    cognome: string;
    nome: string;
    matricola: string;
    qr: string;
  };
};

export const UserQrModal = ({
  visible,
  onClose,
  dismissable,
  student,
}: Props) => {
  const styles = useStylesheet(createStyles);
  const qrSize = useMemo(
    () => (isTabletHelper() ? QR_SIZE_TABLET : QR_SIZE_PHONE),
    [],
  );
  const cardWidth = qrSize + CARD_PADDING;

  const handleClose = () => {
    if (dismissable) {
      onClose?.();
    }
  };

  return (
    <QrCodeModal
      visible={visible}
      onClose={handleClose}
      maxWidth={cardWidth}
      showCloseButton={false}
    >
      <View>
        <Text variant="prose" style={styles.name}>
          {student.cognome.toUpperCase()}
        </Text>
        <Text variant="prose" style={styles.name}>
          {student.nome}
        </Text>
        <Text style={styles.subtitle}>polito.it - {student.matricola}</Text>
      </View>
      <View style={[styles.qrColumn, { width: qrSize }]}>
        <View style={styles.qrContainer}>
          <QrEsc qr={student.qr} width={qrSize} height={qrSize / 0.8} />
        </View>
      </View>
    </QrCodeModal>
  );
};

const createStyles = ({ dark, spacing, fontSizes, palettes }: Theme) =>
  StyleSheet.create({
    name: {
      paddingRight: spacing[8],
      fontFamily: 'Montserrat-Bold',
      fontSize: fontSizes['2xl'],
      lineHeight: fontSizes['2xl'] * 1.25,
    },
    subtitle: {
      marginTop: spacing[1],
      fontFamily: 'Montserrat-SemiBold',
      fontSize: fontSizes.xs,
      color: palettes.gray[dark ? 400 : 600],
    },
    qrColumn: {
      alignSelf: 'center',
    },
    qrContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
