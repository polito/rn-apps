import { TouchableHighlightProps } from 'react-native';

import { faCircle } from '@fortawesome/free-regular-svg-icons';

import { useTheme } from '../hooks/useTheme';
import { Icon } from './Icon';
import { ListItem } from './ListItem';

interface Props {
  exam: string;
  subtitle?: string | JSX.Element;
  navigateEnabled?: boolean;
}

export const ExamListItem = ({
  exam,
  subtitle,
}: TouchableHighlightProps & Props) => {
  const { fontSizes } = useTheme();

  return (
    <ListItem
      leadingItem={<Icon icon={faCircle} size={fontSizes['2xl']} />}
      title={exam}
      subtitle={subtitle}
    />
  );
};
