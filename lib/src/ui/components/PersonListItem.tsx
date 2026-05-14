import { ReactElement } from 'react';
import { Image, StyleSheet, TouchableHighlightProps } from 'react-native';

import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import { Person } from '@polito/student-api-client';

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
  const { fontSizes, palettes } = useTheme();

  return (
    <ListItem
      leadingItem={
        person?.picture ? (
          <Image source={{ uri: person.picture }} style={styles.picture} />
        ) : (
          <Icon
            icon={faCircleUser}
            size={fontSizes['2xl']}
            color={holder ? palettes.text[600] : palettes.primary[700]}
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
      titleStyle={{
        color: holder ? palettes.gray[600] : palettes.text[800],
      }}
      subtitleStyle={{
        color: palettes.gray[500],
      }}
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
