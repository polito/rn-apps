import { useCallback } from 'react';

import { useFocusEffect, useRoute } from '@react-navigation/native';

import {
  useCourseCollapsingHeader,
  useOptionalCourseCollapsingHeader,
} from '../contexts/CourseCollapsingHeaderContext';

/**
 * Wire the active screen to the shared collapsing header scroll driver.
 * Pass `scrollRouteKey` for nested stacks (e.g. Course files tab) so offsets
 * stay under the top-tab name.
 */
export function useCourseCollapsingTabScroll(scrollRouteKey?: string) {
  const route = useRoute();
  const { scrollHandler, setActiveRoute } = useCourseCollapsingHeader();
  const routeKey = scrollRouteKey ?? route.name;

  useFocusEffect(
    useCallback(() => {
      setActiveRoute(routeKey);
    }, [routeKey, setActiveRoute]),
  );

  return { scrollHandler };
}

/** Same as useCourseCollapsingTabScroll when inside Course tabs; no-op otherwise. */
export function useOptionalCourseCollapsingTabScroll(scrollRouteKey?: string) {
  const ctx = useOptionalCourseCollapsingHeader();
  const route = useRoute();
  const routeKey = scrollRouteKey ?? route.name;

  useFocusEffect(
    useCallback(() => {
      if (ctx) {
        ctx.setActiveRoute(routeKey);
      }
    }, [ctx, routeKey]),
  );

  return { scrollHandler: ctx?.scrollHandler };
}
