import { useTheme } from '@polito/lib/ui';

import { CourseIcon } from './CourseIcon';

interface Props {
  color?: string;
  icon?: string;
}

export const CourseIndicator = ({ color, icon = 'faVial' }: Props) => {
  const { palettes } = useTheme();

  return <CourseIcon color={color ?? palettes.primary[500]} icon={icon} />;
};
