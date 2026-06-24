import { Platform } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';

import { pluckData, rethrowApiError } from '@polito/lib/core';
import {
  BASE_PATH,
  CreateTicketRequest,
  GetTicketAttachmentRequest,
  GetTicketReplyAttachmentRequest,
  ReplyToTicketRequest,
  TicketFeedbackRequest,
  TicketsApi,
} from '@polito/student-api-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useApiContext } from '../contexts/ApiContext';
import { cacheDirectory } from '../storage/fileSystem';

export const TICKETS_QUERY_KEY = ['tickets'];
export const TICKET_QUERY_PREFIX = 'ticket';

const TICKETS_ATTACHMENTS_PREFIX = 'attachments';
const TOPICS_QUERY_KEY = ['topics'];
const FAQS_QUERY_KEY = ['faqs'];

const useTicketsClient = (): TicketsApi => {
  return new TicketsApi();
};

export const useGetTickets = () => {
  const ticketsClient = useTicketsClient();

  return useQuery({
    queryKey: TICKETS_QUERY_KEY,
    queryFn: () => ticketsClient.getTickets().then(pluckData),
  });
};

export const useCreateTicket = () => {
  const client = useQueryClient();
  const ticketsClient = useTicketsClient();

  return useMutation({
    mutationFn: async (dto: CreateTicketRequest) => {
      try {
        const res = await ticketsClient.createTicket(dto);
        return pluckData(res);
      } catch (err) {
        await rethrowApiError(err as Error);
      }
    },
    onSuccess() {
      return client.invalidateQueries({ queryKey: TICKETS_QUERY_KEY });
    },
  });
};

export const useReplyToTicket = (ticketId: number) => {
  const client = useQueryClient();
  const ticketsClient = useTicketsClient();
  const invalidatesQueries = [
    TICKETS_QUERY_KEY,
    [TICKET_QUERY_PREFIX, ticketId],
  ];

  return useMutation({
    mutationFn: (dto: ReplyToTicketRequest) => {
      return ticketsClient.replyToTicket(dto);
    },
    onSuccess() {
      return invalidatesQueries.forEach(queryKey =>
        client.invalidateQueries({ queryKey }),
      );
    },
  });
};

export const useGiveTicketReplyFeedback = (
  ticketId: number,
  replyId: number,
) => {
  const client = useQueryClient();
  const ticketsClient = useTicketsClient();

  return useMutation({
    mutationFn: (positive: boolean) =>
      ticketsClient.setTicketReplyFeedback({ ticketId, replyId, positive }),
    onSuccess(_data, positive) {
      if (positive) {
        client.invalidateQueries({ queryKey: TICKETS_QUERY_KEY });
      }
      client.invalidateQueries({
        queryKey: [TICKET_QUERY_PREFIX, ticketId],
      });
    },
  });
};

// TEMP: local testing without backend. Set to false (and delete usages)
// once @polito/student-api-client with resolveTicket/WaitingUser is published.
export const MOCK_TICKET_RESOLVE = true;

// TEMP: which step of the flow to preview on closed tickets while mocking.
// 'resolve'  -> in-chat "Sì, risolvi il ticket" CTA (start of the loop)
// 'rate'     -> resolved ticket with the "Valuta ticket" bar
// 'feedback' -> resolved ticket with the "Feedback inserito" block
export const MOCK_TICKET_STAGE: 'resolve' | 'rate' | 'feedback' = 'resolve';

// TEMP: sample feedback shown in the "Feedback inserito" block while mocking.
// The real values will come from the ticket once the API exposes them.
export const MOCK_TICKET_FEEDBACK = {
  rating: 1,
  comment:
    "Il sistema di ticketing ha funzionato bene, ma l'operatore 'Luca' ha impiegato troppo tempo per rispondere.",
  createdAt: new Date('2026-03-15T15:30:00'),
};

export const useProvideTicketFeedback = (ticketId: number) => {
  const client = useQueryClient();
  const ticketsClient = useTicketsClient();
  const invalidatesQueries = [
    TICKETS_QUERY_KEY,
    [TICKET_QUERY_PREFIX, ticketId],
  ];

  return useMutation({
    mutationFn: async (ticketFeedbackRequest: TicketFeedbackRequest) => {
      if (MOCK_TICKET_RESOLVE) {
        // TEMP: simulate feedback locally, no network call
        await new Promise(resolve => setTimeout(resolve, 600));
        console.debug('[MOCK] provideTicketFeedback', {
          ticketId,
          ...ticketFeedbackRequest,
        });
        return;
      }
      return ticketsClient.provideTicketFeedback({
        ticketId,
        ticketFeedbackRequest,
      });
    },
    onSuccess() {
      if (MOCK_TICKET_RESOLVE) {
        return;
      }
      return invalidatesQueries.forEach(queryKey =>
        client.invalidateQueries({ queryKey }),
      );
    },
  });
};

export const useGetTicket = (ticketId: number) => {
  const ticketsClient = useTicketsClient();

  return useQuery({
    queryKey: [TICKET_QUERY_PREFIX, ticketId],
    queryFn: () => ticketsClient.getTicket({ ticketId }).then(pluckData),
  });
};

export const useMarkTicketAsClosed = (ticketId: number) => {
  const ticketsClient = useTicketsClient();
  const client = useQueryClient();
  const invalidatesQueries = [
    TICKETS_QUERY_KEY,
    [TICKET_QUERY_PREFIX, ticketId],
  ];

  return useMutation({
    mutationFn: () => ticketsClient.markTicketAsClosed({ ticketId }),
    onSuccess() {
      return invalidatesQueries.forEach(queryKey =>
        client.invalidateQueries({ queryKey }),
      );
    },
  });
};

export const useMarkTicketAsRead = (ticketId: number) => {
  const ticketsClient = useTicketsClient();
  const client = useQueryClient();
  const invalidatesQueries = [
    TICKETS_QUERY_KEY,
    [TICKET_QUERY_PREFIX, ticketId],
  ];

  return useMutation({
    mutationFn: () => ticketsClient.markTicketAsRead({ ticketId }),
    onSuccess() {
      return invalidatesQueries.forEach(queryKey =>
        client.invalidateQueries({ queryKey }),
      );
    },
  });
};

export const useGetTicketTopics = () => {
  const ticketsClient = useTicketsClient();

  return useQuery({
    queryKey: TOPICS_QUERY_KEY,
    queryFn: () => ticketsClient.getTicketTopics().then(pluckData),
  });
};

export const useGetTicketReplyAttachment = (
  { ticketId, replyId, attachmentId }: GetTicketReplyAttachmentRequest,
  fileName: string,
  enabled: boolean,
) => {
  const { token } = useApiContext();

  return useQuery({
    queryKey: [TICKETS_ATTACHMENTS_PREFIX, ticketId, replyId, attachmentId],
    queryFn: () =>
      ReactNativeBlobUtil.config({
        fileCache: true,
        path:
          cacheDirectory +
          Platform.select({ android: '/', ios: '' }) +
          fileName,
      })
        .fetch(
          'GET',
          BASE_PATH +
            `/tickets/${ticketId}/replies/${replyId}/attachments/${attachmentId}`,
          {
            Authorization: `Bearer ${token}`,
          },
        )
        .then(
          res => Platform.select({ android: 'file://', ios: '' }) + res.path(),
        ),
    enabled,
  });
};

export const useGetTicketAttachment = (
  { ticketId, attachmentId }: GetTicketAttachmentRequest,
  fileName: string,
  enabled: boolean,
) => {
  const { token } = useApiContext();

  return useQuery({
    queryKey: [TICKETS_ATTACHMENTS_PREFIX, ticketId, attachmentId],
    queryFn: () =>
      ReactNativeBlobUtil.config({
        fileCache: true,
        path:
          cacheDirectory +
          Platform.select({ android: '/', ios: '' }) +
          fileName,
      })
        .fetch(
          'GET',
          BASE_PATH + `/tickets/${ticketId}/attachments/${attachmentId}`,
          {
            Authorization: `Bearer ${token}`,
          },
        )
        .then(
          res => Platform.select({ android: 'file://', ios: '' }) + res.path(),
        ),
    enabled,
  });
};

export const useSearchTicketFaqs = (search: string) => {
  const ticketsClient = useTicketsClient();

  return useQuery({
    queryKey: FAQS_QUERY_KEY,
    queryFn: () => ticketsClient.searchTicketFAQs({ search }).then(pluckData),
    enabled: false,
    staleTime: 0,
  });
};
