import { StyleSheet, ViewStyle } from 'react-native';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '@polito/lib/ui';

import { useStylesheet } from '../hooks/useStylesheet';
import { Theme } from '../types/Theme';
import { ActivityIndicator } from './ActivityIndicator';
import { Icon } from './Icon';
import { IconButton } from './IconButton';
import { Row } from './Row';
import { TextField, TextFieldProps } from './TextField';

export interface TranslucentTextFieldProps extends TextFieldProps {
  leadingIcon?: IconDefinition;
  isClearable?: boolean;
  onClear?: () => void;
  onClearLabel?: string;
  containerStyle?: ViewStyle;
  isLoading?: boolean;
}

export const TranslucentTextField = ({
  containerStyle,
  style,
  inputStyle,
  leadingIcon,
  isClearable,
  onClear,
  onClearLabel,
  isLoading,
  ...props
}: TranslucentTextFieldProps) => {
  const styles = useStylesheet(createStyles);
  const { fontSizes, palettes } = useTheme();
  return (
    <Row
      style={[styles.container, containerStyle]}
      align="center"
      justify="center"
    >
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        leadingIcon && (
          <Icon
            icon={leadingIcon}
            color={palettes.gray[500]}
            style={styles.icon}
            size={fontSizes.md}
          />
        )
      )}
      <TextField
        clearButtonMode="never"
        {...props}
        style={[styles.textField, style]}
        inputStyle={[styles.input, inputStyle]}
      />
      {isClearable && (
        <IconButton
          noPadding
          onPress={onClear}
          icon={faTimesCircle}
          color={styles.cancelIcon.color}
          accessibilityRole="button"
          accessibilityLabel={onClearLabel}
          size={fontSizes.md}
        />
      )}
    </Row>
  );
};

const createStyles = ({ dark, palettes, spacing, fontSizes }: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: palettes.gray[200],
      borderRadius: spacing[1.5],
      paddingVertical: spacing[1],
      paddingHorizontal: spacing[2], //spacing[2] seems more accurate wrt the design
      gap: spacing[2], //spacing[2] seems more accurate wrt the design
    },
    textField: {
      flex: 1,
      paddingVertical: 0,
      fontSize: fontSizes.md,
    },
    icon: {
      color: palettes.gray[500],
    },
    input: {
      paddingVertical: 0,
      margin: 0,
      paddingLeft: 0,
      paddingRight: spacing[2],
      borderBottomWidth: 0,
    },
    cancelIcon: {
      color: dark ? palettes.gray[400] : palettes.gray[500],
    },
  });
