import {
  type PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Platform } from 'react-native';
import {
  type SharedValue,
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';

export const COURSE_EXPANDED_HEADER_HEIGHT = 128;

export const IS_IOS_LIQUID_GLASS =
  Platform.OS === 'ios' && parseInt(String(Platform.Version), 10) >= 26;

export const courseScrollStore: { scrollY: SharedValue<number> | null } = {
  scrollY: null,
};

const courseScrollSubscribers = new Set<() => void>();

export function subscribeCourseScrollStore(listener: () => void) {
  courseScrollSubscribers.add(listener);
  return () => courseScrollSubscribers.delete(listener);
}

export function getCourseScrollSnapshot() {
  return courseScrollStore.scrollY;
}

function notifyCourseScrollStore() {
  courseScrollSubscribers.forEach(l => l());
}

export type CourseCollapsingHeaderContextValue = {
  scrollY: SharedValue<number>;
  scrollHandler: ReturnType<typeof useAnimatedScrollHandler>;
  tabBarHeight: number;
  tabBarHeightSV: SharedValue<number>;
  overlayPaddingTopSV: SharedValue<number>;
  setTabBarHeight: (h: number) => void;
  setActiveRoute: (routeName: string) => void;
  overlayPaddingTop: number;
  courseTitle: string;
  courseSubtitle: string | undefined;
  uniqueShortcode: string;
};

const CourseCollapsingHeaderContext =
  createContext<CourseCollapsingHeaderContextValue | null>(null);

type ProviderProps = PropsWithChildren<{
  courseTitle: string;
  courseSubtitle: string | undefined;
  uniqueShortcode: string;
  nativeHeaderHeight?: number;
}>;

export function CourseCollapsingHeaderProvider({
  children,
  courseTitle,
  courseSubtitle,
  uniqueShortcode,
  nativeHeaderHeight = 0,
}: ProviderProps) {
  const scrollY = useSharedValue(0);
  const tabBarHeightSV = useSharedValue(52);
  const overlayPaddingTopSV = useSharedValue(0);
  const offsetsRef = useRef<Record<string, number>>({});
  const activeRouteRef = useRef('CourseInfoScreen');
  const [tabBarHeight, setTabBarHeightState] = useState(52);

  const setTabBarHeight = useCallback(
    (h: number) => {
      tabBarHeightSV.value = h;
      setTabBarHeightState(prev => (Math.abs(prev - h) < 1 ? prev : h));
    },
    [tabBarHeightSV],
  );

  const persistOffset = useCallback((y: number) => {
    offsetsRef.current[activeRouteRef.current] = y;
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: e => {
      scrollY.value = e.contentOffset.y;
      runOnJS(persistOffset)(e.contentOffset.y);
    },
  });

  const setActiveRoute = useCallback(
    (routeName: string) => {
      activeRouteRef.current = routeName;
      const y = offsetsRef.current[routeName] ?? 0;
      scrollY.value = y;
    },
    [scrollY],
  );

  const overlayPaddingTop =
    tabBarHeight + (IS_IOS_LIQUID_GLASS ? nativeHeaderHeight : 0);

  useLayoutEffect(() => {
    overlayPaddingTopSV.value = overlayPaddingTop;
  }, [overlayPaddingTop, overlayPaddingTopSV]);

  courseScrollStore.scrollY = scrollY;
  useLayoutEffect(() => {
    notifyCourseScrollStore();
    return () => {
      courseScrollStore.scrollY = null;
      notifyCourseScrollStore();
    };
  }, [scrollY]);

  const value = useMemo(
    () => ({
      scrollY,
      scrollHandler,
      tabBarHeight,
      tabBarHeightSV,
      overlayPaddingTopSV,
      setTabBarHeight,
      setActiveRoute,
      overlayPaddingTop,
      courseTitle,
      courseSubtitle,
      uniqueShortcode,
    }),
    [
      scrollY,
      scrollHandler,
      tabBarHeight,
      tabBarHeightSV,
      overlayPaddingTopSV,
      setTabBarHeight,
      setActiveRoute,
      overlayPaddingTop,
      courseTitle,
      courseSubtitle,
      uniqueShortcode,
    ],
  );

  return (
    <CourseCollapsingHeaderContext.Provider value={value}>
      {children}
    </CourseCollapsingHeaderContext.Provider>
  );
}

export function useCourseCollapsingHeader() {
  const ctx = useContext(CourseCollapsingHeaderContext);
  if (!ctx) {
    throw new Error(
      'useCourseCollapsingHeader must be used within CourseCollapsingHeaderProvider',
    );
  }
  return ctx;
}

export function useOptionalCourseCollapsingHeader() {
  return useContext(CourseCollapsingHeaderContext);
}
