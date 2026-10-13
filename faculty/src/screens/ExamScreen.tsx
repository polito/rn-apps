import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { faSquare } from '@fortawesome/free-regular-svg-icons';
import {
  faCalendar,
  faCheckSquare,
  faCircleInfo,
  faClock,
  faEnvelope,
  faInbox,
  faLocationDot,
  faPlus,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { formatDateFromString } from '@polito/lib/core';
import {
  BottomBarSpacer,
  BottomModal,
  CtaButton,
  CtaButtonContainer,
  EmptyState,
  Icon,
  ListItem,
  OverviewList,
  Section,
  SectionHeader,
  Theme,
  TranslucentTextField,
  useBottomModal,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useCourses } from '../core/contexts/CoursesContext';
import { AddStudentsToExamModalContent } from './Teaching/AddStudentsToExamModalContent';
import { TeachingStackParamList } from './Teaching/TeachingNavigator';

type Props = NativeStackScreenProps<TeachingStackParamList, 'Exam'>;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}/;

export const ExamScreen = ({ navigation, route }: Props) => {
  const { id } = route.params;
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { colors, fontSizes } = useTheme();
  const { fakeExams, setSelectedStudent } = useCourses();
  const {
    open: showBottomModal,
    modal: bottomModal,
    close: closeBottomModal,
  } = useBottomModal();
  const [searchText, setSearchText] = useState('');
  const [presentIds, setPresentIds] = useState<string[]>([]);

  const exam = fakeExams.find(item => item.id === id);

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: exam?.subject ?? '' });
  }, [navigation, exam?.subject]);

  if (!exam) {
    return <EmptyState icon={faInbox} message={t('examScreen.notFound')} />;
  }

  const formatExamDate = (date: string) =>
    ISO_DATE.test(date) ? formatDateFromString(date) : date;

  const today = new Date();
  const examDate = new Date(exam.date);
  const isToday =
    exam.date === 'Oggi' ||
    (examDate.getFullYear() === today.getFullYear() &&
      examDate.getMonth() === today.getMonth() &&
      examDate.getDate() === today.getDate());

  const query = searchText.toLowerCase().trim();
  const filteredStudents = exam.students.filter(
    student =>
      student.id.toString().toLowerCase().includes(query) ||
      student.name.toLowerCase().includes(query) ||
      student.surname.toLowerCase().includes(query),
  );

  const togglePresence = (studentId: string) =>
    setPresentIds(prev =>
      prev.includes(studentId)
        ? prev.filter(item => item !== studentId)
        : [...prev, studentId],
    );

  const details = [
    {
      icon: faCalendar,
      title: t('other.examDate'),
      value: isToday ? t('other.today') : formatExamDate(exam.date),
    },
    {
      icon: faClock,
      title: t('other.bookingDeadline'),
      value: isToday ? t('other.closed') : formatExamDate(exam.endDate),
    },
    { icon: faLocationDot, title: t('other.place'), value: exam.where },
    {
      icon: faCircleInfo,
      title: t('other.modality'),
      value: exam.modality === 'Scritto' ? t('other.written') : t('other.oral'),
    },
  ];

  const canContact = presentIds.length > 0;

  return (
    <>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Section>
          <SectionHeader title={t('other.appealInfo')} />
          <OverviewList indented>
            {details.map(detail => (
              <ListItem
                key={detail.title}
                title={detail.title}
                subtitle={detail.value}
                leadingItem={
                  <Icon
                    icon={detail.icon}
                    size={fontSizes.xl}
                    color={colors.secondaryText}
                  />
                }
                accessibilityLabel={`${detail.title}, ${detail.value}`}
              />
            ))}
          </OverviewList>
        </Section>

        <Section>
          <SectionHeader
            title={`${t('other.numberOfBooked')}: ${exam.booked}`}
          />
          <TranslucentTextField
            label={t('other.searchForStudent')}
            accessibilityLabel={t('other.searchForStudent')}
            accessibilityHint={t('examScreen.searchHint')}
            leadingIcon={faSearch}
            value={searchText}
            onChangeText={setSearchText}
            isClearable={searchText.length > 0}
            onClear={() => setSearchText('')}
            onClearLabel={t('examScreen.clearSearch')}
            containerStyle={styles.search}
          />
          <OverviewList indented>
            {filteredStudents.length === 0 ? (
              <EmptyState
                icon={faInbox}
                message={t('examScreen.noStudentsFound')}
              />
            ) : (
              filteredStudents.map(student => {
                const fullName = `${student.name} ${student.surname}`;
                const isPresent = presentIds.includes(student.id);
                const presenceLabel = t('examScreen.presenceLabel', {
                  name: fullName,
                });
                return (
                  <ListItem
                    key={student.id}
                    title={student.id}
                    subtitle={fullName}
                    accessibilityRole="button"
                    accessibilityLabel={`${student.id}, ${fullName}, ${
                      isPresent
                        ? t('examScreen.present')
                        : t('examScreen.notPresent')
                    }`}
                    accessibilityHint={t('examScreen.studentHint')}
                    accessibilityActions={[
                      { name: 'togglePresence', label: presenceLabel },
                    ]}
                    onAccessibilityAction={event => {
                      if (event.nativeEvent.actionName === 'togglePresence') {
                        togglePresence(student.id);
                      }
                    }}
                    onPress={() => {
                      setSelectedStudent(student);
                      navigation.navigate('StudentContact');
                    }}
                    trailingItem={
                      <Pressable
                        onPress={() => togglePresence(student.id)}
                        hitSlop={10}
                        style={styles.checkbox}
                        accessibilityRole="checkbox"
                        accessibilityLabel={presenceLabel}
                        accessibilityState={{ checked: isPresent }}
                      >
                        <Icon
                          icon={isPresent ? faCheckSquare : faSquare}
                          size={fontSizes.xl}
                          color={isPresent ? colors.link : colors.secondaryText}
                        />
                      </Pressable>
                    }
                  />
                );
              })
            )}
          </OverviewList>
        </Section>
        <BottomBarSpacer />
        <View style={styles.ctaSpacer} />
      </ScrollView>

      <CtaButtonContainer absolute>
        <CtaButton
          absolute={false}
          variant="outlined"
          title={t('other.addStudent')}
          icon={faPlus}
          accessibilityHint={t('examScreen.addStudentsHint')}
          action={() =>
            showBottomModal(
              <AddStudentsToExamModalContent
                examId={exam.id}
                close={closeBottomModal}
              />,
            )
          }
        />
        <CtaButton
          absolute={false}
          title={t('other.contactSelectedStudents')}
          icon={faEnvelope}
          disabled={!canContact}
          accessibilityState={{ disabled: !canContact }}
          accessibilityHint={
            canContact ? undefined : t('examScreen.contactDisabledHint')
          }
          action={() => Alert.alert(t('other.renderingToMail'))}
        />
      </CtaButtonContainer>

      <BottomModal dismissable {...bottomModal} />
    </>
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    search: {
      marginHorizontal: spacing[4],
      marginBottom: spacing[2],
    },
    checkbox: {
      padding: spacing[1],
    },
    ctaSpacer: {
      height: spacing[40],
    },
  });
