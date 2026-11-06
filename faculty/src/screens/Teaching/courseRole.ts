import type { TagColor } from '../../core/components/Tag';
import type { Staff } from '../../core/contexts/CoursesContext';

export type CourseRole = 'owner' | 'collaborator' | 'viewer';

const CURRENT_USER_PROFILE_ID = 0;

export const COURSE_ROLE_TAG_COLOR: Record<CourseRole, TagColor> = {
  owner: 'primary',
  collaborator: 'success',
  viewer: 'gray',
};

export const getStaffRole = (
  member: Pick<Staff, 'role' | 'access'>,
): CourseRole => {
  if (member.role === 'Titolare') return 'owner';
  if (member.access === 'Può leggere') return 'viewer';
  return 'collaborator';
};

export const getCourseRole = (course: {
  staff?: Staff[];
}): CourseRole | undefined => {
  const me = course.staff?.find(
    member => member.idProfile === CURRENT_USER_PROFILE_ID,
  );
  return me ? getStaffRole(me) : undefined;
};
