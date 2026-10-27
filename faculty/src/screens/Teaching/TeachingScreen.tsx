import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import { useOfflineDisabled } from '@polito/lib/core';
import {
  BottomBarSpacer,
  ListItem,
  OverviewList,
  Section,
  SectionHeader,
} from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { SectionList } from '../../core/components/SectionList';
import { useCourses } from '../../core/contexts/CoursesContext';
import { useGetCourses } from '../../core/queries/courseHooks';
import { ExamListItem } from '../../features/exams/components/ExamListItem';
import { useExams } from '../../features/exams/contexts/ExamsContext';
import { TeachingStackParamList } from './TeachingNavigator';

export const TeachingScreen = () => {
  const { t } = useTranslation();
  const coursesQuery = useGetCourses();
  const isOffline = useOfflineDisabled();
  const { setSelectedCourse, managedCourses } = useCourses();
  const { exams } = useExams();
  const upcomingExams = exams.slice(0, 3);
  const navigation =
    useNavigation<NativeStackNavigationProp<TeachingStackParamList>>();

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={{ paddingTop: 10 }} />

      <Section>
        <SectionHeader title={t('other.myCourses')} linkTo="MyCourses" />
        <OverviewList
          loading={coursesQuery.isLoading && !isOffline}
          indented
          emptyStateText={
            isOffline ? t('common.cacheMiss') : t('coursesScreen.emptyState')
          }
        >
          {coursesQuery.data?.map(course => (
            <ListItem
              key={`${course.shortcode}${course.id}`}
              title={course.name}
              subtitle={`${course.shortcode} - ${t('other.period')} ${course.teachingPeriod}`}
              disabled={course.id === null}
              onPress={() => {
                if (course.id === null) return;
                setSelectedCourse(null);
                navigation.navigate('Course', { id: course.id });
              }}
            />
          ))}
        </OverviewList>
      </Section>

      <Section>
        <SectionHeader
          title={t('other.managedCourses')}
          linkTo="ManagedCourses"
        />
        <SectionList>
          {managedCourses.map(course => (
            <ListItem
              key={course.id}
              title={course.title}
              subtitle={(() => {
                const parts = course.subtitle.split(' - ');
                const enrolled = parts[0].replace(
                  'Iscritti',
                  t('other.enrolledStudents'),
                );
                const period = parts[1].replace('Periodo', t('other.period'));
                return `${enrolled} - ${period}`;
              })()}
              onPress={() => {
                setSelectedCourse(course);
                navigation.navigate('Course', { from: 'Incarichi' });
              }}
            />
          ))}
        </SectionList>
      </Section>

      <Section>
        <SectionHeader title={t('other.appeals')} linkTo="Exams" />
        <View accessibilityRole="list">
          <OverviewList indented>
            {upcomingExams.map((exam, index) => (
              <ExamListItem
                key={exam.id}
                exam={exam}
                index={index}
                total={upcomingExams.length}
                onPress={() => navigation.navigate('Exam', { id: exam.id })}
              />
            ))}
          </OverviewList>
        </View>
      </Section>

      <BottomBarSpacer />
    </ScrollView>
  );
};

// const _createStyles = ({ spacing }: Theme) =>
//   StyleSheet.create({
//     container: {
//       marginVertical: spacing[5],
//     },
//     sectionsContainer: {
//       paddingVertical: spacing[5],
//       minHeight: '100%',
//     },
//     section: {
//       marginBottom: spacing[5],
//     },
//     cardContainer: {
//       flexDirection: 'column',
//       gap: spacing[3],
//       paddingHorizontal: spacing[4],
//     },
//     card: {
//       padding: spacing[3],
//     },
//     paddingView: {
//       height: 200, // Aggiungi uno spazio extra, modifica a piacere
//       backgroundColor: undefined, // Componente trasparente
//     },
//   });
