import { useTranslation } from 'react-i18next';
import { Text as RNText, StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import {
  ActivityIndicator,
  Text,
  type Theme,
  useStylesheet,
} from '@polito/lib/ui';

import { QrCodeModal } from '../../../core/components/QrCodeModal';
import { useGetSmartCardQrCode } from '../../../core/queries/studentHooks';

const QR_SIZE = 206;
/**
 * Figma card width: QR (206) plus two 18px padding layers per side (72 total) — the
 * card's own padding and the QR's inset within the content.
 */
const CARD_WIDTH = QR_SIZE + 72;

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
  const identityLabel = [lastName.toUpperCase(), firstName, degreeName]
    .filter(Boolean)
    .join(', ');

  return (
    <QrCodeModal
      visible={visible}
      onClose={onClose}
      maxWidth={CARD_WIDTH}
      showCloseButton={false}
    >
      <View
        accessible={true}
        accessibilityRole="header"
        accessibilityLabel={identityLabel}
      >
        <Text accessible={false} variant="prose" style={styles.name}>
          {lastName.toUpperCase()}
        </Text>
        <Text accessible={false} variant="prose" style={styles.name}>
          {firstName}
        </Text>
        {!!degreeName && (
          <Text accessible={false} style={styles.degree}>
            {degreeName}
          </Text>
        )}
      </View>
      <View style={styles.qrColumn}>
        <View
          style={styles.qrContainer}
          accessibilityRole="image"
          accessibilityLabel={t('profileScreen.qrCode')}
        >
          {qrCodeQuery.data ? (
            <SvgXml xml={qrCodeQuery.data} width={QR_SIZE} height={QR_SIZE} />
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
      width: QR_SIZE,
      gap: spacing[2],
    },
    qrContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: QR_SIZE,
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
