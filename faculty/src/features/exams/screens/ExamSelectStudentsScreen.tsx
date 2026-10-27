import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, View } from 'react-native';

import { faEnvelope, faInbox } from '@fortawesome/free-solid-svg-icons';
import { EmptyState, OverviewList, useHideTabs } from '@polito/lib/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ExamHeaderMenuButton } from '../components/ExamHeaderMenuButton';
import { ExamStudentListItem } from '../components/ExamStudentListItem';
import { ExamStudentsSheet } from '../components/ExamStudentsSheet';
import { useExam } from '../contexts/ExamsContext';
import { useStudentSearch } from '../hooks/useStudentSearch';
import { ExamsStackParamList } from '../navigation/ExamsScreens';
import { ExamStudentFilter } from '../types/exams';
import { toggleId } from '../utils/students';

type Props = NativeStackScreenProps<ExamsStackParamList, 'ExamSelectStudents'>;

const FILTER_ACTION_PREFIX = 'filter:';
const menuFilters: ExamStudentFilter[] = [
  'all',
  'specialNeeds',
  'attendanceDebt',
];

export const ExamSelectStudentsScreen = ({ navigation, route }: Props) => {
  useHideTabs();
  const { id } = route.params;
  const { t } = useTranslation();
  const { exam, bookedStudents } = useExam(id);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { searchText, setSearchText, filter, setFilter, filteredStudents } =
    useStudentSearch(bookedStudents);

  const isAllSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every(student => selectedIds.has(student.id));

  useLayoutEffect(() => {
    const onToggleAll = () =>
      setSelectedIds(prev => {
        const next = new Set(prev);
        filteredStudents.forEach(student =>
          isAllSelected ? next.delete(student.id) : next.add(student.id),
        );
        return next;
      });

    navigation.setOptions({
      headerTitle: t('examSelectStudentsScreen.title', {
        count: selectedIds.size,
        total: bookedStudents.length,
      }),
      headerRight: () => (
        <ExamHeaderMenuButton
          actions={[
            {
              id: 'toggleAll',
              title: t(
                isAllSelected
                  ? 'examStudentsList.deselectAll'
                  : 'examStudentsList.selectAll',
              ),
            },
            {
              id: 'filters',
              title: t('examStudentsList.filtersTitle'),
              displayInline: true,
              subactions: menuFilters.map(item => ({
                id: `${FILTER_ACTION_PREFIX}${item}`,
                title: t(
                  item === 'all'
                    ? 'examStudentsList.filters.none'
                    : `examStudentsList.filters.${item}`,
                ),
                state: item === filter ? 'on' : 'off',
              })),
            },
          ]}
          onPressAction={actionId => {
            if (actionId === 'toggleAll') {
              onToggleAll();
            } else if (actionId.startsWith(FILTER_ACTION_PREFIX)) {
              setFilter(
                actionId.slice(
                  FILTER_ACTION_PREFIX.length,
                ) as ExamStudentFilter,
              );
            }
          }}
        />
      ),
    });
  }, [
    bookedStudents.length,
    filter,
    filteredStudents,
    isAllSelected,
    navigation,
    selectedIds.size,
    setFilter,
    t,
  ]);

  if (!exam) {
    return <EmptyState icon={faInbox} message={t('examScreen.notFound')} />;
  }

  const onToggle = (studentId: string) =>
    setSelectedIds(prev => toggleId(prev, studentId));

  return (
    <ExamStudentsSheet
      searchText={searchText}
      onChangeSearch={setSearchText}
      cta={{
        title: t('examSelectStudentsScreen.contactSelected'),
        icon: faEnvelope,
        disabled: selectedIds.size === 0,
        disabledHint: t('examStudentsList.selectAtLeastOneHint'),
        onPress: () => Alert.alert(t('other.renderingToMail')),
      }}
    >
      <View accessibilityRole="list">
        <OverviewList
          indented
          emptyStateText={t('examStudentsList.noStudentsFound')}
        >
          {filteredStudents.map((student, index) => (
            <ExamStudentListItem
              key={student.id}
              student={student}
              variant="checkbox"
              selected={selectedIds.has(student.id)}
              highlight={searchText}
              index={index}
              total={filteredStudents.length}
              onToggle={onToggle}
            />
          ))}
        </OverviewList>
      </View>
    </ExamStudentsSheet>
  );
};
