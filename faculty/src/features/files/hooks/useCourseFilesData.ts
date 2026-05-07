import { useMemo } from 'react';

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

export const useCourseFilesData = (course: CourseLike) => {
  const files = useMemo<FileEntry[]>(
    () =>
      (course?.directories.flatMap(directory => directory.files) ?? []).map(
        mapFileEntry,
      ),
    [course],
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

  return { files, directories };
};
