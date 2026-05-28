import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { ToggleFilter } from '@polito/lib/ui';

import { useStylesheet } from '../hooks/useStylesheet';
import { Option } from '../types/Input';
import { Theme } from '../types/Theme';

interface SegmentedControlProps<T> {
  options: readonly Option<T>[];
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export const SegmentedControl = <T,>({
  options,
  value,
  defaultValue,
  onChange,
  style,
  disabled,
}: SegmentedControlProps<T>) => {
  const styles = useStylesheet(createStyles);

  return (
    <View style={[styles.container, style]}>
      <ToggleFilter
        options={options}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        disabled={disabled}
      />
    </View>
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    container: {
      padding: spacing[5],
    },
  });
