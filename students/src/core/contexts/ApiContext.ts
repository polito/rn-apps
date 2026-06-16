import {
  AuthApi,
  BookingsApi,
  CoursesApi,
  ExamsApi,
  JobOffersApi,
  LecturesApi,
  NewsApi,
  OfferingApi,
  PeopleApi,
  PlacesApi,
  StudentApi,
  TicketsApi,
} from '@polito/student-api-client';

// The ApiContext (credentials, login state, refresh) is shared across apps
export {
  ApiContext,
  useApiContext,
  type ApiContextProps,
  type Credentials,
} from '@polito/lib/core';

export interface ApiContextClientsProps {
  auth: AuthApi;
  bookings: BookingsApi;
  courses: CoursesApi;
  exams: ExamsApi;
  lectures: LecturesApi;
  people: PeopleApi;
  places: PlacesApi;
  student: StudentApi;
  tickets: TicketsApi;
  news: NewsApi;
  jobOffers: JobOffersApi;
  offering: OfferingApi;
}
