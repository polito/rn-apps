import { pluckData } from '@polito/lib/core';
import {
  Announcement,
  AnnouncementScope,
  AnnouncementsApi,
} from '@polito/student-api-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const WHATS_NEW_SCOPES = new Set<AnnouncementScope>([
  AnnouncementScope.Onboarding,
  AnnouncementScope.AppInfo,
]);

export const getWhatsNewArchiveAnnouncements = (items: Announcement[] = []) =>
  [...items]
    .filter(item => WHATS_NEW_SCOPES.has(item.scope))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const ANNOUNCEMENTS_QUERY_PREFIX = 'announcements';
export const ANNOUNCEMENTS_QUERY_KEY = [ANNOUNCEMENTS_QUERY_PREFIX];

const useAnnouncementsClient = (): AnnouncementsApi => {
  return new AnnouncementsApi();
};

export const useGetAnnouncements = (
  seen?: boolean,
  scope?: AnnouncementScope,
) => {
  const client = useAnnouncementsClient();

  return useQuery({
    queryKey: [...ANNOUNCEMENTS_QUERY_KEY, { seen, scope }],
    queryFn: async () => {
      const fetchBySeen = (isNew: boolean) =>
        client.getAnnouncements({ _new: isNew }).then(pluckData);

      const data =
        seen === undefined
          ? await Promise.all([fetchBySeen(true), fetchBySeen(false)]).then(
              ([unseen, alreadySeen]) => {
                const byId = new Map(
                  [...unseen, ...alreadySeen].map(item => [item.id, item]),
                );
                return [...byId.values()];
              },
            )
          : await fetchBySeen(!seen);

      return scope ? data.filter(a => a.scope === scope) : data;
    },
  });
};

export const useMarkAnnouncementAsRead = () => {
  const client = useAnnouncementsClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (announcementId: string) => {
      return client.markAnnouncementAsRead({ announcementId });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ANNOUNCEMENTS_QUERY_KEY }),
  });
};
