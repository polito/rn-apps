import { FileNavigatorID, usePreferencesContext } from '@polito/lib/core';
import { useTheme, useTitlesStyles } from '@polito/lib/ui';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AppPreferences } from '~/core/types/preferences';

import { useCourseContext } from '../contexts/CourseContext';
import { CourseDirectoryScreen } from '../screens/CourseDirectoryScreen';
import { CourseFilesScreen } from '../screens/CourseFilesScreen';

export type FileStackParamList = {
  RecentFiles: {
    courseId: number;
  };
  DirectoryFiles: {
    courseId: number;
    directoryId?: string;
    directoryName?: string;
    skipInitialDownloadCheck?: boolean;
  };
};

const Stack = createNativeStackNavigator<
  FileStackParamList,
  typeof FileNavigatorID
>();
export const FileNavigator = () => {
  const theme = useTheme();
  const courseId = useCourseContext();
  const { filesScreen } = usePreferencesContext<AppPreferences>();

  const initialRouteName =
    filesScreen === 'filesView' ? 'RecentFiles' : 'DirectoryFiles';

  return (
    <Stack.Navigator
      id={FileNavigatorID}
      screenOptions={{
        animation: 'none',
        headerShown: false,
        ...useTitlesStyles(theme),
      }}
      initialRouteName={initialRouteName}
    >
      <Stack.Screen
        name="RecentFiles"
        component={CourseFilesScreen}
        initialParams={{ courseId: courseId }}
      />
      <Stack.Screen
        name="DirectoryFiles"
        component={CourseDirectoryScreen}
        initialParams={{ courseId: courseId }}
      />
    </Stack.Navigator>
  );
};
