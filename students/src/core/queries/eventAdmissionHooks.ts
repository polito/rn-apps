import { pluckData } from '@polito/lib/core';
import {
  AuthApi,
  EventAdmissionsApi,
  GetAccessTokenAcceptEnum,
  TokenType,
} from '@polito/student-api-client';
import { useQuery } from '@tanstack/react-query';

export const EVENT_ADMISSIONS_QUERY_KEY = ['eventAdmissions'];
export const EVENT_QR_CODE_QUERY_PREFIX = 'eventQrCode';

const isSvg = (value?: string): value is string =>
  !!value && value.includes('<svg');

export const useGetEventAdmissions = () =>
  useQuery({
    queryKey: EVENT_ADMISSIONS_QUERY_KEY,
    queryFn: () =>
      new EventAdmissionsApi().getEventAdmissions().then(pluckData),
  });

export const useGetEventAdmissionById = (id: string) => {
  const query = useGetEventAdmissions();

  return {
    ...query,
    data: query.data?.find(event => event.id === id),
  };
};

export const useGetEventQrCode = (eventId?: string) =>
  useQuery({
    queryKey: [EVENT_QR_CODE_QUERY_PREFIX, eventId],
    queryFn: async () => {
      const svg = await new AuthApi().getAccessToken({
        type: TokenType.Event,
        id: eventId,
        accept: GetAccessTokenAcceptEnum.ImageSvgxml,
      });

      return isSvg(svg) ? svg : '';
    },
    enabled: !!eventId,
  });
