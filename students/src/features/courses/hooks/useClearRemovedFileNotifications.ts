import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useFeedbackContext } from '@polito/lib/core';
import { Notification } from '@polito/student-api-client';
import { useQueryClient } from '@tanstack/react-query';

import { get } from 'lodash';

import { useUnreadNotificationsByScope } from '../../../core/hooks/useNotifications';
import {
  flattenFiles,
  useGetCourseFiles,
} from '../../../core/queries/courseHooks';
import {
  NOTIFICATIONS_QUERY_KEY,
  useDeleteNotification,
  useGetNotifications,
} from '../../../core/queries/studentHooks';

/**
 * Deletes the unread notifications of course files that are no longer
 * available (e.g. removed by the teacher), so that their badges don't stay
 * visible forever, and informs the user with a toast.
 *
 * The course files are only fetched if the course has unread file
 * notifications.
 */
export const useClearRemovedFileNotifications = (courseId: number) => {
  const { t } = useTranslation();
  const { setFeedback } = useFeedbackContext();
  const queryClient = useQueryClient();
  const { mutateAsync: deleteNotification } = useDeleteNotification();
  const notificationsQuery = useGetNotifications();
  const unreadNotifications = useUnreadNotificationsByScope();
  const deletingIds = useRef(new Set<number>());

  const unreadFileNotifications = useMemo(
    () =>
      (get(unreadNotifications, [
        'teaching',
        'courses',
        `${courseId}`,
        'files',
      ]) ?? {}) as Record<string, Notification[]>,
    [courseId, unreadNotifications],
  );
  const hasUnreadFileNotifications =
    Object.keys(unreadFileNotifications).length > 0;

  const filesQuery = useGetCourseFiles(courseId, hasUnreadFileNotifications);

  useEffect(() => {
    if (!hasUnreadFileNotifications || !filesQuery.data) return;
    // A file referenced by a notification existed when the notifications were
    // fetched: it can be considered removed only if it's missing from a file
    // list fetched afterwards (and not, for instance, from an older cache)
    if (
      filesQuery.isFetching ||
      filesQuery.dataUpdatedAt <= notificationsQuery.dataUpdatedAt
    ) {
      return;
    }

    const fileIds = new Set(flattenFiles(filesQuery.data).map(f => `${f.id}`));
    const orphanNotifications = Object.entries(unreadFileNotifications)
      .filter(([fileId]) => !fileIds.has(fileId))
      .flatMap(([, notifications]) => notifications)
      .filter(n => !deletingIds.current.has(n.id));

    if (!orphanNotifications.length) return;

    orphanNotifications.forEach(n => deletingIds.current.add(n.id));
    Promise.allSettled(orphanNotifications.map(n => deleteNotification(n.id)))
      .then(results => {
        if (results.some(r => r.status === 'fulfilled')) {
          setFeedback({ text: t('courseFilesTab.removedFileNotification') });
        }
        return queryClient.invalidateQueries({
          queryKey: NOTIFICATIONS_QUERY_KEY,
        });
      })
      .finally(() =>
        orphanNotifications.forEach(n => deletingIds.current.delete(n.id)),
      );
  }, [
    deleteNotification,
    filesQuery.data,
    filesQuery.dataUpdatedAt,
    filesQuery.isFetching,
    hasUnreadFileNotifications,
    notificationsQuery.dataUpdatedAt,
    queryClient,
    setFeedback,
    t,
    unreadFileNotifications,
  ]);
};
