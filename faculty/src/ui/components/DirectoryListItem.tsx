import { JSX } from 'react';
import { TouchableHighlightProps } from 'react-native';

import { faFolder } from '@fortawesome/free-regular-svg-icons';

import { useTheme } from '../hooks/useTheme';
import { Icon } from './Icon';
import { ListItem } from './ListItem';

interface Props {
  title: string | JSX.Element;
  subtitle?: string | JSX.Element;
  trailingItem?: JSX.Element;
}

export const DirectoryListItem = (props: TouchableHighlightProps & Props) => {
  const { palettes } = useTheme();

  return (
    <ListItem
      leadingItem={
        <Icon icon={faFolder} size={24} color={palettes.secondary[500]} />
      }
      isAction
      {...props}
    />
  );
};
