import { useEffect, useMemo, useState } from 'react';
import {
  LayoutChangeEvent,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { useStylesheet } from '../hooks/useStylesheet';
import { Option } from '../types/Input';
import { Theme } from '../types/Theme';
import { PillButton } from './PillButton';
import { Text } from './Text';

interface ToggleFilterProps<T> {
  options: readonly Option<T>[];
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  style?: StyleProp<ViewStyle>;
  optionStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export const ToggleFilter = <T,>({
  options,
  value,
  defaultValue,
  onChange,
  style,
  optionStyle,
  disabled = false,
}: ToggleFilterProps<T>) => {
  const styles = useStylesheet(createStyles);
  const firstOptionValue = options[0]?.value;
  const [containerWidth, setContainerWidth] = useState(0); // container width used to decide between equal-width and content-width pills
  const [intrinsicContentWidth, setIntrinsicContentWidth] = useState(0); // natural width of all pills laid out at content size, used to detect overflow
  const [layoutMode, setLayoutMode] = useState<'fill' | 'intrinsic'>('fill'); // layout mode can only be 'fill' or 'intrinsic', the initial value is 'fill'
  const [internalValue, setInternalValue] = useState<T | undefined>(
    defaultValue ?? firstOptionValue,
  );

  const isControlled = value !== undefined; // determine if the component is controlled or not
  const selectedValue = isControlled ? value : internalValue; // use the controlled value if available, otherwise use internal state

  useEffect(() => {
    if (!isControlled) {
      setInternalValue(currentValue => {
        if (currentValue === undefined) {
          return defaultValue ?? firstOptionValue;
        }

        const hasSelectedOption = options.some(
          option => option.value === currentValue,
        );

        if (hasSelectedOption) {
          return currentValue;
        }

        return defaultValue ?? firstOptionValue;
      });
    }
  }, [defaultValue, firstOptionValue, isControlled, options]);

  useEffect(() => {
    setIntrinsicContentWidth(0);
  }, [options]);

  useEffect(() => {
    if (containerWidth <= 0 || intrinsicContentWidth <= 0) {
      return;
    }

    setLayoutMode(
      intrinsicContentWidth <= containerWidth ? 'fill' : 'intrinsic',
    );
  }, [containerWidth, intrinsicContentWidth]);

  const hasOptions = useMemo(() => options.length > 0, [options.length]);

  if (!hasOptions) {
    return null;
  }

  const handleSelect = (selectedOptionValue: T) => {
    if (!isControlled) {
      setInternalValue(selectedOptionValue);
    }
    onChange?.(selectedOptionValue);
  };

  const handleContainerLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const handleIntrinsicLayout = (event: LayoutChangeEvent) => {
    setIntrinsicContentWidth(event.nativeEvent.layout.width);
  };

  const renderOption = (
    option: Option<T>,
    index: number,
    forceFill: boolean,
  ) => {
    const isSelected = selectedValue === option.value;

    return (
      <PillButton
        key={`${String(option.value)}-${index}`}
        onPress={() => handleSelect(option.value)}
        variant="neutral"
        style={[
          styles.option,
          forceFill ? styles.optionFill : styles.optionIntrinsic,
          isSelected ? styles.optionSelected : styles.optionUnselected,
          optionStyle,
        ]}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected, disabled }}
      >
        <Text
          weight="medium"
          style={[
            styles.optionText,
            isSelected
              ? styles.optionTextSelected
              : styles.optionTextUnselected,
          ]}
        >
          {option.label}
        </Text>
      </PillButton>
    );
  };

  return (
    <View style={[styles.container, style]} onLayout={handleContainerLayout}>
      {layoutMode === 'fill' ? (
        <View style={styles.fillRow}>
          {options.map((option, index) => renderOption(option, index, true))}
        </View>
      ) : (
        <ScrollView
          horizontal
          bounces={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {options.map((option, index) => renderOption(option, index, false))}
        </ScrollView>
      )}

      {/* Hidden row used to measure natural content width and decide fill vs scroll. */}
      <View style={styles.measureWrapper} pointerEvents="none">
        <View style={styles.contentContainer} onLayout={handleIntrinsicLayout}>
          {options.map((option, index) => (
            <PillButton
              key={`measure-${String(option.value)}-${index}`}
              variant="neutral"
              style={[
                styles.option,
                styles.optionIntrinsic,
                styles.optionUnselected,
              ]}
            >
              <Text
                weight="medium"
                style={[styles.optionText, styles.optionTextUnselected]}
              >
                {option.label}
              </Text>
            </PillButton>
          ))}
        </View>
      </View>
    </View>
  );
};

const createStyles = ({ spacing, palettes, colors }: Theme) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: palettes.gray[200],
      borderWidth: 1,
      borderColor: palettes.gray[200],
      borderRadius: spacing[2.5] / 2,
      padding: spacing[1],
      alignSelf: 'stretch',
      width: '100%',
    },
    contentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[0.5],
    },
    fillRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[0.5],
      width: '100%',
    },
    option: {
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 0,
      paddingHorizontal: spacing[2.5],
      paddingVertical: spacing[0.5] / 2,
      borderRadius: spacing[1.5] / 2,
    },
    optionFill: {
      flex: 1,
      flexBasis: 0,
      minWidth: 0,
    },
    optionIntrinsic: {
      flexShrink: 0,
    },
    measureWrapper: {
      position: 'absolute',
      opacity: 0,
      left: -10000,
      top: -10000,
    },
    optionUnselected: {
      backgroundColor: palettes.gray[200],
    },
    optionSelected: {
      backgroundColor: colors.surface,
    },
    optionText: {
      textAlign: 'center',
    },
    optionTextUnselected: {
      color: palettes.gray[600],
      fontFamily: 'Montserrat-Regular',
    },
    optionTextSelected: {
      color: palettes.text[800],
      fontFamily: 'Montserrat-Medium',
    },
  });
