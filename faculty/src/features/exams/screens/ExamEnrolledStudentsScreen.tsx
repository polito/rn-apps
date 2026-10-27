import { useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';

import { faInbox } from '@fortawesome/free-solid-svg-icons';
import {
  BottomBarSpacer,
  EmptyState,
  OverviewList,
  Theme,
  useStylesheet,
} from '@polito/lib/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ExamEnrolledStudentListItem } from '../components/ExamEnrolledStudentListItem';
import { ExamEnrolledSummary } from '../components/ExamEnrolledSummary';
import { ExamHeaderMenuButton } from '../components/ExamHeaderMenuButton';
import { ExamStudentFilters } from '../components/ExamStudentFilters';
import { ExamStudentSearchBar } from '../components/ExamStudentSearchBar';
import { useExam } from '../contexts/ExamsContext';
import { useStudentSearch } from '../hooks/useStudentSearch';
import { ExamsStackParamList } from '../navigation/ExamsScreens';
import { sortStudentsByName } from '../utils/students';

type Props = NativeStackScreenProps<
  ExamsStackParamList,
  'ExamEnrolledStudents'
>;

export const ExamEnrolledStudentsScreen = ({ navigation, route }: Props) => {
  const { id } = route.params;
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { exam, bookedStudents } = useExam(id);
  const [ascending, setAscending] = useState(true);
  const sortedStudents = useMemo(
    () => sortStudentsByName(bookedStudents, ascending),
    [ascending, bookedStudents],
  );
  const {
    searchText,
    setSearchText,
    query,
    filter,
    setFilter,
    filteredStudents,
  } = useStudentSearch(sortedStudents);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <ExamHeaderMenuButton
          actions={[
            { id: 'select', title: t('examEnrolledStudentsScreen.select') },
            {
              id: 'sort',
              title: t('examEnrolledStudentsScreen.sortByName'),
              subtitle: t(
                ascending
                  ? 'examEnrolledStudentsScreen.ascending'
                  : 'examEnrolledStudentsScreen.descending',
              ),
            },
          ]}
          onPressAction={actionId => {
            if (actionId === 'select') {
              navigation.navigate('ExamSelectStudents', { id });
            } else if (actionId === 'sort') {
              setAscending(prev => !prev);
            }
          }}
        />
      ),
    });
  }, [ascending, id, navigation, t]);

  if (!exam) {
    return <EmptyState icon={faInbox} message={t('examScreen.notFound')} />;
  }

  return (
    <View style={styles.root}>
      <View style={styles.top}>
        <ExamStudentFilters
          filters={['all', 'specialNeeds', 'attendanceDebt']}
          value={filter}
          onChange={setFilter}
        />
        <ExamStudentSearchBar value={searchText} onChangeText={setSearchText} />
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {filter === 'all' && !query && (
          <ExamEnrolledSummary students={bookedStudents} />
        )}
        <View accessibilityRole="list">
          <OverviewList
            indented
            emptyStateText={t('examStudentsList.noStudentsFound')}
          >
            {filteredStudents.map((student, index) => (
              <ExamEnrolledStudentListItem
                key={student.id}
                student={student}
                highlight={searchText}
                index={index}
                total={filteredStudents.length}
              />
            ))}
          </OverviewList>
        </View>
        <BottomBarSpacer />
      </ScrollView>
    </View>
  );
};

const createStyles = ({ colors, dark, palettes, spacing }: Theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    top: {
      paddingBottom: spacing[3],
      gap: spacing[1],
      backgroundColor: dark ? palettes.gray[800] : palettes.gray[100],
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.divider,
    },
    content: {
      paddingVertical: spacing[5],
      gap: spacing[5],
    },
  });
