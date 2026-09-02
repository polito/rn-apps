import { Building, PlaceOverview } from '@polito/student-api-client';

export type SearchPlace = PlaceOverview | Building;

export const isPlace = (
  placeOrBuilding: SearchPlace,
): placeOrBuilding is PlaceOverview => 'room' in placeOrBuilding;

export type NavigationPlaceType = {
  placeId: string;
  namePlace: string;
};

export type NavField = 'start' | 'destination';

export type Fingerprint = {
  locationName: string;
  signals: Record<string, number>;
};
