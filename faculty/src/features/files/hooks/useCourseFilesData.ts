import { useMemo } from 'react';

import { Directory } from '../types/Directory';
import { FileEntry } from '../types/FileEntry';

type CourseFileLike = {
  id: number | string;
  name: string;
  date?: string;
  size?: number;
  mimeType?: string;
};

type CourseDirectoryLike = {
  id: number;
  name: string;
  files: CourseFileLike[];
};

type CourseLike = {
  id: number;
  directories: CourseDirectoryLike[];
} | null;

/** Build canonical files/directories view models from selected course data. */
export const useCourseFilesData = (course: CourseLike) => {
  const files = useMemo<FileEntry[]>(
    () =>
      (course?.directories.flatMap(directory => directory.files) ?? []).map(
        file => ({
          id: String(file.id),
          name: file.name,
          date: file.date,
          size: file.size,
          mimeType: file.mimeType,
        }),
      ),
    [course],
  );

  const directories = useMemo<Directory[]>(
    () =>
      (course?.directories ?? []).map(directory => ({
        id: directory.id,
        name: directory.name,
        files: directory.files.map(file => ({
          id: String(file.id),
          name: file.name,
          date: file.date,
          size: file.size,
          mimeType: file.mimeType,
        })),
      })),
    [course],
  );

  return { files, directories };
};
