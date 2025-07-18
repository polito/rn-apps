import { TouchableHighlightProps } from 'react-native';

import { faFolder } from '@fortawesome/free-regular-svg-icons';
import { Icon } from '../../ui/components/Icon';
import { ListItem } from '../../ui/components/ListItem';
import { useTheme } from '../../ui/hooks/useTheme';
import { JSX } from 'react';
import React from 'react';

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