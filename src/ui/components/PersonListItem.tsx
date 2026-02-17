import { ReactElement } from 'react';
import { Image, StyleSheet, TouchableHighlightProps } from 'react-native';

import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import { Person } from '@polito/api-client/models/Person';

import { Icon } from '../../ui/components/Icon';
import { ListItem } from '../../ui/components/ListItem';
import { useTheme } from '../../ui/hooks/useTheme';

interface Props {
  person: Person | undefined;
  subtitle?: string | ReactElement;
  navigateEnabled?: boolean;
}

export const PersonListItem = ({
  person,
  subtitle,
  // navigateEnabled = true,
}: TouchableHighlightProps & Props) => {
  const { fontSizes } = useTheme();

  return (
    <ListItem
      leadingItem={
        person?.picture ? (
          <Image source={{ uri: person.picture }} style={styles.picture} />
        ) : (
          <Icon icon={faCircleUser} size={fontSizes['2xl']} />
        )
      }
      title={person ? `${person.firstName} ${person.lastName}` : ''}
      accessibilityLabel={
        person
          ? `${subtitle}: ${person.firstName} ${person.lastName}`
          : undefined
      }
      // linkTo={
      //   person?.id && navigateEnabled
      //     ? {
      //         screen: 'Person',
      //         params: { id: person.id },
      //       }
      //     : undefined
      // }
      subtitle={subtitle}
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
