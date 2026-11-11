import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';

import { useTheme } from '@polito/lib/ui';
import { ParamListBase } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { CourseFileMultiSelectScreen } from '../../features/files/screens/CourseFileMultiSelectScreen';
import { CourseFilesUploadScreen } from '../../features/files/screens/CourseFilesUploadScreen';
import { CourseNavigator } from './CourseNavigator';
import { CoursePreferencesScreen } from './CoursePreferencesScreen';

export interface CourseSharedScreensParamList extends ParamListBase {
  Course: {
    id: number;
    animated?: boolean;
    title?: string;
    uniqueShortcode?: string;
  };
  Notice: { noticeId: number; courseId: number };
  CoursePreferences: { courseId: number; uniqueShortcode: string };
  CourseGuide: { courseId: number };
  CourseDirectory: {
    courseId: number;
    directoryId?: string;
    directoryName?: string;
  };
  CourseFileMultiSelectScreen: {
    courseId: number;
    path?: string;
    action?: 'move' | 'delete';
    initialSelectedIds?: string[];
  };
  CourseFilesUploadScreen: { courseId: number; path?: string };
  CourseVideolecture: {
    courseId: number;
    lectureId: number;
    teacherId: number;
  };
  CourseVirtualClassroom: {
    courseId: number;
    lectureId: number;
    teacherId: number;
  };
}

const Stack = createNativeStackNavigator<CourseSharedScreensParamList>();

export const CourseSharedScreens = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen
        name="Course"
        component={CourseNavigator}
        getId={({ params }: { params: any }) => `${params.id}`}
        options={({ route: { params } }: { route: { params: any } }) => ({
          headerLargeStyle: {
            backgroundColor: colors.headersBackground,
          },
          headerTransparent: false,
          headerLargeTitle: false,
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal',
          animation: (params?.animated ?? true) ? 'default' : 'none',
        })}
      />
      <Stack.Screen
        name="CoursePreferences"
        component={CoursePreferencesScreen}
        getId={({ params }: { params: any }) => `${params.courseId}`}
        options={{
          title: t('common.preferences'),
          headerLargeTitle: false,
          headerBackTitle: t('common.course'),
        }}
      />

      <Stack.Screen
        name="CourseFileMultiSelectScreen"
        component={CourseFileMultiSelectScreen}
        options={{
          presentation: Platform.OS === 'android' ? 'card' : 'modal',
          animation: Platform.OS === 'android' ? 'slide_from_right' : 'default',
          headerShown: Platform.OS === 'android',
          headerLargeTitle: false,
          headerTransparent: false,
          headerTitle:
            Platform.OS === 'android' ? t('courseFilesTab.select') : '',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="CourseFilesUploadScreen"
        component={CourseFilesUploadScreen}
        options={{
          presentation: Platform.OS === 'android' ? 'card' : 'modal',
          animation: Platform.OS === 'android' ? 'slide_from_right' : 'default',
          headerShown: Platform.OS === 'android',
          headerLargeTitle: false,
          headerTransparent: false,
          headerTitle:
            Platform.OS === 'android' ? t('courseFilesTab.uploadFile') : '',
          headerTitleAlign: 'center',
        }}
      />
    </>
  );
};
