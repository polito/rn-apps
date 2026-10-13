import { ReactNode } from 'react';
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';

import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faCircleDot } from '@fortawesome/free-solid-svg-icons';
import { Icon, ListItem } from '@polito/lib/ui';

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
}: Props) => (
  <ListItem
    title={label}
    titleStyle={labelStyle}
    titleProps={{ numberOfLines: labelNumberOfLines }}
    onPress={onPress}
    disabled={disabled}
    // Disabled state is already expressed through the caller's muted colors
    style={{ opacity: 1 }}
    containerStyle={containerStyle}
    accessibilityRole="radio"
    accessibilityLabel={label}
    accessibilityState={{ checked: selected, disabled }}
    leadingItem={
      leading ? <View style={leadingContainerStyle}>{leading}</View> : undefined
    }
    trailingItem={
      <Icon
        icon={selected ? faCircleDot : faCircle}
        size={radioSize}
        color={trailingColor}
      />
    }
  />
);
