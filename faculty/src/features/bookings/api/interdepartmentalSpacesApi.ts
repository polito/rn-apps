import {
  CreateSpaceEventRequest,
  InterdepartmentalSpace,
  InterdepartmentalSpaceFilter,
  InterdepartmentalSpaceType,
  Slot,
} from '../types/interdepartmentalSpaces';

import { DateTime } from 'luxon';

const todayIso = () => DateTime.now().toFormat('yyyy-MM-dd');

const MOCK_FILTER: InterdepartmentalSpaceFilter = {
  sites: ['Torino', 'Verrès'],
  locations: ['Sede Centrale', 'Lingotto'],
  rooms: [
    {
      id: 'ENERGY-MR',
      name: 'Energy Center Meeting Room',
      numSeats: 5,
      type: 'meeting_room',
      location: 'Sede Centrale',
      site: 'Torino',
    },
    {
      id: 'ISIAD-MR',
      name: 'Sala riunioni ISIAD',
      numSeats: 10,
      type: 'meeting_room',
      location: 'Sede Centrale',
      site: 'Torino',
    },
    {
      id: 'LINGOTTO-A1',
      name: 'Aula A1 Lingotto',
      numSeats: 40,
      type: 'classroom',
      location: 'Lingotto',
      site: 'Torino',
    },
    {
      id: 'VERRES-MR',
      name: 'Sala riunioni Verrès',
      numSeats: 8,
      type: 'meeting_room',
      location: 'Sede Centrale',
      site: 'Verrès',
    },
  ],
};

const MOCK_TYPES: InterdepartmentalSpaceType[] = [
  { id: 'meeting', name: 'Meeting' },
  { id: 'seminar', name: 'Seminar' },
  { id: 'workshop', name: 'Workshop' },
  { id: 'exam', name: 'Exam' },
  { id: 'other', name: 'Other' },
];

const buildSpaceDetail = (roomId: string, slots: Slot[]): InterdepartmentalSpace => {
  const room = MOCK_FILTER.rooms.find(item => item.id === roomId);
  if (!room) {
    throw new Error(`Space ${roomId} not found`);
  }

  return {
    id: room.id,
    name: room.name,
    numSeats: room.numSeats,
    type: room.type,
    place: {
      buildingId: room.location.toLowerCase().replace(/\s+/g, '-'),
      floorId: '0',
      roomId: room.id,
      siteId: room.site.toLowerCase(),
      name: room.name,
    },
    slotsOccupied: slots,
  };
};

const initialSlotsBySpace: Record<string, Slot[]> = {
  'ISIAD-MR': [
    {
      id: 'slot-001',
      startAt: `${todayIso()}T13:00:00+01:00`,
      endAt: `${todayIso()}T15:30:00+01:00`,
      idLocations: 'ISIAD-MR',
      bookedBy: {
        username: 'e123456',
        name: 'Erica',
        surname: 'Erle',
        email: 'e123456@polito.it',
      },
      description: 'ISIAD Department Council',
      type: 'meeting',
      note: '',
    },
    {
      id: 'slot-002',
      startAt: `${todayIso()}T10:00:00+01:00`,
      endAt: `${todayIso()}T11:30:00+01:00`,
      idLocations: 'ISIAD-MR',
      bookedBy: {
        username: 'l234567',
        name: 'Luca',
        surname: 'Bianchi',
        email: 'l234567@polito.it',
      },
      description: 'Private strategy session',
      type: 'meeting',
      note: '',
    },
  ],
};

const slotsBySpace = new Map<string, Slot[]>(
  Object.entries(initialSlotsBySpace).map(([spaceId, slots]) => [
    spaceId,
    [...slots],
  ]),
);

const delay = (ms = 300) => new Promise<void>(resolve => setTimeout(resolve, ms));

const getSlots = (spaceId: string) => slotsBySpace.get(spaceId) ?? [];

const setSlots = (spaceId: string, slots: Slot[]) => {
  slotsBySpace.set(spaceId, slots);
};

/**
 * Mock implementation of the Interdepartmental Spaces API.
 * Replace with generated client calls when the backend is available.
 */
export const interdepartmentalSpacesApi = {
  async getInterdepartmentalSpaces(): Promise<InterdepartmentalSpaceFilter> {
    await delay();
    return MOCK_FILTER;
  },

  async getInterdepartmentalSpaceTypes(): Promise<InterdepartmentalSpaceType[]> {
    await delay();
    return MOCK_TYPES;
  },

  async getInterdepartmentalSpace(id: string): Promise<InterdepartmentalSpace> {
    await delay();
    return buildSpaceDetail(id, getSlots(id));
  },

  async createSpaceEvent(
    spaceId: string,
    request: CreateSpaceEventRequest,
  ): Promise<string> {
    await delay();
    const slots = getSlots(spaceId);
    const eventDate = request.eventDate ?? new Date().toISOString().slice(0, 10);
    const slot: Slot = {
      id: `slot-${Date.now()}`,
      startAt: `${eventDate}T${request.startsAt}`,
      endAt: `${eventDate}T${request.endsAt}`,
      idLocations: spaceId,
      bookedBy: {
        username: 'mrossi',
        name: 'Marco',
        surname: 'Rossi',
        email: 'marco.rossi@polito.it',
      },
      description: request.eventDescription,
      type: request.type,
      note: request.notes,
    };
    setSlots(spaceId, [...slots, slot]);
    return slot.id;
  },

  async updateSpaceEvent(
    spaceId: string,
    eventId: string,
    request: CreateSpaceEventRequest,
  ): Promise<void> {
    await delay();
    const slots = getSlots(spaceId);
    const eventDate = request.eventDate ?? new Date().toISOString().slice(0, 10);
    setSlots(
      spaceId,
      slots.map(slot =>
        slot.id === eventId
          ? {
              ...slot,
              startAt: `${eventDate}T${request.startsAt}`,
              endAt: `${eventDate}T${request.endsAt}`,
              description: request.eventDescription,
              type: request.type,
              note: request.notes,
            }
          : slot,
      ),
    );
  },

  async deleteSpaceEvent(spaceId: string, eventId: string): Promise<void> {
    await delay();
    const slots = getSlots(spaceId);
    setSlots(
      spaceId,
      slots.filter(slot => slot.id !== eventId),
    );
  },
};
