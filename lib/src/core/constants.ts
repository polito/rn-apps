import { Dimensions, Platform } from 'react-native';
import { DocumentDirectoryPath, ExternalDirectoryPath } from 'react-native-fs';

export const IS_ANDROID = Platform.OS === 'android';
export const IS_IOS = Platform.OS === 'ios';
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get('screen');
export const MAX_RECENT_SEARCHES = 10;
export const ANDROID_DOCUMENT_DIRECTORY_PATH = '/storage/emulated/0/Documents';
export const PUBLIC_APP_DIRECTORY_PATH = IS_IOS
  ? DocumentDirectoryPath
  : Platform.Version > '29'
    ? ANDROID_DOCUMENT_DIRECTORY_PATH
    : ExternalDirectoryPath;
export const MAX_CONCURRENT_DOWNLOADS = 3;

export const GITHUB_REPOSITORY_URL = 'https://github.com/polito/rn-apps';
export const GITHUB_URL = `${GITHUB_REPOSITORY_URL}/releases/latest`;

// Navigator IDs
export const AgendaNavigatorID = 'AgendaTabNavigator';
export const FileNavigatorID = 'FileTabNavigator';
export const TeachingNavigatorID = 'TeachingTabNavigator';
export const UserNavigatorID = 'UserTabNavigator';
