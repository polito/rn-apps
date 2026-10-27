import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import { faInbox } from '@fortawesome/free-solid-svg-icons';
import {
  BottomBarSpacer,
  EmptyState,
  OverviewList,
  Section,
  SectionHeader,
} from '@polito/lib/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ExamListItem } from '../components/ExamListItem';
import { useExams } from '../contexts/ExamsContext';
import { ExamsStackParamList } from '../navigation/ExamsScreens';
import { Exam } from '../types/exams';

type Props = NativeStackScreenProps<ExamsStackParamList, 'Exams'>;

export const ExamsScreen = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const { exams } = useExams();

  const examsByPeriod = useMemo(
    () =>
      [...exams]
        .sort((a, b) => a.examStartsAt.getTime() - b.examStartsAt.getTime())
        .reduce<Record<number, Exam[]>>((acc, exam) => {
          (acc[exam.teachingPeriod] ??= []).push(exam);
          return acc;
        }, {}),
    [exams],
  );

  if (exams.length === 0) {
    return <EmptyState icon={faInbox} message={t('examsScreen.emptyState')} />;
  }

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      {Object.entries(examsByPeriod).map(([period, periodExams]) => (
        <Section key={period}>
          <SectionHeader title={t(`examsScreen.periods.${period}`)} />
          <View accessibilityRole="list">
            <OverviewList indented>
              {periodExams.map((exam, index) => (
                <ExamListItem
                  key={exam.id}
                  exam={exam}
                  index={index}
                  total={periodExams.length}
                  onPress={() => navigation.navigate('Exam', { id: exam.id })}
                />
              ))}
            </OverviewList>
          </View>
        </Section>
      ))}
      <BottomBarSpacer />
    </ScrollView>
  );
};
