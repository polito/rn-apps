import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { interdepartmentalSpacesApi } from '../api/interdepartmentalSpacesApi';
import { CreateSpaceEventRequest } from '../types/interdepartmentalSpaces';

export const INTERDEPARTMENTAL_SPACES_QUERY_KEY = [
  'bookings',
  'interdepartmental-spaces',
] as const;

export const INTERDEPARTMENTAL_SPACE_TYPES_QUERY_KEY = [
  'bookings',
  'interdepartmental-space-types',
] as const;

export const interdepartmentalSpaceQueryKey = (spaceId: string) =>
  ['bookings', 'interdepartmental-space', spaceId] as const;

export const useGetInterdepartmentalSpaces = () =>
  useQuery({
    queryKey: INTERDEPARTMENTAL_SPACES_QUERY_KEY,
    queryFn: () => interdepartmentalSpacesApi.getInterdepartmentalSpaces(),
    staleTime: Infinity,
  });

export const useGetInterdepartmentalSpaceTypes = () =>
  useQuery({
    queryKey: INTERDEPARTMENTAL_SPACE_TYPES_QUERY_KEY,
    queryFn: () => interdepartmentalSpacesApi.getInterdepartmentalSpaceTypes(),
    staleTime: Infinity,
  });

export const useGetInterdepartmentalSpace = (spaceId?: string) =>
  useQuery({
    queryKey: interdepartmentalSpaceQueryKey(spaceId ?? ''),
    queryFn: () => interdepartmentalSpacesApi.getInterdepartmentalSpace(spaceId!),
    enabled: !!spaceId,
  });

export const useCreateSpaceEvent = (spaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateSpaceEventRequest) =>
      interdepartmentalSpacesApi.createSpaceEvent(spaceId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: interdepartmentalSpaceQueryKey(spaceId),
      });
    },
  });
};

export const useUpdateSpaceEvent = (spaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      eventId,
      request,
    }: {
      eventId: string;
      request: CreateSpaceEventRequest;
    }) =>
      interdepartmentalSpacesApi.updateSpaceEvent(spaceId, eventId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: interdepartmentalSpaceQueryKey(spaceId),
      });
    },
  });
};

export const useDeleteSpaceEvent = (spaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) =>
      interdepartmentalSpacesApi.deleteSpaceEvent(spaceId, eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: interdepartmentalSpaceQueryKey(spaceId),
      });
    },
  });
};
