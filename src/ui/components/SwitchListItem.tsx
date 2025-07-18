import { ListItem, ListItemProps } from './ListItem';
import { Switch } from './Switch';
import { Text } from './Text';
import { useTheme } from '../../ui/hooks/useTheme';
import React from 'react';

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
  const { fontSizes } = useTheme();

  return (
    <ListItem
      title={
        <Text
          accessible={false}
          variant="title"
          style={{
            fontSize: fontSizes.md,
          }}
          weight="normal"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
      }
      onPress={() => {
        onChange?.(!value);
      }}
      trailingItem={
        <Switch
          value={value ?? false}
          disabled={disabled}
          onChange={() => {
            onChange?.(!value);
          }}
        />
      }
      disabled={disabled}
      {...rest}
    />
  );
};