import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useWindowDimensions } from 'react-native';

import { faCog } from '@fortawesome/free-solid-svg-icons';
import { IconButton, Text, useTheme } from '@polito/lib/ui';
import { useHeaderHeight } from '@react-navigation/elements';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useNotifications } from '../../../core/hooks/useNotifications';
import { useGetCourse, useGetCourses } from '../../../core/queries/courseHooks';
import { TeachingStackParamList } from '../../teaching/components/TeachingNavigator';
import { CourseCollapsibleTabBar } from '../components/CourseCollapsibleTabBar';
import { CourseStackHeaderTitle } from '../components/CourseStackHeaderTitle';
import {
  CourseCollapsingHeaderProvider,
  IS_IOS_LIQUID_GLASS,
} from '../contexts/CourseCollapsingHeaderContext';
import { CourseContext, useCourseContext } from '../contexts/CourseContext';
import { CourseAssignmentsScreen } from '../screens/CourseAssignmentsScreen';
import { CourseInfoScreen } from '../screens/CourseInfoScreen';
import { CourseLecturesScreen } from '../screens/CourseLecturesScreen';
import { CourseNoticesScreen } from '../screens/CourseNoticesScreen';
import { FileNavigator } from './FileNavigator';

type Props = NativeStackScreenProps<TeachingStackParamList, 'Course'>;

export interface CourseTabsParamList extends TeachingStackParamList {
  CourseInfoScreen: undefined;
  CourseNoticesScreen: undefined;
  CourseFilesScreen: undefined;
  CourseLecturesScreen: undefined;
  CourseAssignmentsScreen: undefined;
}

const TopTabs = createMaterialTopTabNavigator<CourseTabsParamList>();

function CourseTopTabsNavigator() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { getUnreadsCount } = useNotifications();
  const courseId = useCourseContext();

  return (
    <TopTabs.Navigator
      screenOptions={
        IS_IOS_LIQUID_GLASS
          ? { sceneStyle: { backgroundColor: `${colors.black}00` } }
          : undefined
      }
      tabBar={props => <CourseCollapsibleTabBar {...props} />}
    >
      <TopTabs.Screen
        name="CourseInfoScreen"
        component={CourseInfoScreen}
        options={{
          title: t('courseInfoTab.title'),
        }}
      />
      <TopTabs.Screen
        name="CourseNoticesScreen"
        component={CourseNoticesScreen}
        options={{
          title: t('courseNoticesTab.title'),
          tabBarBadge: () => {
            const count = getUnreadsCount([
              'teaching',
              'courses',
              courseId.toString(),
              'notices',
            ]);
            return count && count > 0 ? <Text>{count}</Text> : <Text />;
          },
        }}
      />
      <TopTabs.Screen
        name="CourseFilesScreen"
        component={FileNavigator}
        options={{
          title: t('courseFilesTab.title'),
          tabBarBadge: () => {
            const count = getUnreadsCount([
              'teaching',
              'courses',
              courseId.toString(),
              'files',
            ]);
            return count && count > 0 ? <Text>{count}</Text> : <Text />;
          },
        }}
      />
      <TopTabs.Screen
        name="CourseLecturesScreen"
        component={CourseLecturesScreen}
        options={{
          title: t('courseLecturesTab.title'),
          tabBarBadge: () => {
            const count = getUnreadsCount([
              'teaching',
              'courses',
              courseId.toString(),
              'lectures',
            ]);
            return count && count > 0 ? <Text>{count}</Text> : <Text />;
          },
        }}
      />
      <TopTabs.Screen
        name="CourseAssignmentsScreen"
        component={CourseAssignmentsScreen}
        options={{
          title: t('courseAssignmentsTab.title'),
        }}
      />
    </TopTabs.Navigator>
  );
}

export const CourseNavigator = ({ route, navigation }: Props) => {
  const { t } = useTranslation();
  const { palettes, fontSizes } = useTheme();
  const { width } = useWindowDimensions();
  const headerHeight = useHeaderHeight();
  const nativeHeaderHeight = IS_IOS_LIQUID_GLASS ? headerHeight : 0;

  const { id, title, uniqueShortcode: paramUniqueShortcode } = route.params;
  const courseQuery = useGetCourse(id);
  const coursesQuery = useGetCourses();

  const meta = useMemo(() => {
    if (!coursesQuery.data) {
      return {
        displayTitle: courseQuery.data?.name || title || '',
        isModule: false,
        correctUniqueShortcode: paramUniqueShortcode ?? '',
        subtitle: undefined as string | undefined,
      };
    }

    const course = coursesQuery.data.find(c => {
      return (
        c.id === id ||
        c.previousEditions.some(e => +e.id === id) ||
        c.modules?.some(module => module.id === id) ||
        c.modules?.some(module =>
          module.previousEditions.some(e => +e.id === id),
        )
      );
    });

    const isModule = coursesQuery.data.some(
      c =>
        c.modules?.some(module => module.id === id) ||
        c.modules?.some(module =>
          module.previousEditions.some(e => +e.id === id),
        ),
    );

    let correctUniqueShortcode =
      course?.uniqueShortcode || paramUniqueShortcode || '';
    let parentCourse = null as (typeof coursesQuery.data)[0] | null;
    if (isModule) {
      parentCourse =
        coursesQuery.data.find(c =>
          c.modules?.some(module => module.id === id),
        ) ?? null;
      if (parentCourse) {
        const moduleIndex = parentCourse.modules?.findIndex(
          module => module.id === id,
        );
        if (moduleIndex !== undefined && moduleIndex >= 0) {
          correctUniqueShortcode = `${parentCourse.uniqueShortcode}${moduleIndex + 1}`;
        }
      }
    }

    const displayTitle = courseQuery.data?.name || course?.name || title || '';

    let subtitle: string | undefined;
    if (course) {
      if (isModule && parentCourse) {
        const parts = [course.shortcode, parentCourse.name].filter(Boolean);
        subtitle = parts.join(' · ');
      } else {
        const parts = [
          course.shortcode ?? '',
          !isModule && course.cfu ? `${course.cfu} ${t('common.cfu')}` : '',
        ].filter(Boolean);
        subtitle = parts.length ? parts.join(' — ') : undefined;
      }
    }

    return {
      displayTitle,
      isModule,
      correctUniqueShortcode,
      subtitle,
    };
  }, [
    courseQuery.data?.name,
    coursesQuery,
    id,
    title,
    paramUniqueShortcode,
    t,
  ]);

  useEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'center',
      headerLargeTitle: false,
      headerTitle: () => <CourseStackHeaderTitle title={meta.displayTitle} />,
      headerRight: () => (
        <IconButton
          icon={faCog}
          color={palettes.primary[400]}
          size={fontSizes.lg}
          accessibilityRole="button"
          accessibilityLabel={t('common.preferences')}
          adjustSpacing="right"
          onPress={() => {
            navigation.navigate('CoursePreferences', {
              courseId: id,
              uniqueShortcode: meta.correctUniqueShortcode,
            });
          }}
        />
      ),
    });
  }, [
    fontSizes.lg,
    id,
    meta.correctUniqueShortcode,
    meta.displayTitle,
    navigation,
    palettes.primary,
    t,
    width,
  ]);

  return (
    <CourseCollapsingHeaderProvider
      courseTitle={meta.displayTitle || title || ''}
      courseSubtitle={meta.subtitle}
      uniqueShortcode={meta.correctUniqueShortcode}
      nativeHeaderHeight={nativeHeaderHeight}
    >
      <CourseContext.Provider value={id}>
        <CourseTopTabsNavigator />
      </CourseContext.Provider>
    </CourseCollapsingHeaderProvider>
  );
};
