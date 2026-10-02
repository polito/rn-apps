import { ReactElement } from 'react';
import { Image, StyleSheet, TouchableHighlightProps } from 'react-native';

import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import { Person } from '@polito/api-client';

import { useTheme } from '../hooks/useTheme';
import { Icon } from './Icon';
import { ListItem } from './ListItem';

interface Props {
  person: Person | undefined;
  subtitle?: string | ReactElement;
  navigateEnabled?: boolean;
  onPress?: () => void;
  trailingItem?: ReactElement;
  holder?: boolean;
}

export const PersonListItem = ({
  person,
  subtitle,
  navigateEnabled = true,
  holder = false,
  onPress,
  trailingItem,
}: TouchableHighlightProps & Props) => {
  const { fontSizes, colors } = useTheme();

  return (
    <ListItem
      leadingItem={
        person?.picture ? (
          <Image source={{ uri: person.picture }} style={styles.picture} />
        ) : (
          <Icon
            icon={faCircleUser}
            size={fontSizes['2xl']}
            color={holder ? colors.secondaryText : undefined}
          />
        )
      }
      title={person ? `${person.firstName} ${person.lastName}` : ''}
      accessibilityLabel={
        person
          ? `${subtitle}: ${person.firstName} ${person.lastName}`
          : undefined
      }
      linkTo={
        person?.id && navigateEnabled
          ? {
              screen: 'Person',
              params: { id: person.id },
            }
          : undefined
      }
      subtitle={subtitle}
      titleStyle={holder ? { color: colors.secondaryText } : undefined}
      trailingItem={trailingItem}
      onPress={onPress}
    />
  );
};

const styles = StyleSheet.create({
  picture: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
});
