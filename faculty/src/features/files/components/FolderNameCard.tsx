import { RefObject } from 'react';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { CreateFolderIcon, Text, Theme, useStylesheet } from '@polito/lib/ui';

type Props = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  inputRef: RefObject<TextInput | null>;
  onFocus?: () => void;
  onBlur?: () => void;
  onPress?: () => void;
  onPressIn?: () => void;
  placeholder?: string;
  placeholderTextColor?: string;
  selectionColor?: string;
  cursorColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
  leadingContainerStyle?: StyleProp<ViewStyle>;
  leadingIconColor?: string;
  activeOpacity?: number;
  inputProps?: Omit<TextInputProps, 'ref' | 'value' | 'onChangeText'>;
};

export const FolderNameCard = ({
  label,
  value,
  onChangeText,
  inputRef,
  onFocus,
  onBlur,
  onPress,
  onPressIn,
  placeholder,
  placeholderTextColor,
  selectionColor,
  cursorColor,
  containerStyle,
  labelStyle,
  inputStyle,
  leadingContainerStyle,
  leadingIconColor,
  activeOpacity = 1,
  inputProps,
}: Props) => {
  const styles = useStylesheet(createStyles);

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={onPressIn}
      activeOpacity={activeOpacity}
      style={[styles.container, containerStyle]}
    >
      <View style={[styles.leading, leadingContainerStyle]}>
        <CreateFolderIcon width={20} height={20} color={leadingIconColor} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.label, labelStyle]}>{label}</Text>
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          selectionColor={selectionColor}
          cursorColor={cursorColor}
          style={[styles.input, inputStyle]}
          {...inputProps}
        />
      </View>
    </TouchableOpacity>
  );
};

const createStyles = ({
  spacing,
  shapes,
  fontFamilies,
  fontSizes,
  fontWeights,
}: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 60,
      borderRadius: shapes.lg,
      overflow: 'hidden',
    },
    leading: {
      width: 46,
      height: '100%',
      paddingLeft: spacing[4],
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      flex: 1,
      paddingLeft: spacing[4],
      justifyContent: 'center',
      overflow: 'hidden',
    },
    label: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.normal,
      lineHeight: 21,
    },
    input: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.medium,
      padding: 0,
    },
  });
