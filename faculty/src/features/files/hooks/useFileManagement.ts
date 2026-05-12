import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { FileDownloadStatus } from '@polito/lib/ui';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Directory } from '../types/Directory';
import { FileEntry } from '../types/FileEntry';

const compareByName = (
  a: string,
  b: string,
  sortMode: FileSortMode,
): number => {
  const comparison = a.localeCompare(b);
  return sortMode === 'nameAsc' ? comparison : -comparison;
};

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
    if (!sortStorageKey) {
      return;
    }
    const loadSortMode = async () => {
      try {
        const value = await AsyncStorage.getItem(sortStorageKey);
        if (
          value === 'nameAsc' ||
          value === 'nameDesc' ||
          value === 'mostRecent' ||
          value === 'oldestFirst'
        ) {
          setSortMode(value);
        }
      } catch {}
    };
    loadSortMode().catch(() => undefined);
  }, [sortStorageKey]);

  useEffect(() => {
    if (!viewStorageKey) {
      return;
    }
    const loadViewMode = async () => {
      try {
        const value = await AsyncStorage.getItem(viewStorageKey);
        if (value === 'files' || value === 'folders') {
          setViewMode(value);
        }
      } catch {}
    };
    loadViewMode().catch(() => undefined);
  }, [viewStorageKey]);

  useEffect(() => {
    if (!sortStorageKey) return;
    const saveSortMode = async () => {
      try {
        await AsyncStorage.setItem(sortStorageKey, sortMode);
      } catch {}
    };
    saveSortMode().catch(() => undefined);
  }, [sortMode, sortStorageKey]);

  useEffect(() => {
    if (!viewStorageKey) return;
    const saveViewMode = async () => {
      try {
        await AsyncStorage.setItem(viewStorageKey, viewMode);
      } catch {}
    };
    saveViewMode().catch(() => undefined);
  }, [viewMode, viewStorageKey]);

  const normalizedSearch = useMemo(() => search.trim().toLowerCase(), [search]);

  const sortedFiles = useMemo(() => {
    const filtered = normalizedSearch
      ? files.filter(file => file.name.toLowerCase().includes(normalizedSearch))
      : files;

    return [...filtered].sort((a, b) => {
      if (sortMode === 'nameAsc' || sortMode === 'nameDesc') {
        return compareByName(a.name, b.name, sortMode);
      }

      const aDate = Date.parse(a.date ?? '');
      const bDate = Date.parse(b.date ?? '');
      const aValid = Number.isFinite(aDate);
      const bValid = Number.isFinite(bDate);

      // Files without a date always go to the bottom regardless of sort direction
      if (!aValid && !bValid) return 0;
      if (!aValid) return 1;
      if (!bValid) return -1;

      return sortMode === 'mostRecent' ? bDate - aDate : aDate - bDate;
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
        return compareByName(a.name, b.name, sortMode);
      }
      return a.id.localeCompare(b.id, undefined, { numeric: true });
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
    (fileId: string): FileDownloadStatus => {
      return statusOverrides[fileId] ?? 'idle';
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
