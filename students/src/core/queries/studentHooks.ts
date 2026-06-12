import { useMemo } from 'react';

import { pluckData, toOASTruncable } from '@polito/lib/core';
import {
  AuthApi,
  ExamGrade,
  Message,
  MessageType,
  ProvisionalGradeState,
  StudentApi,
  StudentCareer,
  UpdateDevicePreferencesRequest,
} from '@polito/student-api-client';
import * as Sentry from '@sentry/react-native';
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { DateTime } from 'luxon';

import { filterUnread } from '../../utils/messages';
import { UpdateNotificationPreferencesRequestKey } from '../types/notificationTypes';
import { useMfaChallengeHandler } from './authHooks.ts';
import { COURSE_QUERY_PREFIX } from './courseHooks';

export const STUDENT_QUERY_KEY = ['student'];
export const PROFILE_QUERY_KEY = ['profile'];
export const SMART_CARD_QUERY_KEY = ['smartCard'];
const GRADES_QUERY_KEY = ['grades'];
const PROVISIONAL_GRADES_QUERY_KEY = ['provisionalGrades'];
const PROVISIONAL_GRADE_STATES_QUERY_KEY = ['provisionalGradeStates'];
const MESSAGES_QUERY_PREFIX = 'messages';
export const MESSAGES_QUERY_KEY = [MESSAGES_QUERY_PREFIX];
export const NOTIFICATIONS_QUERY_KEY = ['notifications'];
const NOTIFICATIONS_PREFERENCES_QUERY_KEY = ['notificationsPreferences'];
const GUIDES_QUERY_KEY = ['guides'];
export const DEADLINES_QUERY_PREFIX = 'deadlines';

const UNREAD_MAIL_QUERY_KEY = ['unreadEmails'];

const useStudentClient = (): StudentApi => {
  return new StudentApi();
};

export const useGetProfile = () =>
  useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: () => new AuthApi().getProfile().then(pluckData),
    gcTime: Infinity,
  });

export const useGetSmartCard = () =>
  useQuery({
    queryKey: SMART_CARD_QUERY_KEY,
    queryFn: () => new AuthApi().getSmartCardLink().then(pluckData),
    gcTime: Infinity,
  });

const handleAcquiredCredits = (student: StudentCareer) => {
  if (student.totalCredits < student.totalAttendedCredits) {
    student.totalCredits = student.totalAttendedCredits;
  }

  return student;
};

export const useGetStudent = () => {
  const studentClient = useStudentClient();

  const query = useQuery({
    queryKey: STUDENT_QUERY_KEY,
    queryFn: () =>
      studentClient
        .getStudentCareer()
        .then(pluckData)
        .then(handleAcquiredCredits)
        .then(s => {
          s.degreeLevel = s.degreeLevel.replace(/ in$/, '');
          return s;
        }),
    gcTime: Infinity,
  });

  // Handle success logic with useEffect or similar pattern if needed
  if (query.data && query.isSuccess) {
    Sentry.setTag('student_degree_id', query.data.degreeName);
    Sentry.setTag('student_degree_name', query.data.degreeId);
    Sentry.setTag('student_status', query.data.status);
    Sentry.setTag(
      'student_is_currently_enrolled',
      query.data.isCurrentlyEnrolled,
    );
  }

  return query;
};

const sortGrades = (response: ExamGrade[]) => {
  response = response.sort((a, b) => b.date.getTime() - a.date.getTime());
  return response;
};

export const useGetGrades = () => {
  const studentClient = useStudentClient();

  return useQuery({
    queryKey: GRADES_QUERY_KEY,
    queryFn: () =>
      studentClient.getStudentGrades().then(pluckData).then(sortGrades),
  });
};

export const useGetProvisionalGrades = () => {
  const studentClient = useStudentClient();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: PROVISIONAL_GRADES_QUERY_KEY,
    queryFn: () =>
      studentClient
        .getStudentProvisionalGrades()
        .then(r => {
          queryClient.setQueryData(
            PROVISIONAL_GRADE_STATES_QUERY_KEY,
            r.states,
          );
          return r;
        })
        .then(pluckData),
  });
};

export const useGetProvisionalGradeStates = () => {
  const provisionalGrades = useGetProvisionalGrades();

  return useQuery<ProvisionalGradeState[]>({
    queryKey: PROVISIONAL_GRADE_STATES_QUERY_KEY,
    queryFn: () => [],
    enabled: !!provisionalGrades.data,
    staleTime: Infinity,
  });
};

export const useAcceptProvisionalGrade = () => {
  const queryClient = useQueryClient();
  const studentClient = useStudentClient();

  return useMutation({
    mutationFn: (id: number) =>
      studentClient.acceptProvisionalGrade({ provisionalGradeId: id }),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: PROVISIONAL_GRADES_QUERY_KEY,
        }),
        queryClient.invalidateQueries({ queryKey: GRADES_QUERY_KEY }),
      ]),
  });
};

export const useRejectProvisionalGrade = () => {
  const queryClient = useQueryClient();
  const studentClient = useStudentClient();

  return useMutation({
    mutationFn: (id: number) =>
      studentClient.rejectProvisionalGrade({ provisionalGradeId: id }),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: PROVISIONAL_GRADES_QUERY_KEY,
        }),
      ]),
  });
};

const getDeadlineWeekQueryKey = (since: DateTime) => [
  DEADLINES_QUERY_PREFIX,
  since,
];

const getDeadlineWeekQueryFn = async (
  studentClient: StudentApi,
  since: DateTime,
) => {
  const until = since.endOf('week');

  return studentClient
    .getDeadlines({
      fromDate: toOASTruncable(since),
      toDate: toOASTruncable(until),
    })
    .then(pluckData);
};

export const useGetDeadlineWeek = (
  since: DateTime = DateTime.now().startOf('week'),
) => {
  const studentClient = useStudentClient();

  return useQuery({
    queryKey: getDeadlineWeekQueryKey(since),
    queryFn: async () => getDeadlineWeekQueryFn(studentClient, since),
    staleTime: Infinity,
  });
};

export const useGetDeadlineWeeks = (
  mondays: DateTime[] = [DateTime.now().startOf('week')],
) => {
  const studentClient = useStudentClient();

  const queries = useQueries({
    queries: (mondays ?? []).map(monday => ({
      queryKey: getDeadlineWeekQueryKey(monday),
      queryFn: async () => getDeadlineWeekQueryFn(studentClient, monday),
    })),
  });

  const isLoading = useMemo(() => {
    return queries.some(query => query.isLoading);
  }, [queries]);

  return {
    data: queries.map(query => query.data!),
    isLoading,
  };
};

export const useUpdateDevicePreferences = () => {
  const studentClient = useStudentClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateDevicePreferencesRequest) =>
      studentClient.updateDevicePreferences(dto),
    onSuccess: () => {
      return queryClient.invalidateQueries();
    },
  });
};

export const useGetMessages = () => {
  const queryClient = useQueryClient();
  const studentClient = useStudentClient();

  const { refetch: refetchMfaChallenge } = useMfaChallengeHandler();

  return useQuery({
    queryKey: MESSAGES_QUERY_KEY,
    queryFn: () =>
      studentClient
        .getMessages()
        .then(pluckData)
        .then(messages => {
          const previousMessages =
            queryClient.getQueryData<Message[]>(MESSAGES_QUERY_KEY);
          let hasMfaMessages = false;
          const unreadMessages = filterUnread(messages).filter(m => {
            if (m.type === MessageType.Mfa) {
              hasMfaMessages = true;
              return false;
            }
            return true;
          });

          if (hasMfaMessages) {
            refetchMfaChallenge();
          }

          if (
            previousMessages &&
            filterUnread(previousMessages).length >= unreadMessages.length
          ) {
            return messages;
          }

          queryClient.setQueryData(
            [MESSAGES_QUERY_PREFIX, 'modal'],
            unreadMessages,
          );

          return messages;
        }),
    staleTime: 300000, // 5 minutes
    refetchInterval: 300000, // 5 minutes
    refetchOnWindowFocus: 'always',
  });
};

export const useInvalidateMessages = () => {
  const queryClient = useQueryClient();

  return {
    run: () => queryClient.invalidateQueries({ queryKey: MESSAGES_QUERY_KEY }),
  };
};

export const useGetModalMessages = () => {
  const messagesQuery = useGetMessages();

  return useQuery<Message[]>({
    queryKey: [MESSAGES_QUERY_PREFIX, 'modal'],
    queryFn: () => [],
    enabled: !!messagesQuery.data,
    staleTime: Infinity,
  });
};

export const useMarkMessageAsRead = (invalidate: boolean = true) => {
  const studentClient = useStudentClient();
  const client = useQueryClient();

  return useMutation({
    mutationFn: (messageId: number) =>
      studentClient.markMessageAsRead({ messageId }),
    onSettled() {
      return (
        invalidate && client.invalidateQueries({ queryKey: MESSAGES_QUERY_KEY })
      );
    },
  });
};

export const useDeleteMessage = () => {
  const studentClient = useStudentClient();
  const client = useQueryClient();

  return useMutation({
    mutationFn: (messageId: number) =>
      studentClient.deleteMessage({ messageId }),
    onSuccess() {
      return client.invalidateQueries({ queryKey: MESSAGES_QUERY_KEY });
    },
  });
};

export const useGetGuides = () => {
  const studentClient = useStudentClient();

  return useQuery({
    queryKey: GUIDES_QUERY_KEY,
    queryFn: () => studentClient.getGuides().then(pluckData),
  });
};

export const useGetNotifications = () => {
  const studentClient = useStudentClient();

  return useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: () => studentClient.getNotifications(),
    staleTime: Infinity,
    refetchOnWindowFocus: true,
  });
};

export const useMarkNotificationAsRead = (invalidate: boolean = true) => {
  const studentClient = useStudentClient();
  const client = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) =>
      studentClient.markNotificationAsRead({ notificationId }),
    onSuccess() {
      return (
        invalidate &&
        client.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
      );
    },
  });
};

export const useGetNotificationPreferences = () => {
  const studentClient = useStudentClient();

  return useQuery({
    queryKey: NOTIFICATIONS_PREFERENCES_QUERY_KEY,
    queryFn: () => studentClient.getNotificationPreferences().then(pluckData),
  });
};

export const useUpdateNotificationPreference = () => {
  const studentClient = useStudentClient();
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({
      notificationType,
      targetValue,
    }: {
      notificationType: UpdateNotificationPreferencesRequestKey;
      targetValue: boolean;
    }) =>
      studentClient.updateNotificationPreferences({
        updateNotificationPreferencesRequest: {
          data: {
            [notificationType]: targetValue,
          },
        },
      }),
    onSuccess() {
      return Promise.all([
        client.invalidateQueries({
          queryKey: NOTIFICATIONS_PREFERENCES_QUERY_KEY,
        }),
        client.invalidateQueries({ queryKey: [COURSE_QUERY_PREFIX] }),
      ]);
    },
  });
};

export const useGetUnreadEmails = () => {
  const studentClient = useStudentClient();

  return useQuery({
    queryKey: UNREAD_MAIL_QUERY_KEY,
    queryFn: () => studentClient.getUnreadEmailsNumber().then(pluckData),
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });
};
