import { RefObject } from 'react';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

import { faFolder } from '@fortawesome/free-regular-svg-icons';
import {
  Col,
  Icon,
  Row,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';

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
  const { palettes } = useTheme();

  return (
    <Row
      component={TouchableOpacity}
      align="center"
      onPress={onPress}
      onPressIn={onPressIn}
      activeOpacity={activeOpacity}
      style={[styles.container, containerStyle]}
    >
      <Row
        align="center"
        justify="center"
        pl={4}
        style={[styles.leading, leadingContainerStyle]}
      >
        <Icon
          icon={faFolder}
          size={20}
          color={leadingIconColor ?? palettes.secondary[500]}
        />
      </Row>
      <Col flex={1} justify="center" pl={4} style={styles.content}>
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
      </Col>
    </Row>
  );
};

const createStyles = ({
  shapes,
  fontFamilies,
  fontSizes,
  fontWeights,
}: Theme) =>
  StyleSheet.create({
    container: {
      height: 60,
      borderRadius: shapes.lg,
      overflow: 'hidden',
    },
    leading: {
      width: 46,
      height: '100%',
    },
    content: {
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
