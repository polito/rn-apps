import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import { BottomBarSpacer, ListItem, Section, SectionHeader } from '@polito/lib';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { SectionList } from '../../core/components/SectionList';
import { useCourses } from '../../core/contexts/CoursesContext';
import { TeachingStackParamList } from './TeachingNavigator';

export const TeachingScreen = () => {
  const { t } = useTranslation();
  const {
    fakeCourses,
    fakeExams,
    setSelectedCourse,
    managedCourses,
    setSelectedExam,
  } = useCourses(); // Usa il hook per ottenere i dati
  const navigation =
    useNavigation<NativeStackNavigationProp<TeachingStackParamList>>();

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={{ paddingTop: 10 }} />

      {/* 📌 CORSI */}
      <Section>
        <SectionHeader title={t('other.myCourses')} linkTo="IMieiCorsi" />
        <SectionList>
          {fakeCourses.map(course => (
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

      {/* 📌 CORSI IN GESTIONE */}
      <Section>
        <SectionHeader
          title={t('other.managedCourses')}
          linkTo="CorsiInGestione"
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

      {/* 📌 APPELLI */}
      <Section>
        <SectionHeader title={t('other.appeals')} linkTo="Appelli" />
        <SectionList>
          {fakeExams.slice(0, 3).map(exam => {
            return (
              <ListItem
                key={exam.id}
                title={exam.subject}
                subtitle={exam.date === 'Oggi' ? t('other.today') : exam.date}
                onPress={() => {
                  navigation.navigate('Exam', {
                    id: exam.id,
                  });
                  setSelectedExam(exam);
                }}
              />
            );
          })}
        </SectionList>
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
