import { useEffect, useState } from 'react';

import { ListItem, ListItemProps } from './ListItem';
import { Switch } from './Switch';

interface Props extends ListItemProps {
  title: string;
  value?: boolean;
  onChange?: (value: boolean) => void;
}

export const SwitchListItem = ({
  title,
  value,
  onChange,
  disabled,
  ...rest
}: Props) => {
  const [checked, setChecked] = useState(value ?? false);

  useEffect(() => {
    setChecked(value ?? false);
  }, [value]);

  const toggle = () => {
    const next = !checked;
    setChecked(next);
    onChange?.(next);
  };

  return (
    <ListItem
      title={title}
      onPress={toggle}
      trailingItem={
        <Switch
          value={checked}
          disabled={disabled}
          onChange={toggle}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
      }
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityState={{ checked, disabled: !!disabled }}
      {...rest}
    />
  );
};
