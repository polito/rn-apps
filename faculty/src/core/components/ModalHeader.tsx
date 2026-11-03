import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, View } from 'react-native';

import {
  Text,
  TextButton,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';

type Props = {
  title?: string;
  right?: ReactNode;
  onClose?: () => void;
};

export const ModalHeader = ({ title, right, onClose }: Props) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const styles = useStylesheet(createStyles);
  const { colors } = useTheme();

  if (Platform.OS !== 'ios') return null;

  return (
    <View style={styles.header}>
      <TextButton
        accessibilityRole="button"
        color={colors.secondaryText}
        onPress={onClose ?? (() => navigation.goBack())}
      >
        {t('common.close')}
      </TextButton>
      {title ? (
        <Text
          weight="semibold"
          style={styles.title}
          numberOfLines={1}
          pointerEvents="none"
          accessibilityRole="header"
        >
          {title}
        </Text>
      ) : null}
      <View style={styles.right}>{right}</View>
    </View>
  );
};

const createStyles = ({ colors, spacing, fontSizes }: Theme) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[2],
    },
    title: {
      position: 'absolute',
      left: spacing[20],
      right: spacing[20],
      textAlign: 'center',
      fontSize: fontSizes.md,
      color: colors.title,
    },
    right: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[2],
    },
  });
