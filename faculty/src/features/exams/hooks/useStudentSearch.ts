import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AccessibilityInfo } from 'react-native';

import { ExamStudent, ExamStudentFilter } from '../types/exams';
import { getStudentFullName, matchesStudentFilter } from '../utils/students';

const ANNOUNCE_DELAY_MS = 600;

export const useStudentSearch = (students: ExamStudent[]) => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState<ExamStudentFilter>('all');
  const query = searchText.trim().toLowerCase();

  const filteredStudents = useMemo(
    () =>
      students.filter(
        student =>
          matchesStudentFilter(student, filter) &&
          (!query ||
            student.id.toLowerCase().includes(query) ||
            getStudentFullName(student).toLowerCase().includes(query)),
      ),
    [filter, query, students],
  );

  useEffect(() => {
    if (!query && filter === 'all') return;
    const timeout = setTimeout(
      () =>
        AccessibilityInfo.announceForAccessibility(
          t('examStudentsList.resultsCount', {
            count: filteredStudents.length,
          }),
        ),
      ANNOUNCE_DELAY_MS,
    );
    return () => clearTimeout(timeout);
  }, [filter, filteredStudents.length, query, t]);

  return {
    searchText,
    setSearchText,
    query,
    filter,
    setFilter,
    filteredStudents,
  };
};
