import { useTranslation } from 'react-i18next';
import { Platform, TouchableOpacity } from 'react-native';

import {
  CourseColorPickerScreen,
  CourseIconPickerScreen,
} from '@polito/lib/features/courses';
import { Text, useTheme } from '@polito/lib/ui';
import { ParamListBase } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Staff } from '~/core/contexts/CoursesContext';

import { CourseFileMultiSelectScreen } from '../../features/files/screens/CourseFileMultiSelectScreen';
import { CourseFilesUploadScreen } from '../../features/files/screens/CourseFilesUploadScreen';
import { AddNoticeContent } from './AddNoticeContent';
import { AddOrEditLectureModalContent } from './AddOrEditLectureModalContent';
import { AddStaffModalContent } from './AddStaffModalContent';
import { ChooseRoomModal } from './ChooseRoomModal';
import { CourseGuideScreen } from './CourseGuideScreen';
import { CourseLectureMultiSelectScreen } from './CourseLectureMultiSelectScreen';
import { CourseNavigator } from './CourseNavigator';
import { CoursePreferencesScreen } from './CoursePreferencesScreen';
import { DefineAccessModal } from './DefineAccessModal';
import { EditLectureStaffModalContent } from './EditLectureStaffModalContent';
import { EditNoticeContent } from './EditNoticeContent';
import { LessonScreen } from './LessonScreen';
import { NoticeScreen } from './NoticeScreen';

export interface CourseSharedScreensParamList extends ParamListBase {
  Course: {
    id: number;
    animated?: boolean;
    title?: string;
    uniqueShortcode?: string;
  };
  CoursePreferences: { courseId: number; uniqueShortcode: string };
  CourseColorPicker: { courseId: number; uniqueShortcode: string };
  CourseIconPicker: { courseId: number; uniqueShortcode: string };
  CourseGuide: { courseId: number };
  Notice: { noticeId: number; courseId: number };
  AddNoticeContent: { courseId: number };
  EditNoticeContent: { noticeId: number; courseId: number };
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
  EditRoom: { onConfirm?: (roomLabel: string) => void };
  AddStaff: { from: 'lectureScreen' | 'staffScreen' };
  DefineAccess: { addeddStaff: Staff[]; from: 'staffScreen' | 'lectureScreen' };
  MultiSelectLectures: { initialSelectedIds?: number[] };
}

const Stack = createNativeStackNavigator<CourseSharedScreensParamList>();

type HeaderTextButtonProps = {
  text: string;
  onPress: () => void;
};

const HeaderTextButton = ({ text, onPress }: HeaderTextButtonProps) => {
  const { colors, fontSizes, spacing } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ padding: spacing[2] }}
      hitSlop={spacing[2]}
      accessibilityRole="button"
      accessibilityLabel={text}
    >
      <Text
        style={{
          fontSize: fontSizes.md,
          color: colors.secondaryText,
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export const CourseSharedScreens = () => {
  const { colors, fontSizes, fontWeights, fontFamilies } = useTheme();
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
          headerTitleAlign: 'center',
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
          headerShadowVisible: false,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: fontFamilies.heading + '-SemiBold',
            fontSize: fontSizes.md,
            // fontWeight: fontWeights.semibold,
            color: colors.title,
          },
        }}
      />
      <Stack.Screen
        name="CourseColorPicker"
        component={CourseColorPickerScreen}
        getId={({ params }: { params: any }) => `${params.courseId}`}
        options={{
          title: t('courseColorPickerScreen.title'),
          headerLargeTitle: false,
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
      <Stack.Screen
        name="CourseIconPicker"
        component={CourseIconPickerScreen}
        getId={({ params }: { params: any }) => `${params.courseId}`}
        options={{
          title: t('courseIconPickerScreen.title'),
          headerLargeTitle: false,
          headerBackButtonDisplayMode: 'minimal',
          headerSearchBarOptions: {},
        }}
      />
      <Stack.Screen
        name="Lecture"
        component={LessonScreen}
        options={{
          headerTitle: () => (
            <Text
              variant="heading"
              style={{
                fontSize: fontSizes.md,
                textAlign: 'center',
                fontWeight: fontWeights.medium,
              }}
              numberOfLines={1}
            >
              {t('common.lecture')}
            </Text>
          ),
          headerTitleAlign: 'center',
          headerShown: true,
          headerShadowVisible: false,
          headerLargeTitleEnabled: false,
        }}
      />

      <Stack.Screen
        name="AddOrEditLectureContent"
        component={AddOrEditLectureModalContent}
        options={({ navigation }) => ({
          headerTitle: '',
          headerLargeTitle: false,
          headerTransparent: false,
          presentation: 'modal',
          headerShadowVisible: false,
          headerBackVisible: false,

          headerLeft: () => (
            <HeaderTextButton
              onPress={() => navigation.goBack()}
              text={t('common.close')}
            />
          ),
        })}
      />

      <Stack.Screen
        name="EditLectureStaff"
        component={EditLectureStaffModalContent}
        options={({ navigation }) => ({
          headerTitle: '',
          headerLargeTitle: false,
          headerTransparent: false,
          presentation: 'modal',
          headerShadowVisible: false,
          headerBackVisible: false,

          headerLeft: () => (
            <HeaderTextButton
              onPress={() => navigation.goBack()}
              text={t('common.close')}
            />
          ),
        })}
      />

      <Stack.Screen
        name="EditRoom"
        component={ChooseRoomModal}
        options={({ navigation }) => ({
          headerTitle: '',
          headerLargeTitle: false,
          headerTransparent: false,
          presentation: 'modal',
          headerShadowVisible: false,
          headerBackVisible: false,

          headerLeft: () => (
            <HeaderTextButton
              onPress={() => navigation.goBack()}
              text={t('common.close')}
            />
          ),
        })}
      />

      <Stack.Screen
        name="AddStaff"
        component={AddStaffModalContent}
        options={({ navigation }) => ({
          headerTitle: '',
          headerLargeTitle: false,
          headerTransparent: false,
          presentation: 'modal',
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => (
            <HeaderTextButton
              onPress={() => navigation.goBack()}
              text={t('common.close')}
            />
          ),
        })}
      />

      <Stack.Screen
        name="MultiSelectLectures"
        component={CourseLectureMultiSelectScreen}
        options={({ navigation }) => ({
          headerTitle: '',
          headerLargeTitle: false,
          headerTransparent: false,
          presentation: 'modal',
          headerShadowVisible: false,
          headerBackVisible: false,

          headerLeft: () => (
            <HeaderTextButton
              onPress={() => navigation.goBack()}
              text={t('common.close')}
            />
          ),
        })}
      />

      <Stack.Screen
        name="DefineAccess"
        component={DefineAccessModal}
        options={({ navigation }) => ({
          headerTitle: '',
          headerLargeTitle: false,
          headerTransparent: false,
          presentation: 'modal',
          headerShadowVisible: false,
          headerBackVisible: true,
          headerLeft: () => (
            <HeaderTextButton
              onPress={() => navigation.goBack()}
              text={t('common.close')}
            />
          ),
        })}
      />

      <Stack.Screen
        name="Notice"
        component={NoticeScreen}
        getId={({ params }: { params: any }) =>
          `${params.courseId}${params.noticeId}`
        }
        options={{
          headerBackTitle: t('common.course'),
          headerTitle: t('common.notice_plural'),
          headerLargeTitle: false,
        }}
      />
      <Stack.Screen
        name="AddNoticeContent"
        component={AddNoticeContent}
        options={({ navigation }) => ({
          headerTitle: '',
          headerLargeTitle: false,
          headerTransparent: false,
          presentation: 'modal',
          headerShown: Platform.OS === 'android',
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => (
            <HeaderTextButton
              onPress={() => navigation.goBack()}
              text={t('common.close')}
            />
          ),
        })}
      />
      <Stack.Screen
        name="EditNoticeContent"
        component={EditNoticeContent}
        options={({ navigation }) => ({
          headerTitle: '',
          headerLargeTitle: false,
          headerTransparent: false,
          presentation: 'modal',
          headerShown: Platform.OS === 'android',
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => (
            <HeaderTextButton
              onPress={() => navigation.goBack()}
              text={t('common.close')}
            />
          ),
        })}
      />
      <Stack.Screen
        name="CourseGuide"
        component={CourseGuideScreen}
        getId={({ params }: { params: any }) => `${params.courseId}`}
        options={{
          headerTitle: t('courseGuideScreen.title'),
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
