import type { ViewStyle } from 'react-native';

import {
  COURSE_EXPANDED_HEADER_HEIGHT,
  useCourseCollapsingHeader,
  useOptionalCourseCollapsingHeader,
} from '../contexts/CourseCollapsingHeaderContext';

export function useCourseTabContentContainerStyle(): ViewStyle {
  const { overlayPaddingTop } = useCourseCollapsingHeader();
  return {
    paddingTop: overlayPaddingTop + COURSE_EXPANDED_HEADER_HEIGHT,
    paddingBottom: COURSE_EXPANDED_HEADER_HEIGHT,
  };
}

export function useOptionalCourseTabContentTopStyle(): ViewStyle {
  const ctx = useOptionalCourseCollapsingHeader();
  return {
    paddingTop: ctx ? ctx.overlayPaddingTop + COURSE_EXPANDED_HEADER_HEIGHT : 0,
  };
}
