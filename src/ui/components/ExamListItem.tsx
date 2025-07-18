import { Image, StyleSheet, TouchableHighlightProps } from 'react-native';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { Icon } from '../../ui/components/Icon';
import { ListItem } from '../../ui/components/ListItem';
import { useTheme } from '../../ui/hooks/useTheme';
import { Person } from '@polito/api-client/models/Person';
import Color from 'color';

interface Props {
  exam: string ;
  subtitle?: string | JSX.Element;
  navigateEnabled?: boolean;
}

// Funzione per verificare se `person` è un oggetto `Person`
const isPerson = (p: any): p is Person => 
  typeof p === 'object' && p !== null && 'firstName' in p && 'lastName' in p;

export const ExamListItem = ({
  exam,
  subtitle,
  navigateEnabled = true,
}: TouchableHighlightProps & Props) => {
  const { fontSizes } = useTheme();

  return (
    <ListItem
      leadingItem={<Icon icon={faCircle} size={fontSizes['2xl'] } />}
      title={exam}
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
