import { useMemo } from 'react';

import type { StudentIdentity } from '../types';

type UseFilteredStudentsOptions = {
  excludedIds?: Set<string>;
};

export const useFilteredStudents = <TStudent extends StudentIdentity>(
  students: TStudent[],
  query: string,
  options?: UseFilteredStudentsOptions,
) =>
  useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const excludedIds = options?.excludedIds;

    return students.filter(student => {
      if (excludedIds?.has(student.id)) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return (
        student.id.toLowerCase().includes(normalizedQuery) ||
        student.name.toLowerCase().includes(normalizedQuery) ||
        student.surname.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [students, query, options?.excludedIds]);
