import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';

import { formatDateFromString } from '@polito/lib/core';
import {
  ListItem,
  Section,
  SectionHeader,
  Theme,
  useStylesheet,
} from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { SectionList } from '../core/components/SectionList';
import { useCourses } from '../core/contexts/CoursesContext';
import { TeachingStackParamList } from './Teaching/TeachingNavigator';

export const ExamsScreen = () => {
  const { t } = useTranslation();
  const { fakeExams } = useCourses();
  const styles = useStylesheet(createStyles);
  const navigation =
    useNavigation<NativeStackNavigationProp<TeachingStackParamList>>();
  const examsByPeriod = fakeExams.reduce(
    (acc, exam) => {
      const period = exam.period || 'Altro';
      if (!acc[period]) acc[period] = [];
      acc[period].push(exam);
      return acc;
    },
    {} as Record<string, typeof fakeExams>,
  );

  const formatExamDate = (date: string) =>
    date === 'Oggi'
      ? t('other.today')
      : /^\d{4}-\d{2}-\d{2}/.test(date)
        ? formatDateFromString(date)
        : date;

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={styles.sectionsContainer}>
        {Object.entries(examsByPeriod).map(([period, exams]) => (
          <Section key={period}>
            <SectionHeader title={`${period}° ${t('other.appeal')}`} />
            <SectionList>
              {exams.map(exam => (
                <ListItem
                  key={exam.id}
                  title={exam.subject}
                  subtitle={`${formatExamDate(exam.date)} - ${exam.where}`}
                  accessibilityRole="button"
                  accessibilityLabel={`${exam.subject}, ${formatExamDate(exam.date)}, ${exam.where}`}
                  accessibilityHint={t('examScreen.openHint')}
                  onPress={() => navigation.navigate('Exam', { id: exam.id })}
                />
              ))}
            </SectionList>
          </Section>
        ))}
        <View style={styles.paddingView} />
      </View>
    </ScrollView>
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    sectionsContainer: {
      paddingVertical: spacing[5],
    },
    paddingView: {
      height: 50,
      backgroundColor: undefined,
    },
  });
