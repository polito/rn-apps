import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import { faMinus, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useFeedbackContext } from '@polito/lib/core';
import { HighlightedText } from '@polito/lib/features/people';
import {
  Col,
  CtaButton,
  GlobalStyles,
  Icon,
  ListItem,
  ModalContent,
  OverviewList,
  TranslucentTextField,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';

import { useCourses } from '../../core/contexts/CoursesContext';
import { enrollmentYearFromPeriod } from '../../features/students/utils';

type Props = {
  close: () => void;
};

const mockStudents = [
  { name: 'Paolo', surname: 'Serra' },
  { name: 'Angela', surname: 'Vitale' },
  { name: 'Riccardo', surname: 'Pini' },
  { name: 'Beatrice', surname: 'Leone' },
  { name: 'Tommaso', surname: 'Riva' },
  { name: 'Camilla', surname: 'Marchi' },
];

type MockStudent = (typeof mockStudents)[number];

const studentKey = (student: MockStudent) =>
  `${student.name} ${student.surname}`;

export const AddStudentsToExamModalContent = ({ close }: Props) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { palettes, dark } = useTheme();
  const { setFeedback } = useFeedbackContext();
  const { addStudentsToExam, selectedCourse, selectedExam } = useCourses();
  const [searchText, setSearchText] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<MockStudent[]>([]);
  // TODO: replace with server-issued IDs once the API is available.
  const studentCounterRef = useRef(1);

  const selectedKeys = useMemo(
    () => new Set(selectedStudents.map(studentKey)),
    [selectedStudents],
  );

  const filteredStudents = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return [];
    return mockStudents.filter(student => {
      if (selectedKeys.has(studentKey(student))) return false;
      return studentKey(student).toLowerCase().includes(q);
    });
  }, [searchText, selectedKeys]);

  const handleAdd = (student: MockStudent) => {
    setSelectedStudents(prev => [...prev, student]);
    setSearchText('');
  };

  const handleRemove = (student: MockStudent) => {
    setSelectedStudents(prev =>
      prev.filter(item => studentKey(item) !== studentKey(student)),
    );
  };

  const handleAddToExam = () => {
    if (!selectedExam) {
      setFeedback({
        text: t('other.examNotSelected', {
          defaultValue: 'Select an exam before adding students',
        }),
        isError: true,
      });
      return;
    }

    const newStudents: Parameters<typeof addStudentsToExam>[1] =
      selectedStudents.map(student => {
        const nextId = studentCounterRef.current.toString().padStart(4, '0');
        studentCounterRef.current += 1;
        return {
          id: `S32${nextId}`,
          name: student.name,
          surname: student.surname,
          year: enrollmentYearFromPeriod(selectedCourse?.year),
          exam: 'no' as const,
          cityOfBirth: 'Torino',
          degreeCourse: 'Informatica',
          passedExams: [],
          passedExamsDate: [],
        };
      });

    addStudentsToExam(selectedExam.id, newStudents);
    close();
  };

  const iconColor = dark ? palettes.gray[50] : palettes.primary[700];
  const actionColor = dark ? palettes.gray[400] : palettes.primary[600];

  return (
    <ModalContent title={t('other.addStudent')} close={close}>
      <Col pt={4} pb={4} ph={4} gap={3}>
        <View>
          <TranslucentTextField
            autoCorrect={false}
            leadingIcon={faSearch}
            value={searchText}
            onChangeText={setSearchText}
            style={GlobalStyles.grow}
            label={t('other.lookForStudent')}
            editable
            isClearable={searchText.length > 0}
            onClear={() => setSearchText('')}
            onClearLabel={t('contactsScreen.clearSearch')}
          />
        </View>

        {selectedStudents.length > 0 && (
          <OverviewList dividers indented style={styles.list}>
            {selectedStudents.map(student => (
              <ListItem
                key={studentKey(student)}
                title={studentKey(student)}
                leadingItem={
                  <Icon icon={faCircleUser} size={20} color={iconColor} />
                }
                trailingItem={
                  <Icon icon={faMinus} size={16} color={actionColor} />
                }
                onPress={() => handleRemove(student)}
              />
            ))}
          </OverviewList>
        )}

        {filteredStudents.length > 0 && (
          <OverviewList dividers indented style={styles.list}>
            {filteredStudents.map(student => (
              <ListItem
                key={studentKey(student)}
                title={
                  <HighlightedText
                    text={studentKey(student)}
                    highlight={searchText}
                  />
                }
                leadingItem={
                  <Icon icon={faCircleUser} size={20} color={iconColor} />
                }
                trailingItem={
                  <Icon icon={faPlus} size={16} color={actionColor} />
                }
                onPress={() => handleAdd(student)}
              />
            ))}
          </OverviewList>
        )}

        <CtaButton
          absolute={false}
          title={t('other.add')}
          action={handleAddToExam}
          disabled={selectedStudents.length === 0}
        />
      </Col>
    </ModalContent>
  );
};

const createStyles = () =>
  StyleSheet.create({
    list: {
      marginHorizontal: 0,
    },
  });
