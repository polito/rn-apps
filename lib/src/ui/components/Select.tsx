import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

import { useTheme } from '../../ui/hooks/useTheme';
import { useStylesheet } from '../hooks/useStylesheet';
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
}

export const Select = ({
  options,
  accessibilityLabel,
  onSelectOption,
  value,
  label,
  description,
  disabled,
}: Props) => {
  const displayedValue = useMemo(() => {
    return options?.find(opt => opt?.id === value)?.title;
  }, [options, value]);
  const styles = useStylesheet(createStyles);
  const { fontSizes, palettes } = useTheme();

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
        <ListItem
          disabled={disabled}
          style={styles.selectorContainer}
          title={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.text}>{displayedValue || label}</Text>
              <Icon
                icon={faChevronDown}
                style={styles.icon}
                color={palettes.primary[400]}
                size={fontSizes.md}
              />
            </View>
          }
          subtitle={description}
        />
      </StatefulMenuView>
    </Pressable>
  );
};

const createStyles = ({ spacing, palettes, fontSizes }: Theme) =>
  StyleSheet.create({
    icon: {
      marginLeft: spacing[2.5],
    },
    text: {
      color: palettes.primary[400],
      fontSize: fontSizes.sm,
      fontWeight: '500',
      fontFamily: 'Montserrat-Medium',
    },
    selectorContainer: {
      height: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: spacing[2.5],
      color: palettes.primary[400],
    },
  });
