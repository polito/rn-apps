import { useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { Text, useTheme, useTitlesStyles } from '@polito/lib/ui';

import {
  COURSE_EXPANDED_HEADER_HEIGHT,
  getCourseScrollSnapshot,
  subscribeCourseScrollStore,
} from '../contexts/CourseCollapsingHeaderContext';

type Props = {
  title: string;
};

export const CourseStackHeaderTitle = ({ title: courseTitle }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const titleStyles = useTitlesStyles(theme);

  const scrollY = useSyncExternalStore(
    subscribeCourseScrollStore,
    getCourseScrollSnapshot,
    () => null,
  );

  const animatedStyle = useAnimatedStyle(() => {
    if (!scrollY) {
      return { opacity: 0 };
    }
    const p = interpolate(
      scrollY.value,
      [
        COURSE_EXPANDED_HEADER_HEIGHT * 0.35,
        COURSE_EXPANDED_HEADER_HEIGHT * 0.85,
      ],
      [0, 1],
      Extrapolation.CLAMP,
    );
    return {
      opacity: p,
    };
  }, [scrollY]);

  return (
    <Animated.View
      style={[
        Platform.OS === 'android' && { alignItems: 'center' },
        animatedStyle,
      ]}
    >
      <Text
        variant="title"
        style={[
          titleStyles.headerTitleStyle,
          { fontSize: 17, color: theme.colors.title },
        ]}
        numberOfLines={1}
        accessibilityLabel={courseTitle || t('common.course')}
      >
        {courseTitle || ''}
      </Text>
    </Animated.View>
  );
};
