import { Platform } from 'react-native';

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

/** File feature navigator hosting all file-related screens. */
export const FileNavigator = () => {
  return (
    <FileErrorBoundary>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="CourseFilesScreen" component={CourseFilesScreen} />
        <Stack.Screen
          name="CourseFolderFilesScreen"
          component={CourseFilesScreen}
          options={{
            presentation: Platform.OS === 'android' ? 'card' : 'modal',
            animation:
              Platform.OS === 'android' ? 'slide_from_right' : 'default',
            headerShown: Platform.OS === 'android',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="CourseDirectoryScreen"
          component={CourseDirectoryScreen}
        />
        <Stack.Screen name="ModifyFileScreen" component={ModifyFileScreen} />
      </Stack.Navigator>
    </FileErrorBoundary>
  );
};
