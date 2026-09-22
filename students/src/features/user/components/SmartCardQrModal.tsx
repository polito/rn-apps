import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text as RNText, StyleSheet, View } from 'react-native';
import { isTablet as isTabletHelper } from 'react-native-device-info';
import { SvgXml } from 'react-native-svg';

import {
  ActivityIndicator,
  Text,
  type Theme,
  useStylesheet,
} from '@polito/lib/ui';

import { QrCodeModal } from '../../../core/components/QrCodeModal';
import { useGetSmartCardQrCode } from '../../../core/queries/studentHooks';

const QR_SIZE_PHONE = 206;
const QR_SIZE_TABLET = 340;
/**
 * Figma card width: QR size plus two 18px padding layers per side (72 total) — the
 * card's own padding and the QR's inset within the content.
 */
const CARD_PADDING = 72;

type Props = {
  visible: boolean;
  onClose: () => void;
  firstName: string;
  lastName: string;
  degreeName?: string;
};

export const SmartCardQrModal = ({
  visible,
  onClose,
  firstName,
  lastName,
  degreeName,
}: Props) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const qrCodeQuery = useGetSmartCardQrCode(visible);
  const qrSize = useMemo(
    () => (isTabletHelper() ? QR_SIZE_TABLET : QR_SIZE_PHONE),
    [],
  );
  const cardWidth = qrSize + CARD_PADDING;

  return (
    <QrCodeModal
      visible={visible}
      onClose={onClose}
      maxWidth={cardWidth}
      showCloseButton={false}
    >
      <View>
        <Text variant="prose" style={styles.name}>
          {lastName.toUpperCase()}
        </Text>
        <Text variant="prose" style={styles.name}>
          {firstName}
        </Text>
        {!!degreeName && <Text style={styles.degree}>{degreeName}</Text>}
      </View>
      <View style={[styles.qrColumn, { width: qrSize }]}>
        <View
          style={[styles.qrContainer, { minHeight: qrSize }]}
          accessibilityLabel={t('profileScreen.qrCode')}
        >
          {qrCodeQuery.data ? (
            <SvgXml xml={qrCodeQuery.data} width={qrSize} height={qrSize} />
          ) : (
            <ActivityIndicator style={styles.qrLoader} />
          )}
        </View>
        <RNText textBreakStrategy="simple" style={styles.warning}>
          {t('profileScreen.qrWarning')}
        </RNText>
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
    degree: {
      marginTop: spacing[1],
      fontFamily: 'Montserrat-SemiBold',
      fontSize: fontSizes.xs,
      color: palettes.gray[dark ? 400 : 600],
    },
    qrColumn: {
      alignSelf: 'center',
      gap: spacing[2],
    },
    qrContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    qrLoader: {
      flex: 1,
    },
    warning: {
      textAlign: 'center',
      fontFamily: 'Montserrat-Medium',
      fontSize: fontSizes['2xs'],
      lineHeight: fontSizes['2xs'] * 1.25,
      textTransform: 'none',
      color: dark ? palettes.warning[500] : palettes.warning[700],
    },
  });
