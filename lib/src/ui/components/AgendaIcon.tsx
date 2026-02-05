import { View } from 'react-native';

import { courseIcons } from '../../features/courses/constants';
import { useTheme } from '../hooks/useTheme';
import { Icon } from './Icon';

interface Props {
  color: string;
  icon?: string;
}

export const AgendaIcon = ({ color, icon }: Props) => {
  const { palettes } = useTheme();
  return (
    <View
      style={{
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: color ?? palettes.primary[400],
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {icon && <Icon icon={courseIcons[icon]} color="white" size={12} />}
    </View>
  );
};
