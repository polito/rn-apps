import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { FileDownloadStatus } from '@polito/lib/ui';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Directory } from '../types/Directory';
import { FileEntry } from '../types/FileEntry';
import { sortByNameAsc, sortByNameDesc } from '../utils/sorting';

const sortStorageCache = new Map<string, string>();

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
  const sortStorageKey = storageKey
    ? `@files_sort_mode_${storageKey}`
    : undefined;
  const viewStorageKey = storageKey
    ? `@files_view_mode_${storageKey}`
    : undefined;
  const [viewMode, setViewMode] = useState<FileViewMode>(
    () =>
      (viewStorageKey &&
        (sortStorageCache.get(viewStorageKey) as FileViewMode)) ||
      initialViewMode,
  );
  const [sortMode, setSortMode] = useState<FileSortMode>(
    () =>
      (sortStorageKey &&
        (sortStorageCache.get(sortStorageKey) as FileSortMode)) ||
      initialSortMode,
  );
  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, FileDownloadStatus>
  >({});
  const downloadTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>(
    {},
  );

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
          sortStorageCache.set(sortStorageKey, value);
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
          sortStorageCache.set(viewStorageKey, value);
          setViewMode(value);
        }
      } catch {}
    };
    loadViewMode().catch(() => undefined);
  }, [viewStorageKey]);

  useEffect(() => {
    if (!sortStorageKey) return;
    sortStorageCache.set(sortStorageKey, sortMode);
    const saveSortMode = async () => {
      try {
        await AsyncStorage.setItem(sortStorageKey, sortMode);
      } catch {}
    };
    saveSortMode().catch(() => undefined);
  }, [sortMode, sortStorageKey]);

  useEffect(() => {
    if (!viewStorageKey) return;
    sortStorageCache.set(viewStorageKey, viewMode);
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

    if (sortMode === 'nameAsc') return sortByNameAsc(filtered);
    if (sortMode === 'nameDesc') return sortByNameDesc(filtered);

    return [...filtered].sort((a, b) => {
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

    if (sortMode === 'nameAsc') return sortByNameAsc(filtered);
    if (sortMode === 'nameDesc') return sortByNameDesc(filtered);

    return [...filtered].sort((a, b) => {
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
    sortedFiles,
    sortedDirectories,
    startDownload,
    getFileStatus,
  };
};
