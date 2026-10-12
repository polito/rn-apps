import { PlacesStackParamList } from '@polito/lib/features/places';
import { NavigatorScreenParams } from '@react-navigation/native';

import { AgendaStackParamList } from '../../screens/Agenda/AgendaNavigator';
import { TeachingStackParamList } from '../../screens/Teaching/TeachingNavigator';

export type RootParamList = {
  TeachingTab: NavigatorScreenParams<TeachingStackParamList>;
  AgendaTab: NavigatorScreenParams<AgendaStackParamList>;
  PlacesTab: NavigatorScreenParams<PlacesStackParamList>;
  ServicesTab: undefined;
  ProfileTab: undefined;
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
