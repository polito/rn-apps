import { useTheme } from '@polito/lib/ui';

import { CourseIcon } from './CourseIcon';

export const CourseIndicator = () => {
  const { palettes } = useTheme();

  return <CourseIcon color={palettes.primary[500]} />;
};
