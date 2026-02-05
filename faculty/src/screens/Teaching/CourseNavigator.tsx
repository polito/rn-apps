import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, useWindowDimensions } from 'react-native';

import { faPlus, faSliders } from '@fortawesome/free-solid-svg-icons';
import { IconButton, Row, Text, TopTabBar, useTheme } from '@polito/lib/ui';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useCourses } from '../../core/contexts/CoursesContext';
import { CourseAssignmentsTab } from './CourseAssignmentsTab';
import { CourseFilesTab } from './CourseFilesTab';
import { CourseInfoTab } from './CourseInfoTab';
import { CourseLecturesTab } from './CourseLecturesTab';
import { CourseNoticesTab } from './CourseNoticesTab';
import { CourseStudentsTab } from './CourseStudentsTab';
import { TeachingStackParamList } from './TeachingNavigator';

interface CourseTabsParamList extends ParamListBase, TeachingStackParamList {
  CourseInfoScreen: undefined;
  CourseNoticesScreen: undefined;
  CourseFilesScreen: undefined;
  CourseLecturesScreen: undefined;
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
  const { selectedCourse } = useCourses();

  const [showPlusButton, setShowPlusButton] = useState<boolean>(false); // <--- Stato
  const [formPage, setFormPage] = useState('');

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flex: 1, alignItems: 'center', position: 'relative' }}>
          <Text
            variant="heading"
            style={{
              textAlign: 'center',
              maxWidth: width * 0.6,
              marginTop: spacing[2],
              marginLeft: spacing[10],
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {selectedCourse?.title}
          </Text>
        </View>
      ),
      headerRight: () => (
        <Row>
          {showPlusButton ? (
            <IconButton
              icon={faPlus}
              color={palettes.primary[400]}
              size={fontSizes.lg}
              accessibilityLabel={t('common.add')}
              onPress={() => {
                if (formPage === 'Notice') {
                  navigation.navigate('NoticeForm');
                }
                if (formPage === 'Files') {
                  navigation.navigate('FilesForm');
                }
                if (formPage === 'Lecture') {
                  navigation.navigate('LectureForm');
                }
                if (formPage === 'Students') {
                  navigation.navigate('StudentsForm');
                }
              }}
            />
          ) : (
            // 👇 Spacer invisibile per mantenere l'allineamento
            <View style={{ width: fontSizes.lg + spacing[6] }} />
          )}
          <IconButton
            icon={faSliders}
            color={palettes.primary[400]}
            size={fontSizes.lg}
            accessibilityLabel={t('common.preferences')}
            hitSlop={{ left: spacing[3], right: spacing[3] }}
          />
        </Row>
      ),
    });
  }, [
    formPage,
    showPlusButton, // 🔥 Trigga il re-render dell'header
    fontSizes.lg,
    navigation,
    spacing,
    t,
    width,
    palettes.primary,
    selectedCourse,
  ]);

  return (
    <TopTabs.Navigator tabBar={props => <TopTabBar {...props} />}>
      <TopTabs.Screen
        name="CourseInfoScreen"
        component={CourseInfoTab}
        options={{ title: 'Info' }}
        listeners={{
          tabPress: () => setShowPlusButton(false),
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
            setShowPlusButton(true);
            setFormPage('Notice');
          },
          focus: () => {
            setShowPlusButton(true);
            setFormPage('Notice');
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
          tabPress: () => setShowPlusButton(false),
          focus: () => {
            setShowPlusButton(false);
            setFormPage('');
          },
        }}
      />
    </TopTabs.Navigator>
  );
};
