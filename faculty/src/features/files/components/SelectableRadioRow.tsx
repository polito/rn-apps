import { ReactNode } from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faCircleDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Text, Theme, useStylesheet } from '@polito/lib/ui';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
  leading?: ReactNode;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  leadingContainerStyle?: StyleProp<ViewStyle>;
  trailingColor: string;
  radioSize?: number;
  labelNumberOfLines?: number;
};

export const SelectableRadioRow = ({
  label,
  selected,
  onPress,
  leading,
  disabled = false,
  containerStyle,
  labelStyle,
  leadingContainerStyle,
  trailingColor,
  radioSize = 16,
  labelNumberOfLines,
}: Props) => {
  const styles = useStylesheet(createStyles);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ checked: selected, disabled }}
      style={[styles.container, containerStyle]}
    >
      {leading ? (
        <View style={[styles.leading, leadingContainerStyle]}>{leading}</View>
      ) : null}
      <View style={styles.content}>
        <Text
          numberOfLines={labelNumberOfLines}
          style={[styles.label, labelStyle]}
        >
          {label}
        </Text>
      </View>
      <View style={styles.trailing}>
        <FontAwesomeIcon
          icon={selected ? faCircleDot : faCircle}
          size={radioSize}
          color={trailingColor}
        />
      </View>
    </TouchableOpacity>
  );
};

const createStyles = ({
  spacing,
  fontFamilies,
  fontSizes,
  fontWeights,
}: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      overflow: 'hidden',
    },
    leading: {
      paddingLeft: spacing[4],
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    content: {
      flex: 1,
      paddingLeft: spacing[4],
      justifyContent: 'center',
      overflow: 'hidden',
    },
    label: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.medium,
      lineHeight: 24,
    },
    trailing: {
      width: 24,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
  });
