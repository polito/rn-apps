import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { faCog } from '@fortawesome/free-solid-svg-icons';
import {
  IconButton,
  Text,
  TopTabBar,
  useTheme,
  useTitlesStyles,
} from '@polito/lib/ui';
import {
  MaterialTopTabBarProps,
  createMaterialTopTabNavigator,
} from '@react-navigation/material-top-tabs';
import { ParamListBase } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useCourses } from '../../core/contexts/CoursesContext';
import { StudentsNavigator } from '../../features/students';
import { CourseAssignmentsTab } from './CourseAssignmentsTab';
import { CourseFilesTab } from './CourseFilesTab';
import { CourseInfoScreen } from './CourseInfoScreen';
import { CourseLecturesTab } from './CourseLecturesTab';
import { CourseNoticesTab } from './CourseNoticesTab';
import { CourseSharedScreensParamList } from './CourseSharedScreens';
import { StaffScreen } from './CourseStaffScreen';
import { TeachingStackParamList } from './TeachingNavigator';

export interface CourseTabsParamList
  extends ParamListBase, TeachingStackParamList {
  CourseInfoScreen: { courseId?: number } | undefined;
  CourseStaffScreen: undefined;
  CourseNoticesScreen: undefined;
  CourseFilesScreen: undefined;
  CourseLecturesScreen: undefined;
  CourseStudentsScreen: undefined;
  CourseAssignmentsScreen: undefined;
}

const TopTabs = createMaterialTopTabNavigator<CourseTabsParamList>();

const CourseTopTabBar = (props: MaterialTopTabBarProps) => {
  const focusedRoute = props.state.routes[props.state.index];
  const tabBarStyle = StyleSheet.flatten(
    props.descriptors[focusedRoute.key].options.tabBarStyle,
  );

  if (tabBarStyle?.display === 'none') {
    return null;
  }

  return <TopTabBar {...props} />;
};

type Props = NativeStackScreenProps<CourseSharedScreensParamList, 'Course'>;

export const CourseNavigator = ({ navigation, route }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { palettes, fontSizes } = theme;
  const titleStyles = useTitlesStyles(theme);
  const { selectedCourse } = useCourses();
  const courseId = route.params?.id ?? selectedCourse?.id;
  const uniqueShortcode =
    route.params?.uniqueShortcode ?? selectedCourse?.code ?? '';

  useEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'center',
      headerTitle: () => (
        <Text
          variant="title"
          style={[titleStyles.headerTitleStyle, { fontSize: 17 }]}
          numberOfLines={1}
        >
          {t('common.course')}
        </Text>
      ),
      headerRight: () => (
        <IconButton
          icon={faCog}
          color={palettes.primary[400]}
          size={fontSizes.lg}
          accessibilityRole="button"
          accessibilityLabel={t('common.preferences')}
          adjustSpacing="right"
          onPress={() => {
            if (courseId == null) return;
            navigation.navigate('CoursePreferences', {
              courseId,
              uniqueShortcode,
            });
          }}
        />
      ),
    });
  }, [
    courseId,
    fontSizes.lg,
    navigation,
    palettes.primary,
    t,
    titleStyles.headerTitleStyle,
    uniqueShortcode,
  ]);

  return (
    <TopTabs.Navigator tabBar={props => <CourseTopTabBar {...props} />}>
      <TopTabs.Screen
        name="CourseInfoScreen"
        component={CourseInfoScreen}
        initialParams={{ courseId: route.params?.id }}
        options={{ title: t('courseInfoTab.title') }}
      />
      <TopTabs.Screen
        name="CourseStaffScreen"
        component={StaffScreen}
        options={{ title: t('courseStaffTab.title') }}
      />
      <TopTabs.Screen
        name="CourseNoticesScreen"
        component={CourseNoticesTab}
        options={{ title: t('courseNoticesTab.title') }}
      />
      <TopTabs.Screen
        name="CourseFilesScreen"
        component={CourseFilesTab}
        options={{ title: t('courseFilesTab.title') }}
      />
      <TopTabs.Screen
        name="CourseLecturesScreen"
        component={CourseLecturesTab}
        options={{ title: t('courseLecturesTab.title') }}
      />
      <TopTabs.Screen
        name="CourseStudentsScreen"
        component={StudentsNavigator}
        options={{ title: t('other.students') }}
      />
      <TopTabs.Screen
        name="CourseAssignmentsScreen"
        component={CourseAssignmentsTab}
        options={{ title: t('courseAssignmentsTab.title') }}
      />
    </TopTabs.Navigator>
  );
};
