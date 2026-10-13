import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, View } from 'react-native';

import { faSliders } from '@fortawesome/free-solid-svg-icons';
import { IconButton, Text, TopTabBar, useTheme } from '@polito/lib/ui';
import {
  MaterialTopTabBarProps,
  createMaterialTopTabNavigator,
} from '@react-navigation/material-top-tabs';
import {
  ParamListBase,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useCourses } from '../../core/contexts/CoursesContext';
import { FileNavigator } from '../../features/files/navigation/FileNavigator';
import { CourseAssignmentsTab } from './CourseAssignmentsTab';
import { CourseInfoScreen } from './CourseInfoScreen';
import { CourseLecturesTab } from './CourseLecturesTab';
import { CourseNoticesTab } from './CourseNoticesTab';
import { CourseSharedScreensParamList } from './CourseSharedScreens';
import { StaffScreen } from './CourseStaffScreen';
import { CourseStudentsTab } from './CourseStudentsTab';
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
  const { state } = props;
  const focusedTopRoute = state.routes[state.index];
  const focusedNestedRoute = getFocusedRouteNameFromRoute(
    focusedTopRoute as never,
  );
  const hideTabsOnAndroid =
    Platform.OS === 'android' &&
    focusedTopRoute?.name === 'CourseFilesScreen' &&
    focusedNestedRoute != null &&
    focusedNestedRoute !== 'CourseFilesScreen';

  if (hideTabsOnAndroid) {
    return null;
  }

  return <TopTabBar {...props} />;
};

type Props = NativeStackScreenProps<CourseSharedScreensParamList, 'Course'>;

export const CourseNavigator = ({ navigation, route }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { palettes, fontSizes, spacing } = theme;
  const headerSideWidth = 44;

  const { selectedCourse } = useCourses();

  const [showPlusButton, setShowPlusButton] = useState<boolean>(false); // <--- Stato
  const [_formPage, setFormPage] = useState('');
  const [tab, setTab] = useState('Info');
  const headerTitle = (() => {
    switch (tab) {
      case 'Info':
        return 'Info';
      case 'Staff':
        return t('courseStaffTab.title');
      case 'Notices':
        return t('common.notice_plural');
      case 'Files':
        return t('courseFilesTab.title');
      case 'Lectures':
        return t('common.lecture_plural');
      case 'Students':
        return t('other.students');
      case 'Assignments':
        return t('courseAssignmentsTab.title');
      default:
        return t('common.course');
    }
  })();

  useEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'center',
      headerTitle: () => (
        <Text
          variant="heading"
          style={{
            fontSize: fontSizes.md,
            textAlign: 'center',
            fontStyle: 'normal',
          }}
          weight="semibold"
          numberOfLines={1}
        >
          {headerTitle}
        </Text>
      ),
      headerRight: () =>
        tab === 'Info' ? (
          <IconButton
            icon={faSliders}
            color={palettes.primary[400]}
            size={fontSizes.lg}
            accessibilityLabel={t('common.preferences')}
            hitSlop={{ left: spacing[3], right: spacing[3] }}
            onPress={() => {
              if (selectedCourse) {
                navigation.navigate('CoursePreferences', {
                  courseId: selectedCourse?.id,
                  uniqueShortcode: selectedCourse.code,
                });
              }
            }}
          />
        ) : (
          <View style={{ width: headerSideWidth }} />
        ),
    });
  }, [
    tab,
    selectedCourse,
    headerSideWidth,
    headerTitle,
    showPlusButton, // 🔥 Trigga il re-render dell'header
    fontSizes.lg,
    fontSizes.md,
    navigation,
    spacing,
    t,
    palettes.primary,
  ]);

  return (
    <TopTabs.Navigator tabBar={props => <CourseTopTabBar {...props} />}>
      <TopTabs.Screen
        name="CourseInfoScreen"
        component={CourseInfoScreen}
        initialParams={{ courseId: route.params?.id }}
        options={{ title: 'Info' }}
        listeners={{
          tabPress: () => {
            setShowPlusButton(false);
            setTab('Info');
            setFormPage('');
          },
          focus: () => {
            setShowPlusButton(false);
            setFormPage('');
            setTab('Info');
          },
        }}
      />
      <TopTabs.Screen
        name="CourseStaffScreen"
        component={StaffScreen}
        options={{ title: t('courseStaffTab.title') }}
        listeners={{
          tabPress: () => {
            setShowPlusButton(false);
            setFormPage('');
            setTab('Staff');
          },
          focus: () => {
            setShowPlusButton(false);
            setFormPage('');
            setTab('Staff');
          },
        }}
      />
      <TopTabs.Screen
        name="CourseNoticesScreen"
        component={CourseNoticesTab}
        options={{ title: t('common.notice_plural') }}
        listeners={{
          tabPress: () => {
            setShowPlusButton(false);
            setFormPage('');
            setTab('Notices');
          },
          focus: () => {
            setShowPlusButton(false);
            setFormPage('');
            setTab('Notices');
          },
        }}
      />
      <TopTabs.Screen
        name="CourseFilesScreen"
        component={FileNavigator}
        options={{ title: t('courseFilesTab.title') }}
        listeners={{
          tabPress: () => {
            setShowPlusButton(true);
            setFormPage('Files');
            setTab('Files');
          },
          focus: () => {
            setShowPlusButton(true);
            setFormPage('Files');
            setTab('Files');
          },
        }}
      />
      <TopTabs.Screen
        name="CourseLecturesScreen"
        component={CourseLecturesTab}
        options={{ title: t('common.lecture_plural') }}
        listeners={{
          tabPress: () => {
            setShowPlusButton(true);
            setFormPage('Lecture');
            setTab('Lectures');
          },
          focus: () => {
            setShowPlusButton(true);
            setFormPage('Lecture');
            setTab('Lectures');
          },
        }}
      />
      <TopTabs.Screen
        name="CourseStudentsScreen"
        component={CourseStudentsTab}
        options={{ title: t('other.students') }}
        listeners={{
          tabPress: () => {
            setShowPlusButton(false);
            setFormPage('Students');
            setTab('Students');
          },
          focus: () => {
            setShowPlusButton(false);
            setFormPage('Students');
            setTab('Students');
          },
        }}
      />
      <TopTabs.Screen
        name="CourseAssignmentsScreen"
        component={CourseAssignmentsTab}
        options={{ title: t('courseAssignmentsTab.title') }}
        listeners={{
          tabPress: () => {
            setShowPlusButton(false);
            setFormPage('');
            setTab('Assignments');
          },
          focus: () => {
            setShowPlusButton(false);
            setFormPage('');
            setTab('Assignments');
          },
        }}
      />
    </TopTabs.Navigator>
  );
};
