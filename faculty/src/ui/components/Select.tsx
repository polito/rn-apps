import { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { Platform } from 'react-native';

import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

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
          isAction
          disabled={disabled}
          title={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text>{displayedValue || label}</Text>
              {Platform.OS === 'android' ? (
                <Icon
                  icon={faChevronDown}
                  style={{ marginLeft: 10 }}
                  size={14}
                />
              ) : null}
            </View>
          }
          subtitle={description}
        />
      </StatefulMenuView>
    </Pressable>
  );
};
