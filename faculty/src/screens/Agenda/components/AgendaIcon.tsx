import { View } from 'react-native';

import { courseIcons } from '@polito/lib/features/courses';
import { Icon, useTheme } from '@polito/lib/ui';

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
