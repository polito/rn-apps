import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { faInbox } from '@fortawesome/free-solid-svg-icons';
import { useFeedbackContext } from '@polito/lib/core';
import {
  EmptyState,
  OverviewList,
  TextButton,
  useHideTabs,
} from '@polito/lib/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ExamAttendanceCard } from '../components/ExamAttendanceCard';
import { ExamStudentFilters } from '../components/ExamStudentFilters';
import { ExamStudentsSheet } from '../components/ExamStudentsSheet';
import { useExam, useExams } from '../contexts/ExamsContext';
import { useStudentSearch } from '../hooks/useStudentSearch';
import { ExamsStackParamList } from '../navigation/ExamsScreens';

type Props = NativeStackScreenProps<ExamsStackParamList, 'ExamAttendance'>;

export const ExamAttendanceScreen = ({ navigation, route }: Props) => {
  useHideTabs();
  const { id } = route.params;
  const { t } = useTranslation();
  const { setFeedback } = useFeedbackContext();
  const { saveAttendance } = useExams();
  const { exam, bookedStudents } = useExam(id);
  const [absentIds, setAbsentIds] = useState<Set<string>>(
    () => new Set(exam?.absentStudentIds),
  );
  const { searchText, setSearchText, filter, setFilter, filteredStudents } =
    useStudentSearch(bookedStudents);

  useLayoutEffect(() => {
    if (!exam) return;
    navigation.setOptions({
      headerRight: () => (
        <TextButton
          accessibilityRole="button"
          accessibilityHint={t('examAttendanceScreen.confirmHint')}
          onPress={() => {
            saveAttendance(exam.id, Array.from(absentIds));
            setFeedback({ text: t('examAttendanceScreen.saved') });
            navigation.goBack();
          }}
        >
          {t('common.confirm')}
        </TextButton>
      ),
    });
  }, [absentIds, exam, navigation, saveAttendance, setFeedback, t]);

  if (!exam) {
    return <EmptyState icon={faInbox} message={t('examScreen.notFound')} />;
  }

  const onChange = (studentId: string, isAbsent: boolean) =>
    setAbsentIds(prev => {
      const next = new Set(prev);
      if (isAbsent) {
        next.add(studentId);
      } else {
        next.delete(studentId);
      }
      return next;
    });

  return (
    <ExamStudentsSheet
      searchText={searchText}
      onChangeSearch={setSearchText}
      filters={
        <ExamStudentFilters
          filters={['all', 'specialNeeds', 'graduating']}
          value={filter}
          onChange={setFilter}
        />
      }
      counter={t('examAttendanceScreen.absentCount', {
        count: absentIds.size,
        total: bookedStudents.length,
      })}
    >
      <View accessibilityRole="list">
        <OverviewList
          indented
          emptyStateText={t('examStudentsList.noStudentsFound')}
        >
          {filteredStudents.map((student, index) => (
            <ExamAttendanceCard
              key={student.id}
              student={student}
              isAbsent={absentIds.has(student.id)}
              highlight={searchText}
              index={index}
              total={filteredStudents.length}
              onChange={onChange}
            />
          ))}
        </OverviewList>
      </View>
    </ExamStudentsSheet>
  );
};
