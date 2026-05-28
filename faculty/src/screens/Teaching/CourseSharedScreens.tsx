import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';

import { Text } from '@polito/lib/ui';
import { useTheme } from '@polito/lib/ui';
import { ParamListBase } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AddNoticeContent } from './AddNoticeContent';
// import { CourseAssignmentPdfCreationScreen } from '../CourseAssignmentPdfCreationScreen';
// import { CourseAssignmentUploadConfirmationScreen } from '../screens/CourseAssignmentUploadConfirmationScreen';
// import { CourseAssignmentUploadScreen } from './CourseAssignmentUploadScreen';
// import { CourseColorPickerScreen } from '../screens/CourseColorPickerScreen';
// import { CourseDirectoryScreen } from '../screens/CourseDirectoryScreen';
// import { CourseGuideScreen } from './CourseGuideScreen';
// import { Assignment } from '../types/Assignment';
import { CourseNavigator } from './CourseNavigator';
// import { CourseHideEventScreen } from '../screens/CourseHideEventScreen';
// import { CourseIconPickerScreen } from '../screens/CourseIconPickerScreen';
import { CoursePreferencesScreen } from './CoursePreferencesScreen';
import { EditNoticeContent } from './EditNoticeContent';
// import { CourseVideolectureScreen } from '../screens/CourseVideolectureScreen';
// import { CourseVirtualClassroomScreen } from './CourseVirtualClassroomScreen';
import { NoticeScreen } from './NoticeScreen';

export interface CourseSharedScreensParamList extends ParamListBase {
  Course: {
    id: number;
    animated?: boolean;
    title?: string;
    uniqueShortcode?: string;
  };
  CoursePreferences: { courseId: number; uniqueShortcode: string };
  CourseGuide: { courseId: number };
  CourseDirectory: {
    courseId: number;
    directoryId?: string;
    directoryName?: string;
  };
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
  // CourseAssignmentPdfCreation: { courseId: number; firstImageUri: string };
  // CourseAssignmentUpload: { courseId: number };
  // CourseAssignmentUploadConfirmation: { courseId: number; file: Assignment };
  // CourseIconPicker: { courseId: number; uniqueShortcode: string };
  // CourseColorPicker: { courseId: number; uniqueShortcode: string };
  // CourseHideEvent: { courseId: number; uniqueShortcode: string };
}

const Stack = createNativeStackNavigator<CourseSharedScreensParamList>();

type HeaderTextButtonProps = {
  text: string;
  onPress: () => void;
};

const HeaderTextButton = ({ text, onPress }: HeaderTextButtonProps) => {
  const { palettes, fontSizes, spacing } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ padding: spacing[2], marginRight: -spacing[2] }}
    >
      <Text
        style={{
          fontSize: fontSizes.md,
          color: palettes.gray[600],
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export const CourseSharedScreens = () => {
  const { colors, fontSizes, fontWeights, fontFamilies, palettes } = useTheme();
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
          headerShadowVisible: false,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: fontFamilies.heading + '-SemiBold',
            fontSize: fontSizes.md,
            // fontWeight: fontWeights.semibold,
            color: palettes.primary[700],
          },
        }}
      />
      <Stack.Screen
        name="Notice"
        component={NoticeScreen}
        options={{
          headerTitle: () => (
            <Text
              variant="heading"
              style={{
                fontSize: fontSizes.md,
                textAlign: 'center',
                fontWeight: fontWeights.medium,
                width: 110,
              }}
              numberOfLines={1}
            >
              {t('common.notice_plural')}
            </Text>
          ),
          headerBackTitle: t('common.course'),
          headerShadowVisible: false,
          headerTransparent: false,
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
        name="CoursePreferences"
        component={CoursePreferencesScreen}
        getId={({ params }: { params: any }) => `${params.courseId}`}
        options={{
          title: t('common.preferences'),
          headerLargeTitle: false,
          headerBackTitle: t('common.course'),
        }}
      />

      {/* 
      <Stack.Screen
        name="CourseIconPicker"
        component={CourseIconPickerScreen}
        getId={({ params }: { params: any }) => `${params.courseId}`}
        options={{
          title: t('courseIconPickerScreen.title'),
          headerLargeTitle: false,
          headerSearchBarOptions: {},
        }}
      />
      <Stack.Screen
        name="CourseDirectory"
        component={CourseDirectoryScreen}
        getId={({ params }: { params: any }) => `${params?.directoryId}`}
        options={{
          headerBackButtonDisplayMode: 'minimal',
          headerLargeTitle: false,
        }}
      />
      <Stack.Screen
        name="CourseHideEvent"
        component={CourseHideEventScreen}
        getId={({ params }: { params: any }) => `${params.courseId}`}
        options={{
          title: t('common.hiddenEvents'),
          headerLargeTitle: false,
        }}
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
        name="CourseVideolecture"
        component={CourseVideolectureScreen}
        getId={({ params }: { params: any }) =>
          `${params.courseId}${params.lectureId}`
        }
        options={{
          headerLargeTitle: false,
          headerBackTitle: t('common.course'),
          title: t('common.videoLecture'),
        }}
      />
      <Stack.Screen
        name="CourseVirtualClassroom"
        component={CourseVirtualClassroomScreen}
        getId={({ params }: { params: any }) =>
          `${params.courseId}${params.lectureId}`
        }
        options={{
          headerLargeTitle: false,
          headerBackTitle: t('common.course'),
          title: t('courseVirtualClassroomScreen.title'),
        }}
      />
      <Stack.Screen
        name="CourseAssignmentPdfCreation"
        component={CourseAssignmentPdfCreationScreen}
        getId={({ params }: { params: any }) => `${params.courseId}`}
        options={{
          headerBackButtonDisplayMode: 'minimal',
          headerTitle: t('courseAssignmentPdfCreationScreen.title'),
          headerLargeTitle: false,
          headerTransparent: false,
        }}
      />
      <Stack.Screen
        name="CourseAssignmentUpload"
        component={CourseAssignmentUploadScreen}
        getId={({ params }: { params: any }) => `${params.courseId}`}
        options={{
          headerBackTitle: t('common.course'),
          headerTitle: t('courseAssignmentUploadScreen.title'),
          headerLargeTitle: false,
        }}
      />
      <Stack.Screen
        name="CourseAssignmentUploadConfirmation"
        component={CourseAssignmentUploadConfirmationScreen}
        getId={({ params }: { params: any }) => `${params.courseId}`}
        options={{
          headerBackTitle: t('courseAssignmentUploadScreen.backTitle'),
          headerTitle: t('courseAssignmentUploadScreen.title'),
          headerLargeStyle: {
            backgroundColor: colors.headersBackground,
          },
          headerTransparent: false,
          headerLargeTitle: false,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="CourseColorPicker"
        component={CourseColorPickerScreen}
        getId={({ params }) => `${params.courseId}`}
        options={{
          title: t('courseColorPickerScreen.title'),
          headerLargeTitle: false,
        }}
      /> */}
    </>
  );
};
