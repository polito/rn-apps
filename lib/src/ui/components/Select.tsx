import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { faChevronDown, faEllipsis } from '@fortawesome/free-solid-svg-icons';

import { IS_ANDROID } from '../../core/constants';
import { useStylesheet } from '../hooks/useStylesheet';
import { useTheme } from '../hooks/useTheme';
import { Theme } from '../types/Theme';
import { Icon } from './Icon';
import { ListItem } from './ListItem';
import { StatefulMenuView } from './StatefulMenuView';
import { Text } from './Text';

interface DropdownOption {
  id: string;
  title: string;
  image?: string;
  imageColor?: string;
  state?: 'off' | 'on' | 'mixed' | undefined;
}

interface Props {
  options: DropdownOption[];
  onSelectOption?: (id: string) => void;
  value?: string;
  label: string;
  description?: string;
  disabled?: boolean;
  accessibilityLabel?: string;
  hideChevron?: boolean;
  compact?: boolean;
  ellipsis?: boolean;
}

export const Select = ({
  options,
  accessibilityLabel,
  onSelectOption,
  value,
  label,
  description,
  disabled,
  hideChevron,
  compact = false,
  ellipsis = false,
}: Props) => {
  const displayedValue = useMemo(() => {
    return options?.find(opt => opt?.id === value)?.title;
  }, [options, value]);
  const styles = useStylesheet(createStyles);
  const { fontSizes, palettes, shapes } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
    >
      <StatefulMenuView
        style={{ width: '100%' }}
        title={label}
        actions={!disabled ? options : []}
        onPressAction={({ nativeEvent: { event } }) => {
          !disabled && onSelectOption?.(event);
        }}
      >
        {compact || ellipsis ? (
          <ListItem
            disabled={disabled}
            style={styles.compactContainer}
            title={
              ellipsis ? (
                <View style={styles.compactRow}>
                  <Icon
                    icon={faEllipsis}
                    size={shapes.xl}
                    color={palettes.primary[400]}
                  />
                </View>
              ) : (
                <View style={styles.compactRow}>
                  <Text style={styles.compactText}>
                    {displayedValue || label}
                  </Text>
                  {!hideChevron && (
                    <Icon
                      icon={faChevronDown}
                      style={styles.compactIcon}
                      color={palettes.primary[400]}
                      size={fontSizes.md}
                    />
                  )}
                </View>
              )
            }
            subtitle={description}
          />
        ) : (
          <ListItem
            isAction
            disabled={disabled}
            title={displayedValue || label}
            subtitle={description}
            trailingItem={
              hideChevron ? (
                <View />
              ) : IS_ANDROID ? (
                <Icon icon={faChevronDown} />
              ) : undefined
            }
          />
        )}
      </StatefulMenuView>
    </Pressable>
  );
};

const createStyles = ({
  spacing,
  palettes,
  fontSizes,
  fontFamilies,
  fontWeights,
}: Theme) =>
  StyleSheet.create({
    compactContainer: {
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: spacing[2.5],
    },
    compactRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    compactText: {
      color: palettes.primary[400],
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
      fontFamily: fontFamilies.title,
    },
    compactIcon: {
      marginLeft: spacing[2.5],
    },
  });
