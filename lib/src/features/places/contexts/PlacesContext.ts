import { createContext } from 'react';

import { PlaceOverview } from '@polito/student-api-client';

import { NavField } from '../types';

interface PlacesContextValue {
  floorId?: string;
  setFloorId: (newFloorId?: string) => void;

  selectedSegmentId?: number;
  setSelectedSegmentId: (newSegmentId?: number) => void;

  selectionMode?: boolean;
  setSelectionMode: (mode: boolean) => void;

  handleSelectSegment: (label: number, floor: string) => void;

  selectedPlace: PlaceOverview | null;
  setSelectedPlace: (place: PlaceOverview | null) => void;

  navSelectorRoom: NavField | null;
  setNavSelectorRoom: (room: NavField | null) => void;

  avoidStairs: boolean;
  setAvoidStairs: (avoid: boolean) => void;
}

export const PlacesContext = createContext<PlacesContextValue>(
  {} as PlacesContextValue,
);
