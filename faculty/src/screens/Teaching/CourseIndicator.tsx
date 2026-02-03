import { useTheme } from '@polito/lib';

import { CourseIcon } from './CourseIcon';

export const CourseIndicator = () => {
  const { palettes } = useTheme();

  return <CourseIcon color={palettes.primary[500]} />;
};
