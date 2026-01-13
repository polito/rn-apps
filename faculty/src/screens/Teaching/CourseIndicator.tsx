import { useTheme } from '../../ui/hooks/useTheme';
import { CourseIcon } from './CourseIcon';

export const CourseIndicator = () => {
  const { colors } = useTheme();

  return <CourseIcon color={colors.primary[500]} />;
};
