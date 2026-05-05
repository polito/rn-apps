import { Platform } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { FileStackParamList } from '../../../core/types/navigation';
import { FileErrorBoundary } from '../FileErrorBoundary';
import {
  CourseDirectoryScreen,
  CourseFilesScreen,
  ModifyFileScreen,
} from '../screens';

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
