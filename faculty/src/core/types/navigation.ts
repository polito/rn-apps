import { NavigatorScreenParams } from '@react-navigation/native';

// import { AgendaStackParamList } from '../../features/agenda/components/AgendaNavigator';
// import { ServiceStackParamList } from '../../features/services/components/ServicesNavigator';
import { TeachingStackParamList } from '../../screens/Teaching/TeachingNavigator';

// import { UserStackParamList } from '../../features/user/components/UserNavigator';

export type RootParamList = {
  TeachingTab: NavigatorScreenParams<TeachingStackParamList>;
  // AgendaTab: NavigatorScreenParams<AgendaStackParamList>;
  PlacesTab: NavigatorScreenParams<never>;
  // ServicesTab: NavigatorScreenParams<ServiceStackParamList>;
  // ProfileTab: NavigatorScreenParams<UserStackParamList>;
};

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
