import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { Text, Theme, useStylesheet, useTheme } from '@polito/lib/ui';
import { BlurView } from '@react-native-community/blur';

import { AlertActionRow } from './AlertActionRow';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export const DownloadOverwriteModal = ({
  visible,
  title,
  message,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
}: Props) => {
  const { colors, dark, palettes } = useTheme();
  const styles = useStylesheet(createStyles);
  const alertSeparatorColor = dark
    ? 'rgba(255, 255, 255, 0.22)'
    : 'rgba(128, 128, 128, 0.55)';
  const alertCardBackground = dark
    ? `${palettes.gray[800]}D9`
    : 'rgba(179,179,179,0.82)';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <Pressable
        style={[styles.backdrop, { backgroundColor: `${colors.black}40` }]}
        onPress={onCancel}
      >
        <Pressable
          style={[styles.card, { backgroundColor: alertCardBackground }]}
          onPress={() => {}}
        >
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType={dark ? 'dark' : 'xlight'}
            blurAmount={25}
            reducedTransparencyFallbackColor={
              dark ? palettes.gray[800] : palettes.gray[200]
            }
          />
          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.body}>{message}</Text>
          </View>
          <AlertActionRow
            cancelLabel={cancelLabel}
            confirmLabel={confirmLabel}
            textColor={colors.readMore}
            separatorColor={alertSeparatorColor}
            onCancel={onCancel}
            onConfirm={onConfirm}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const createStyles = ({
  spacing,
  shapes,
  colors,
  fontFamilies,
  fontWeights,
}: Theme) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing[8],
    },
    card: {
      width: 270,
      borderRadius: shapes.xl,
      overflow: 'hidden',
    },
    content: {
      paddingHorizontal: spacing[4],
      paddingTop: 19,
      paddingBottom: 15,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 2,
    },
    title: {
      color: colors.heading,
      textAlign: 'center',
      fontFamily: fontFamilies.body,
      fontSize: 17,
      fontStyle: 'normal',
      fontWeight: '600',
      lineHeight: 22,
      letterSpacing: -0.43,
    },
    body: {
      color: colors.heading,
      textAlign: 'center',
      fontFamily: fontFamilies.body,
      fontSize: 13,
      fontStyle: 'normal',
      fontWeight: fontWeights.normal,
      lineHeight: 18,
      letterSpacing: -0.08,
    },
  });
