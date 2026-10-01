import { useMemo } from 'react';
import { Pressable, View } from 'react-native';

import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

import { IS_ANDROID } from '../../core/constants';
import { Icon } from './Icon';
import { ListItem } from './ListItem';
import { StatefulMenuView } from './StatefulMenuView';

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
}: Props) => {
  const displayedValue = useMemo(() => {
    return options?.find(opt => opt?.id === value)?.title;
  }, [options, value]);

  return (
    <Pressable>
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
          title={displayedValue || label}
          subtitle={description}
          accessibilityLabel={accessibilityLabel || label}
          accessibilityValue={
            displayedValue ? { text: displayedValue } : undefined
          }
          trailingItem={
            hideChevron ? (
              <View />
            ) : IS_ANDROID ? (
              <Icon icon={faChevronDown} />
            ) : undefined
          }
        />
      </StatefulMenuView>
    </Pressable>
  );
};
