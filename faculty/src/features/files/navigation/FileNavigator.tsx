import { Platform } from 'react-native';

import { useTheme, useTitlesStyles } from '@polito/lib/ui';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { FileErrorBoundary } from '../FileErrorBoundary';
import {
  CourseDirectoryScreen,
  CourseFilesScreen,
  ModifyFileScreen,
} from '../screens';

export type FileStackParamList = {
  CourseFilesScreen: { courseId: number; path?: string; directoryId?: number };
  CourseFolderFilesScreen: {
    courseId: number;
    path?: string;
    directoryId: number;
  };
  CourseDirectoryScreen: { courseId: number; path?: string };
  CourseFilesUploadScreen: { courseId: number; path?: string };
  CourseFileMultiSelectScreen: {
    courseId: number;
    path?: string;
    action?: 'move' | 'delete';
    initialSelectedIds?: string[];
  };
  ModifyFileScreen: { courseId: number; fileId: string };
  MoveFilesScreen: { courseId?: number; fileIds?: string[] };
};

const Stack = createNativeStackNavigator<FileStackParamList>();

const modalScreenOptions = {
  headerLargeTitle: false,
  presentation:
    Platform.OS === 'android' ? ('card' as const) : ('modal' as const),
  ...(Platform.OS === 'ios' ? { sheetGrabberVisible: true } : {}),
};

/** File feature navigator hosting all file-related screens. */
export const FileNavigator = () => {
  const theme = useTheme();
  const { colors } = theme;

  return (
    <FileErrorBoundary>
      <Stack.Navigator
        screenOptions={{
          headerLargeTitle: false,
          headerTransparent: Platform.select({ ios: true }),
          headerLargeStyle: {
            backgroundColor: colors.background,
          },
          headerBlurEffect: 'systemUltraThinMaterial',
          ...useTitlesStyles(theme),
        }}
      >
        <Stack.Screen
          name="CourseFilesScreen"
          component={CourseFilesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CourseFolderFilesScreen"
          component={CourseFilesScreen}
          options={{
            ...modalScreenOptions,
            animation:
              Platform.OS === 'android' ? 'slide_from_right' : 'default',
            headerShown: true,
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="CourseDirectoryScreen"
          component={CourseDirectoryScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ModifyFileScreen"
          component={ModifyFileScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </FileErrorBoundary>
  );
};
