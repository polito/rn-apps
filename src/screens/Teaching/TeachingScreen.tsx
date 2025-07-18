import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card } from '../../ui/components/Card';
import { ListItem } from '../../ui/components/ListItem';
import { SectionHeader } from '../../ui/components/SectionHeader';
import { SectionList } from '../../ui/components/SectionList';
import { useStylesheet } from '../../ui/hooks/useStylesheet';
import { Theme } from '../../ui/types/theme';
import { useCollapsingHeader } from '../../core/hooks/useCollapsingHeader';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useCourses } from '../../core/contexts/CoursesContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomBarSpacer } from '../../core/components/BottomBarSpacer';
import { Section } from '../../ui/components/Section';
import { Text } from '../../ui/components/Text';

export const TeachingScreen = () => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { scrollViewProps } = useCollapsingHeader();
  const { fakeCourses, fakeExams, setSelectedCourse, managedCourses, setSelectedExam} = useCourses(); // Usa il hook per ottenere i dati
  const navigation = useNavigation();


  return (
    <ScrollView      
     contentInsetAdjustmentBehavior="automatic"
    >

    
      <View style={{paddingTop : 10}}></View>

        {/* 📌 CORSI */}
        <Section>
          <SectionHeader title={t('other.myCourses')} linkTo="I_miei_corsi" />
          <SectionList>
            {fakeCourses.map(course => (
              
              <ListItem
  key={course.id}
  title={course.title}
  subtitle={(() => {
    const parts = course.subtitle.split(' - ');
    const enrolled = parts[0].replace('Iscritti', t('other.enrolledStudents'));
    const period = parts[1].replace('Periodo', t('other.period'));
    return `${enrolled} - ${period}`;
  })()}
  onPress={() => {
    setSelectedCourse(course);
    navigation.navigate("Course", {from : 'Incarichi'});
  }}
/>
            ))}
          </SectionList>
        </Section>

        {/* 📌 CORSI IN GESTIONE */}
        <Section>
        <SectionHeader title={t('other.managedCourses')} linkTo="Corsi_in_gestione" />
          <SectionList>
            {managedCourses.map(course => (
              <ListItem
  key={course.id}
  title={course.title}
  subtitle={(() => {
    const parts = course.subtitle.split(' - ');
    const enrolled = parts[0].replace('Iscritti', t('other.enrolledStudents'));
    const period = parts[1].replace('Periodo', t('other.period'));
    return `${enrolled} - ${period}`;
  })()}
  onPress={() => {
    setSelectedCourse(course);
    navigation.navigate("Course", {from : 'Incarichi'});
  }}
/>
            ))}
          </SectionList>
        </Section>

        {/* 📌 APPELLI */}
        <Section>
  <SectionHeader title={t('other.appeals')} linkTo="Appelli" />
  <SectionList>
    {fakeExams.slice(0,3).map(exam => {
      const examDate = new Date(exam.date);
      const today = new Date();

      // Confrontiamo solo anno, mese e giorno (ignora ora)
      const isToday =
        examDate.getFullYear() === today.getFullYear() &&
        examDate.getMonth() === today.getMonth() &&
        examDate.getDate() === today.getDate();

      return (
        <ListItem
          key={exam.id}
          title={exam.subject}
          subtitle={exam.date === 'Oggi' ? t('other.today') : exam.date}
          onPress={() => {
            navigation.navigate("Exam");
            setSelectedExam(exam);
          }}
        />
      );
    })}
  </SectionList>
</Section>

      <BottomBarSpacer></BottomBarSpacer>
    </ScrollView>
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    container: {
      marginVertical: spacing[5] ,
    },
    sectionsContainer: {
      paddingVertical: spacing[5] ,
      minHeight : '100%' 
    },
    section: {
      marginBottom: spacing[5] ,
    },
    cardContainer: {
      flexDirection: 'column',
      gap: spacing[3] ,
      paddingHorizontal: spacing[4] ,
    },
    card: {
      padding: spacing[3] ,
    },
    paddingView: {
      height: 200, // Aggiungi uno spazio extra, modifica a piacere
      backgroundColor: 'transparent', // Componente trasparente
    },
  });

