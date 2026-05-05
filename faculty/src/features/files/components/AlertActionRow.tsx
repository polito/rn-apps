import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { Text, Theme, useStylesheet } from '@polito/lib/ui';

type Props = {
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  textColor: string;
  separatorColor: string;
  style?: StyleProp<ViewStyle>;
};

export const AlertActionRow = ({
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
  textColor,
  separatorColor,
  style,
}: Props) => {
  const styles = useStylesheet(createStyles);

  return (
    <View style={[styles.actions, { borderTopColor: separatorColor }, style]}>
      <TouchableOpacity onPress={onCancel} style={styles.action}>
        <Text style={[styles.cancelText, { color: textColor }]}>
          {cancelLabel}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onConfirm}
        style={[
          styles.action,
          {
            borderLeftWidth: StyleSheet.hairlineWidth,
            borderLeftColor: separatorColor,
          },
        ]}
      >
        <Text style={[styles.confirmText, { color: textColor }]}>
          {confirmLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = ({ fontFamilies, fontWeights }: Theme) =>
  StyleSheet.create({
    actions: {
      flexDirection: 'row',
      borderTopWidth: StyleSheet.hairlineWidth,
    },
    action: {
      flex: 1,
      minHeight: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
    confirmText: {
      fontFamily: fontFamilies.body,
      fontSize: 17,
      fontStyle: 'normal',
      fontWeight: fontWeights.semibold,
      lineHeight: 22,
      letterSpacing: -0.43,
    },
    cancelText: {
      fontFamily: fontFamilies.body,
      fontSize: 17,
      fontStyle: 'normal',
      fontWeight: fontWeights.normal,
      lineHeight: 22,
      letterSpacing: -0.43,
    },
  });
