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
  return (
    <ListItem
      title={title}
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
