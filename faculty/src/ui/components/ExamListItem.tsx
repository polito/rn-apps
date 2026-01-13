import { TouchableHighlightProps } from 'react-native';

import { faCircle } from '@fortawesome/free-regular-svg-icons';

import { Icon } from '../../ui/components/Icon';
import { ListItem } from '../../ui/components/ListItem';
import { useTheme } from '../../ui/hooks/useTheme';

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
