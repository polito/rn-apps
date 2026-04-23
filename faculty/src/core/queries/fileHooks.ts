import { pluckData } from '@polito/lib/core';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const FILE_QUERY_PREFIX = 'file';

export const fileKeys = {
  all: [FILE_QUERY_PREFIX] as const,
  directory: (courseId: number, path?: string) =>
    [FILE_QUERY_PREFIX, courseId, 'dir', path ?? ''] as const,
  file: (courseId: number, fileId: string) =>
    [FILE_QUERY_PREFIX, courseId, 'file', fileId] as const,
};

/**
 * NOTE: faculty currently has no established API query layer.
 * These hooks mirror the students architecture and are ready to be
 * wired to concrete API methods as soon as endpoint signatures are exposed.
 */
const getFilesApiClient = () => {
  // `@polito/api-client` methods are app-config driven through global DefaultConfig.
  // We keep this indirection to preserve the students pattern.

  const pkg = require('@polito/api-client');
  return new pkg.CoursesApi();
};

export const useGetCourseDirectory = (courseId: number, path?: string) => {
  return useQuery({
    queryKey: fileKeys.directory(courseId, path),
    queryFn: async () => {
      const client = getFilesApiClient();
      return client
        .getCourseFiles({
          courseId,
          path,
        })
        .then(pluckData);
    },
    enabled: !!courseId,
  });
};

export const useGetCourseFile = (courseId: number, fileId: string) => {
  return useQuery({
    queryKey: fileKeys.file(courseId, fileId),
    queryFn: async () => {
      const client = getFilesApiClient();
      return client
        .getCourseFile({
          courseId,
          fileId,
        })
        .then(pluckData);
    },
    enabled: !!courseId && !!fileId,
  });
};

export const useUploadCourseFile = (courseId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: unknown) => {
      const client = getFilesApiClient();
      return client.uploadCourseFile({
        courseId,
        uploadCourseFileRequest: payload,
      });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: fileKeys.directory(courseId) }),
  });
};

export const useCreateCourseFolder = (courseId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: unknown) => {
      const client = getFilesApiClient();
      return client.createCourseFolder({
        courseId,
        createCourseFolderRequest: payload,
      });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: fileKeys.directory(courseId) }),
  });
};

export const useRenameCourseFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      courseId: number;
      fileId: string;
      body: unknown;
    }) => {
      const client = getFilesApiClient();
      return client.renameCourseFile({
        courseId: payload.courseId,
        fileId: payload.fileId,
        renameCourseFileRequest: payload.body,
      });
    },
    onSuccess: (_, vars) =>
      queryClient.invalidateQueries({
        queryKey: fileKeys.directory(vars.courseId),
      }),
  });
};

export const useMoveCourseFiles = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { courseId: number; body: unknown }) => {
      const client = getFilesApiClient();
      return client.moveCourseFiles({
        courseId: payload.courseId,
        moveCourseFilesRequest: payload.body,
      });
    },
    onSuccess: (_, vars) =>
      queryClient.invalidateQueries({
        queryKey: fileKeys.directory(vars.courseId),
      }),
  });
};

export const useDeleteCourseFiles = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { courseId: number; body: unknown }) => {
      const client = getFilesApiClient();
      return client.deleteCourseFiles({
        courseId: payload.courseId,
        deleteCourseFilesRequest: payload.body,
      });
    },
    onSuccess: (_, vars) =>
      queryClient.invalidateQueries({
        queryKey: fileKeys.directory(vars.courseId),
      }),
  });
};

export const useUpdateCourseFileMeta = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      courseId: number;
      fileId: string;
      body: unknown;
    }) => {
      const client = getFilesApiClient();
      return client.updateCourseFileMeta({
        courseId: payload.courseId,
        fileId: payload.fileId,
        updateCourseFileMetaRequest: payload.body,
      });
    },
    onSuccess: (_, vars) =>
      queryClient.invalidateQueries({
        queryKey: fileKeys.directory(vars.courseId),
      }),
  });
};
