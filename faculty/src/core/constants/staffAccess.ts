import { Staff } from '../../core/contexts/CoursesContext';

export const STAFF_ACCESS_VALUES = {
  full: 'Completo',
  partial: 'Parziale',
} as const;

export type StaffAccessValue =
  (typeof STAFF_ACCESS_VALUES)[keyof typeof STAFF_ACCESS_VALUES];

const LEGACY_ACCESS_MAP: Record<string, StaffAccessValue> = {
  [STAFF_ACCESS_VALUES.full]: STAFF_ACCESS_VALUES.full,
  [STAFF_ACCESS_VALUES.partial]: STAFF_ACCESS_VALUES.partial,
  'Può eliminare': STAFF_ACCESS_VALUES.full,
  'Può modificare': STAFF_ACCESS_VALUES.full,
  'Può leggere': STAFF_ACCESS_VALUES.partial,
};

export const normalizeStaffAccess = (access?: string): StaffAccessValue =>
  LEGACY_ACCESS_MAP[access ?? ''] ?? STAFF_ACCESS_VALUES.partial;

export const getStaffIdentityKey = (staff: Pick<Staff, 'id' | 'idProfile'>) =>
  String(staff.idProfile ?? staff.id);

export const isHolderStaff = (staff: Pick<Staff, 'role' | 'name'>) =>
  staff.role === 'Titolare' || staff.name.trim().toLowerCase() === 'tu';
