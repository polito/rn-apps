import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { FileDownloadStatus } from '@polito/lib/ui';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Directory } from '../types/Directory';
import { FileEntry } from '../types/FileEntry';

export type FileSortMode =
  | 'nameAsc'
  | 'nameDesc'
  | 'mostRecent'
  | 'oldestFirst';
export type FileViewMode = 'files' | 'folders';

interface UseFileManagementOptions {
  files: FileEntry[];
  directories: Directory[];
  initialViewMode?: FileViewMode;
  initialSortMode?: FileSortMode;
  storageKey?: string;
}

/** Encapsulate sorting/filtering/view/download-state helpers for file screens. */
export const useFileManagement = ({
  files,
  directories,
  initialViewMode = 'files',
  initialSortMode = 'oldestFirst',
  storageKey,
}: UseFileManagementOptions) => {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<FileViewMode>(initialViewMode);
  const [sortMode, setSortMode] = useState<FileSortMode>(initialSortMode);
  const [confirmDownloadFileId, setConfirmDownloadFileId] = useState<
    string | undefined
  >(undefined);
  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, FileDownloadStatus>
  >({});
  const downloadTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>(
    {},
  );
  const sortStorageKey = storageKey
    ? `@files_sort_mode_${storageKey}`
    : undefined;
  const viewStorageKey = storageKey
    ? `@files_view_mode_${storageKey}`
    : undefined;

  useEffect(() => {
    return () => {
      Object.values(downloadTimers.current).forEach(clearTimeout);
      downloadTimers.current = {};
    };
  }, []);

  useEffect(() => {
    if (!sortStorageKey) return;
    AsyncStorage.getItem(sortStorageKey)
      .then(value => {
        if (
          value === 'nameAsc' ||
          value === 'nameDesc' ||
          value === 'mostRecent' ||
          value === 'oldestFirst'
        ) {
          setSortMode(value);
        }
      })
      .catch(() => {});
  }, [sortStorageKey]);

  useEffect(() => {
    if (!viewStorageKey) return;
    AsyncStorage.getItem(viewStorageKey)
      .then(value => {
        if (value === 'files' || value === 'folders') {
          setViewMode(value);
        }
      })
      .catch(() => {});
  }, [viewStorageKey]);

  useEffect(() => {
    if (!sortStorageKey) return;
    AsyncStorage.setItem(sortStorageKey, sortMode).catch(() => {});
  }, [sortMode, sortStorageKey]);

  useEffect(() => {
    if (!viewStorageKey) return;
    AsyncStorage.setItem(viewStorageKey, viewMode).catch(() => {});
  }, [viewMode, viewStorageKey]);

  const normalizedSearch = useMemo(() => search.trim().toLowerCase(), [search]);

  const sortedFiles = useMemo(() => {
    const filtered = normalizedSearch
      ? files.filter(file => file.name.toLowerCase().includes(normalizedSearch))
      : files;

    return [...filtered].sort((a, b) => {
      if (sortMode === 'nameAsc' || sortMode === 'nameDesc') {
        const comparison = a.name.localeCompare(b.name);
        return sortMode === 'nameAsc' ? comparison : -comparison;
      }

      const aDate = Date.parse(a.date ?? '');
      const bDate = Date.parse(b.date ?? '');
      const hasValidDate = Number.isFinite(aDate) && Number.isFinite(bDate);

      if (hasValidDate) {
        return sortMode === 'mostRecent' ? bDate - aDate : aDate - bDate;
      }

      const fallbackComparison = (a.date ?? '').localeCompare(b.date ?? '');
      return sortMode === 'mostRecent'
        ? -fallbackComparison
        : fallbackComparison;
    });
  }, [files, normalizedSearch, sortMode]);

  const sortedDirectories = useMemo(() => {
    const filtered = normalizedSearch
      ? directories.filter(directory =>
          directory.name.toLowerCase().includes(normalizedSearch),
        )
      : directories;

    return [...filtered].sort((a, b) => {
      if (sortMode === 'nameAsc' || sortMode === 'nameDesc') {
        const comparison = a.name.localeCompare(b.name);
        return sortMode === 'nameAsc' ? comparison : -comparison;
      }
      return a.id - b.id;
    });
  }, [directories, normalizedSearch, sortMode]);

  const startDownload = useCallback((fileId: string) => {
    setStatusOverrides(prev => ({
      ...prev,
      [fileId]: 'syncing',
    }));

    if (downloadTimers.current[fileId]) {
      clearTimeout(downloadTimers.current[fileId]);
    }

    downloadTimers.current[fileId] = setTimeout(() => {
      setStatusOverrides(prev => ({
        ...prev,
        [fileId]: 'downloaded',
      }));
      delete downloadTimers.current[fileId];
    }, 2000);
  }, []);

  const getFileStatus = useCallback(
    (fileId: string, indexHint: number): FileDownloadStatus => {
      const defaultStatus: FileDownloadStatus =
        indexHint < 2 ? 'idle' : indexHint % 2 === 0 ? 'idle' : 'syncing';
      return statusOverrides[fileId] ?? defaultStatus;
    },
    [statusOverrides],
  );

  return {
    search,
    setSearch,
    viewMode,
    setViewMode,
    sortMode,
    setSortMode,
    confirmDownloadFileId,
    setConfirmDownloadFileId,
    sortedFiles,
    sortedDirectories,
    startDownload,
    getFileStatus,
  };
};
