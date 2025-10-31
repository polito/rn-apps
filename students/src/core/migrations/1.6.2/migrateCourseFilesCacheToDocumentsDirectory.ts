import {
  CachesDirectoryPath,
  mkdir,
  moveFile,
  readDir,
  unlink,
} from 'react-native-fs';

import { PUBLIC_APP_DIRECTORY_PATH } from '@lib/core/constants';
import { PreferencesContextProps } from '@lib/core/contexts/PreferencesContext';
import { splitNameAndExtension } from '@lib/core/utils/files';

import { AppPreferences } from '~/core/types/preferences';

export const migrateCourseFilesCacheToDocumentsDirectory = async (
  preferences: PreferencesContextProps<AppPreferences>,
) => {
  const { username } = preferences;
  if (!username) {
    return;
  }

  try {
    const courseCachesPath = [CachesDirectoryPath, username, 'Courses'].join(
      '/',
    );
    const courseCaches = await readDir(courseCachesPath);
    for (const courseCache of courseCaches) {
      if (courseCache.isDirectory()) {
        const newCourseCachePath = [
          PUBLIC_APP_DIRECTORY_PATH,
          username,
          'Courses',
          courseCache.name,
        ].join('/');
        await mkdir(newCourseCachePath);
        const files = await readDir(courseCache.path);
        for (const courseFile of files) {
          if (courseFile.isFile()) {
            const [name, extension] = splitNameAndExtension(courseFile.name);
            const newPath = [newCourseCachePath, `(${name}).${extension}`].join(
              '/',
            );
            await moveFile(courseFile.path, newPath);
          }
        }
        await unlink(courseCache.path);
      }
    }
    await unlink(courseCachesPath);
  } catch (_) {
    // Empty cache, don't transfer
  }
};
