import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import {
  faCheck,
  faMinus,
  faPlus,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { useFeedbackContext } from '@polito/lib/core';
import { HighlightedText } from '@polito/lib/features/people';
import {
  CtaButton,
  GlobalStyles,
  Icon,
  ListItem,
  OverviewList,
  Row,
  Theme,
  TranslucentTextField,
  createHeaderCloseButton,
  useHideTabs,
  useSafeAreaSpacing,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useCourses } from '../../../core/contexts/CoursesContext';
import { CourseNotSelectedError } from '../errors/CourseNotSelectedError';
import type { StudentsStackParamList } from '../navigation/StudentsNavigator';
import { getCurrentAcademicYear } from '../utils';

const mockStudents = [
  { id: 's123456', name: 'Paolo', surname: 'Serra' },
  { id: 's123457', name: 'Angela', surname: 'Vitale' },
  { id: 's123458', name: 'Riccardo', surname: 'Pini' },
  { id: 's123459', name: 'Beatrice', surname: 'Leone' },
  { id: 's123460', name: 'Tommaso', surname: 'Riva' },
  { id: 's123461', name: 'Camilla', surname: 'Marchi' },
  { id: 's123462', name: 'Federica', surname: 'Bianchi' },
  { id: 's123463', name: 'Federica', surname: 'Rossi' },
  { id: 's123464', name: 'Federica', surname: 'Verdi' },
  { id: 's123465', name: 'Federica', surname: 'Chiari' },
];

type MockStudent = (typeof mockStudents)[0];

type Props = NativeStackScreenProps<StudentsStackParamList, 'AddStudents'>;

export const AddStudentsModalContent = ({ navigation }: Props) => {
  useHideTabs();
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { palettes, dark } = useTheme();
  const { paddingHorizontal } = useSafeAreaSpacing();
  const bottomTabBarHeight = useBottomTabBarHeight();
  const { setFeedback } = useFeedbackContext();
  const { addStudentsToCourse, selectedCourse } = useCourses();
  const [searchText, setSearchText] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<MockStudent[]>([]);
  // TODO: replace with server-issued IDs once the API is available.
  const studentCounterRef = useRef(100);
  const isConfirmEnabled = selectedStudents.length > 0;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: false,
      headerShadowVisible: false,
      headerRight:
        Platform.OS === 'ios' ? createHeaderCloseButton(navigation) : undefined,
    });
  }, [navigation]);

  const selectedIds = useMemo(
    () => new Set(selectedStudents.map(student => student.id)),
    [selectedStudents],
  );
  const filteredStudents = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return mockStudents.filter(student => {
      if (selectedIds.has(student.id)) return false;
      if (!q) return true;
      return (
        student.id.toLowerCase().includes(q) ||
        student.name.toLowerCase().includes(q) ||
        student.surname.toLowerCase().includes(q)
      );
    });
  }, [searchText, selectedIds]);

  const handleAdd = (student: MockStudent) => {
    setSelectedStudents(prev => [...prev, student]);
  };

  const handleRemove = (student: MockStudent) => {
    setSelectedStudents(prev => prev.filter(s => s.id !== student.id));
  };

  const handleConfirm = useCallback(() => {
    try {
      if (!selectedCourse) {
        throw new CourseNotSelectedError(
          t('other.courseNotSelected', {
            defaultValue: 'Select a course before adding students',
          }),
        );
      }

      const newStudents: Parameters<typeof addStudentsToCourse>[1] =
        selectedStudents.map(s => {
          const nextId = studentCounterRef.current.toString().padStart(4, '0');
          studentCounterRef.current += 1;
          return {
            id: `S32${nextId}`,
            name: s.name,
            surname: s.surname,
            year: getCurrentAcademicYear(),
            exam: 'no',
            // TODO: replace mock defaults with API-provided student profile fields.
            cityOfBirth: 'Torino',
            degreeCourse: 'Informatica',
            passedExams: [],
            passedExamsDate: [],
          };
        });
      addStudentsToCourse(selectedCourse.id, newStudents);
      navigation.goBack();
    } catch (e) {
      if (e instanceof CourseNotSelectedError) {
        setFeedback({ text: e.message, isError: true });
        return;
      }
      throw e;
    }
  }, [
    addStudentsToCourse,
    navigation,
    selectedCourse,
    selectedStudents,
    setFeedback,
    t,
  ]);

  const query = searchText.trim();

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <View style={[styles.searchBarWrap, paddingHorizontal]}>
        <Row align="center" style={styles.searchBar}>
          <TranslucentTextField
            autoCorrect={false}
            leadingIcon={faSearch}
            value={searchText}
            onChangeText={setSearchText}
            style={[GlobalStyles.grow, styles.textField]}
            label={t('other.lookForStudent')}
            editable
            isClearable={searchText.length > 0}
            onClear={() => setSearchText('')}
            onClearLabel={t('contactsScreen.clearSearch')}
          />
        </Row>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {selectedStudents.length > 0 && (
            <OverviewList
              dividers
              indented
              style={[
                styles.list,
                styles.selectedList,
                dark && styles.selectedListDark,
              ]}
            >
              {selectedStudents.map(student => (
                <ListItem
                  key={student.id}
                  title={
                    <HighlightedText
                      text={`${student.name} ${student.surname}`}
                      highlight={searchText}
                    />
                  }
                  subtitle={student.id}
                  leadingItem={
                    <Icon
                      icon={faCircleUser}
                      size={20}
                      color={dark ? palettes.gray[50] : palettes.primary[700]}
                    />
                  }
                  trailingItem={
                    <Icon
                      icon={faMinus}
                      size={16}
                      color={dark ? palettes.gray[400] : palettes.primary[600]}
                    />
                  }
                  onPress={() => handleRemove(student)}
                />
              ))}
            </OverviewList>
          )}

          {filteredStudents.length > 0 ? (
            <OverviewList
              dividers
              indented
              style={[
                styles.list,
                selectedStudents.length > 0 && styles.availableListWithSelected,
              ]}
            >
              {filteredStudents.map(student => (
                <ListItem
                  key={student.id}
                  title={
                    <HighlightedText
                      text={`${student.name} ${student.surname}`}
                      highlight={searchText}
                    />
                  }
                  subtitle={student.id}
                  leadingItem={
                    <Icon
                      icon={faCircleUser}
                      size={20}
                      color={dark ? palettes.gray[50] : palettes.primary[700]}
                    />
                  }
                  trailingItem={
                    <Icon
                      icon={faPlus}
                      size={16}
                      color={dark ? palettes.gray[400] : palettes.primary[600]}
                    />
                  }
                  onPress={() => handleAdd(student)}
                />
              ))}
            </OverviewList>
          ) : query ? (
            <OverviewList
              emptyStateText={t('other.noStudentsFound')}
              style={[
                styles.list,
                selectedStudents.length > 0 && styles.availableListWithSelected,
              ]}
            />
          ) : null}
        </ScrollView>

        <View
          style={[
            styles.ctaRow,
            Platform.OS === 'android'
              ? { paddingBottom: bottomTabBarHeight }
              : undefined,
          ]}
        >
          <CtaButton
            title={t('other.confirm', { defaultValue: 'Confirm' })}
            action={handleConfirm}
            icon={faCheck}
            disabled={!isConfirmEnabled}
            absolute={false}
            containerStyle={styles.ctaButtonContainer}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = ({ colors, spacing, palettes, shapes }: Theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    searchBarWrap: {
      overflow: 'hidden',
      paddingTop: spacing[3],
    },
    searchBar: {
      paddingBottom: spacing[2],
    },
    textField: {
      borderRadius: shapes.lg,
    },
    keyboardAvoiding: {
      flex: 1,
      minHeight: 0,
    },
    scroll: {
      flex: 1,
      minHeight: 0,
    },
    content: {
      paddingBottom: spacing[4],
    },
    list: {
      marginHorizontal: spacing[5],
    },
    selectedList: {
      backgroundColor: palettes.gray[200],
    },
    selectedListDark: {
      backgroundColor: palettes.gray[600],
    },
    availableListWithSelected: {
      marginTop: spacing[3],
    },
    ctaRow: {
      backgroundColor: colors.background,
      paddingHorizontal: spacing[5],
      paddingTop: spacing[2],
      paddingBottom: spacing[4],
    },
    ctaButtonContainer: {
      paddingTop: 0,
      paddingHorizontal: 0,
      paddingBottom: 0,
    },
  });
