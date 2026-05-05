import { useMemo } from 'react';

import { CourseFileEntry } from '../types/CourseFileEntry';
import { Directory } from '../types/Directory';
import { FileEntry } from '../types/FileEntry';
import { mapFileEntry } from '../utils/mapFileEntry';

type RawCourseFile = {
  id: number | string;
  name: string;
  date?: string;
  size?: number;
  mimeType?: string;
};

type CourseDirectoryLike = {
  id: number | string;
  name: string;
  files: RawCourseFile[];
};

type CourseLike = {
  id: number;
  directories: CourseDirectoryLike[];
} | null;

/** Build canonical files/directories view models from selected course data. */
export const useCourseFilesData = (course: CourseLike) => {
  const fileEntries = useMemo<CourseFileEntry[]>(
    () =>
      (course?.directories.flatMap(directory => directory.files) ?? []).map(
        file => ({
          file: mapFileEntry(file),
          status: 'idle',
        }),
      ),
    [course],
  );

  const files = useMemo<FileEntry[]>(
    () => fileEntries.map(entry => entry.file),
    [fileEntries],
  );

  const directories = useMemo<Directory[]>(
    () =>
      (course?.directories ?? []).map(directory => ({
        id: String(directory.id),
        name: directory.name,
        files: directory.files.map(mapFileEntry),
      })),
    [course],
  );

  return { files, directories, fileEntries };
};
