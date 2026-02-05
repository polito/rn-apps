import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

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
  const { fakeExams, setSelectedExam } = useCourses();
  const styles = useStylesheet(createStyles);
  const navigation =
    useNavigation<NativeStackNavigationProp<TeachingStackParamList>>();
  // 📌 Raggruppa appelli per periodo
  const examsByPeriod = fakeExams.reduce(
    (acc, exam) => {
      const period = exam.period || 'Altro';
      if (!acc[period]) acc[period] = [];
      acc[period].push(exam);
      return acc;
    },
    {} as Record<string, typeof fakeExams>,
  );

  return (
    <ScrollView>
      <View style={styles.sectionsContainer}>
        {Object.entries(examsByPeriod).map(([period, exams]) => (
          <Section key={period}>
            <SectionHeader
              title={`${period}° ${t('other.appeal')}`}
              linkTo=""
            />
            <SectionList>
              {exams.map(exam => (
                <ListItem
                  key={exam.id}
                  title={<Text>{exam.subject}</Text>}
                  subtitle={`${
                    exam.date === 'Oggi'
                      ? t('other.today')
                      : exam.date.toLocaleString()
                  } - ${exam.where}`}
                  onPress={() => {
                    navigation.navigate('Exam2');
                    setSelectedExam(exam);
                  }}
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
