import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { FileStackParamList } from '../../../core/types/navigation';
import {
  CourseDirectoryScreen,
  CourseFilesScreen,
  ModifyFileScreen,
  MoveFilesScreen,
} from '../screens';

const Stack = createNativeStackNavigator<FileStackParamList>();

/** File feature navigator hosting all file-related screens. */
export const FileNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CourseFilesScreen" component={CourseFilesScreen} />
      <Stack.Screen
        name="CourseFolderFilesScreen"
        component={CourseFilesScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="CourseDirectoryScreen"
        component={CourseDirectoryScreen}
      />
      <Stack.Screen
        name="MoveFilesScreen"
        component={MoveFilesScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen name="ModifyFileScreen" component={ModifyFileScreen} />
    </Stack.Navigator>
  );
};
