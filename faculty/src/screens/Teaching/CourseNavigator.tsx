import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, useWindowDimensions } from 'react-native';

import { faSliders } from '@fortawesome/free-solid-svg-icons';
import {
  IconButton,
  Text,
  TopTabBar,
  useTheme,
  useTitlesStyles,
} from '@polito/lib/ui';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { CourseAssignmentsTab } from './CourseAssignmentsTab';
import { CourseFilesTab } from './CourseFilesTab';
import { CourseInfoScreen } from './CourseInfoScreen';
import { CourseLecturesTab } from './CourseLecturesTab';
import { CourseNoticesTab } from './CourseNoticesTab';
import { StaffScreen } from './CourseStaffScreen';
import { CourseStudentsTab } from './CourseStudentsTab';
import { TeachingStackParamList } from './TeachingNavigator';

interface CourseTabsParamList extends ParamListBase, TeachingStackParamList {
  CourseInfoScreen: undefined;
  CourseStaffScreen: undefined;
  CourseNoticesScreen: undefined;
  CourseFilesScreen: undefined;
  CourseLecturesScreen: undefined;
  CourseStudentsScreen: undefined;
  CourseAssignmentsScreen: undefined;
}

const TopTabs = createMaterialTopTabNavigator<CourseTabsParamList>();

export const CourseNavigator = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { palettes, fontSizes, spacing } = theme;
  const { width } = useWindowDimensions();
  const navigation =
    useNavigation<NativeStackNavigationProp<TeachingStackParamList>>();

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
            fontSize: 17,
            textAlign: 'center',
          }}
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
          />
        ) : (
          <View style={{ width: width * 0.1 }} />
        ),
    });
  }, [
    tab,
    showPlusButton, // 🔥 Trigga il re-render dell'header
    fontSizes.lg,
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
            setTab('Notices');
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
            setTab('Files');
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
            setTab('Lectures');
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
            setTab('Students');
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
            setTab('Assignments');
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
