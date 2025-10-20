import { useTheme } from '../../ui/hooks/useTheme';
import { CourseIcon } from './CourseIcon';

interface Props {
  uniqueShortcode?: string;
}

export const CourseIndicator = ({ uniqueShortcode }: Props) => {
  const { colors } = useTheme();
  // ATTENZIONE const coursePrefs = prefs.courses[uniqueShortcode];

  /* if (!coursePrefs) {
    return <CourseIcon color={colors.primary[500]} />;
  }

  return (
    <CourseIcon
      color={coursePrefs.color}
      icon={coursePrefs.icon}
      isHidden={coursePrefs.isHidden}
    />
  ); */

  return <CourseIcon color={colors.primary[500]} />;
};
