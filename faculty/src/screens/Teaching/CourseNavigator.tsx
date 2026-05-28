import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, useWindowDimensions } from 'react-native';

import { faSliders } from '@fortawesome/free-solid-svg-icons';
import { useTheme, useTitlesStyles } from '@polito/lib/ui';
import { IconButton, Text, TopTabBar } from '@polito/lib/ui';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ParamListBase } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useCourses } from '../../core/contexts/CoursesContext';
import { CourseAssignmentsTab } from './CourseAssignmentsTab';
import { CourseFilesTab } from './CourseFilesTab';
import { CourseInfoScreen } from './CourseInfoScreen';
import { CourseLecturesTab } from './CourseLecturesTab';
import { CourseNoticesTab } from './CourseNoticesTab';
import { CourseSharedScreensParamList } from './CourseSharedScreens';
import { StaffScreen } from './CourseStaffScreen';
import { CourseStudentsTab } from './CourseStudentsTab';
import { TeachingStackParamList } from './TeachingNavigator';

export interface CourseTabsParamList
  extends ParamListBase, TeachingStackParamList {
  CourseInfoScreen: undefined;
  CourseStaffScreen: undefined;
  CourseNoticesScreen: undefined;
  CourseFilesScreen: undefined;
  CourseLecturesScreen: undefined;
  CourseStudentsScreen: undefined;
  CourseAssignmentsScreen: undefined;
}

const TopTabs = createMaterialTopTabNavigator<CourseTabsParamList>();

type Props = NativeStackScreenProps<CourseSharedScreensParamList, 'Course'>;

export const CourseNavigator = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { palettes, fontSizes, spacing } = theme;
  const { width } = useWindowDimensions();

  const { selectedCourse } = useCourses();

  const [showPlusButton, setShowPlusButton] = useState<boolean>(false); // <--- Stato
  const [_formPage, setFormPage] = useState('');
  const [tab, setTab] = useState('Info');
  const titleStyles = useTitlesStyles(theme);

  useEffect(() => {
    navigation.setOptions({
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
          {t('common.course')}
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
          <View style={{ width: width * 0.1 }} />
        ),
    });
  }, [
    tab,
    selectedCourse,
    showPlusButton, // 🔥 Trigga il re-render dell'header
    fontSizes,
    navigation,
    spacing,
    t,
    palettes.primary,
    titleStyles.headerTitleStyle,
    width,
  ]);

  return (
    <TopTabs.Navigator tabBar={props => <TopTabBar {...props} />}>
      <TopTabs.Screen
        name="CourseInfoScreen"
        component={CourseInfoScreen}
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
            setTab(t('common.notice_plural'));
          },
          focus: () => {
            setShowPlusButton(false);
            setFormPage('');
          },
        }}
      />
      <TopTabs.Screen
        name="CourseFilesScreen"
        component={CourseFilesTab}
        options={{ title: t('courseFilesTab.title') }}
        listeners={{
          tabPress: () => {
            setShowPlusButton(true);
            setFormPage('Files');
            setTab(t('courseFilesTab.title'));
          },
          focus: () => {
            setShowPlusButton(true);
            setFormPage('Files');
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
            setTab(t('common.lecture_plural'));
          },
          focus: () => {
            setShowPlusButton(true);
            setFormPage('Lecture');
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
            setTab(t('other.students'));
          },
          focus: () => {
            setShowPlusButton(false);
            setFormPage('Students');
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
            setTab(t('courseAssignmentsTab.title'));
          },
          focus: () => {
            setShowPlusButton(false);
            setFormPage('');
          },
        }}
      />
    </TopTabs.Navigator>
  );
};
