import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, TouchableHighlightProps } from 'react-native';

import { faUser } from '@fortawesome/free-regular-svg-icons';
import { Person } from '@polito/student-api-client';

import { useTheme } from '../hooks/useTheme';
import { Icon } from './Icon';
import { ListItem } from './ListItem';

interface Props {
  person: Person | undefined;
  subtitle?: string | ReactElement;
  navigateEnabled?: boolean;
}

export const PersonListItem = ({
  person,
  subtitle,
  navigateEnabled = true,
  ...rest
}: TouchableHighlightProps & Props) => {
  const { fontSizes } = useTheme();
  const { t } = useTranslation();

  const personName = person
    ? `${person.firstName ?? ''} ${person.lastName ?? ''}`.trim()
    : '';

  const accessibilityLabel = [
    typeof subtitle === 'string' && personName ? `${subtitle}: ` : '',
    personName || t('common.staffMemberUnavailable'),
    navigateEnabled && personName ? `. ${t('common.tapToViewContact')}` : '',
  ].join('');

  return (
    <ListItem
      accessibilityRole="button"
      accessible
      leadingItem={
        person?.picture ? (
          <Image
            source={{ uri: person.picture }}
            style={styles.picture}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          />
        ) : (
          <Icon icon={faUser} size={fontSizes['2xl']} />
        )
      }
      title={person ? `${person.firstName} ${person.lastName}` : ''}
      accessibilityLabel={accessibilityLabel}
      linkTo={
        person?.id && navigateEnabled
          ? {
              screen: 'Person',
              params: { id: person.id },
            }
          : undefined
      }
      subtitle={subtitle}
      {...rest}
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
