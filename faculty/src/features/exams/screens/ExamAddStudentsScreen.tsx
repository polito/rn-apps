import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { faCheck, faInbox } from '@fortawesome/free-solid-svg-icons';
import { useFeedbackContext } from '@polito/lib/core';
import {
  EmptyState,
  OverviewList,
  Theme,
  useHideTabs,
  useStylesheet,
} from '@polito/lib/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ExamStudentListItem } from '../components/ExamStudentListItem';
import { ExamStudentsSheet } from '../components/ExamStudentsSheet';
import { useExam, useExams } from '../contexts/ExamsContext';
import { useStudentSearch } from '../hooks/useStudentSearch';
import { ExamsStackParamList } from '../navigation/ExamsScreens';
import { toggleId } from '../utils/students';

type Props = NativeStackScreenProps<ExamsStackParamList, 'ExamAddStudents'>;

export const ExamAddStudentsScreen = ({ navigation, route }: Props) => {
  useHideTabs();
  const { id } = route.params;
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { setFeedback } = useFeedbackContext();
  const { addBookedStudents } = useExams();
  const { exam, courseStudents } = useExam(id);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const candidates = useMemo(
    () =>
      courseStudents.filter(
        student => !exam?.bookedStudentIds.includes(student.id),
      ),
    [courseStudents, exam?.bookedStudentIds],
  );
  const selectedStudents = useMemo(
    () => candidates.filter(student => selectedIds.has(student.id)),
    [candidates, selectedIds],
  );
  const { searchText, setSearchText, filteredStudents } =
    useStudentSearch(candidates);
  const unselectedStudents = filteredStudents.filter(
    student => !selectedIds.has(student.id),
  );

  if (!exam) {
    return <EmptyState icon={faInbox} message={t('examScreen.notFound')} />;
  }

  const onToggle = (studentId: string) =>
    setSelectedIds(prev => toggleId(prev, studentId));

  const onConfirm = () => {
    addBookedStudents(exam.id, Array.from(selectedIds));
    setFeedback({
      text: t('examAddStudentsScreen.added', { count: selectedIds.size }),
    });
    navigation.goBack();
  };

  return (
    <ExamStudentsSheet
      searchText={searchText}
      onChangeSearch={setSearchText}
      cta={{
        title: t('common.confirm'),
        icon: faCheck,
        disabled: selectedIds.size === 0,
        disabledHint: t('examStudentsList.selectAtLeastOneHint'),
        onPress: onConfirm,
      }}
    >
      {selectedStudents.length > 0 && (
        <View accessibilityRole="list">
          <OverviewList indented style={styles.selectedList}>
            {selectedStudents.map((student, index) => (
              <ExamStudentListItem
                key={student.id}
                student={student}
                variant="add"
                selected
                highlight={searchText}
                index={index}
                total={selectedStudents.length}
                onToggle={onToggle}
              />
            ))}
          </OverviewList>
        </View>
      )}
      <View accessibilityRole="list">
        <OverviewList
          indented
          emptyStateText={t('examStudentsList.noStudentsFound')}
        >
          {unselectedStudents.map((student, index) => (
            <ExamStudentListItem
              key={student.id}
              student={student}
              variant="add"
              selected={false}
              highlight={searchText}
              index={index}
              total={unselectedStudents.length}
              onToggle={onToggle}
            />
          ))}
        </OverviewList>
      </View>
    </ExamStudentsSheet>
  );
};

const createStyles = ({ dark, palettes }: Theme) =>
  StyleSheet.create({
    selectedList: {
      backgroundColor: dark ? palettes.gray[700] : palettes.gray[200],
    },
  });
