import { usePreferencesContext } from '@lib/core/contexts/PreferencesContext';
import { useTheme } from '@lib/ui/hooks/useTheme';

import { AppPreferences } from '~/core/types/preferences';

import { CourseIcon } from './CourseIcon';

interface Props {
  uniqueShortcode: string;
}

export const CourseIndicator = ({ uniqueShortcode }: Props) => {
  const { palettes } = useTheme();
  const prefs = usePreferencesContext<AppPreferences>();
  const coursePrefs = prefs.courses[uniqueShortcode];

  if (!coursePrefs) {
    return <CourseIcon color={palettes.primary[500]} />;
  }

  return (
    <CourseIcon
      color={coursePrefs.color}
      icon={coursePrefs.icon}
      isHidden={coursePrefs.isHidden}
    />
  );
};
