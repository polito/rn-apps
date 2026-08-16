/**
 * Types derived from the faculty OpenAPI draft:
 * https://github.com/polito/api-spec/tree/feature/interdepartmental-spaces
 *
 * Backend not yet connected — kept in sync with the spec for future integration.
 */

export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface Booker {
  username: string;
  name: string;
  surname: string;
  email: string;
}

export interface PlaceRef {
  buildingId: string;
  floorId: string;
  roomId: string;
  siteId: string;
  name: string;
}

export interface Slot {
  id: string;
  startAt: string;
  endAt: string;
  idLocations: string;
  bookedBy: Booker;
  description: string;
  type: string;
  note: string;
}

export interface InterdepartmentalSpaceRoom {
  id: string;
  name: string;
  numSeats: number;
  type: string;
  location: string;
  site: string;
}

export interface InterdepartmentalSpaceFilter {
  locations: string[];
  sites: string[];
  rooms: InterdepartmentalSpaceRoom[];
}

export interface InterdepartmentalSpace {
  id: string;
  name: string;
  numSeats: number;
  type: string;
  place: PlaceRef;
  slotsOccupied: Slot[];
}

export interface InterdepartmentalSpaceType {
  id: string;
  name: string;
}

export interface CreateSpaceEventRequest {
  eventDate?: string;
  startsAt: string;
  endsAt: string;
  recurrenceStartsAt?: string;
  recurrenceEndsAt?: string;
  recurrenceDays?: DayOfWeek[];
  type: string;
  eventDescription: string;
  seatsToAllocate?: number;
  notes: string;
  isPubliclyVisible: boolean;
}

export interface ApiDataResponse<T> {
  data: T;
}
