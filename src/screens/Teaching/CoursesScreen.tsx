import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ListItem } from '../../ui/components/ListItem';
import { Section } from '../../ui/components/Section';
import { SectionHeader } from '../../ui/components/SectionHeader';
import { SectionList } from '../../ui/components/SectionList';
import { useStylesheet } from '../../ui/hooks/useStylesheet';
import { useTheme } from '../../ui/hooks/useTheme';
import { Theme } from '../../ui/types/theme';
import { useCollapsingHeader } from '../../core/hooks/useCollapsingHeader';
import { useCourses } from '../../core/contexts/CoursesContext';
import { set } from 'lodash';
import { useNavigation } from '@react-navigation/native';


export const CoursesScreen = () => {
  const { t } = useTranslation();
  const { spacing } = useTheme();
  const styles = useStylesheet(createStyles);
  const { scrollViewProps } = useCollapsingHeader();
  const { fakeCourses, fakeExams, setSelectedCourse } = useCourses(); // Usa il hook per ottenere i dati
  const navigation = useNavigation()

  // 📌 Raggruppa i corsi per periodo
  const coursesByPeriod = fakeCourses.reduce((acc, course) => {
    (acc[course.period] = acc[course.period] || []).push(course);
    return acc;
  }, {} as Record<string, typeof fakeCourses>);

  return (
    <ScrollView>
      <View style={styles.sectionsContainer}>
    
    
        <Section>
        <SectionHeader title="2024/2025" linkTo="" />
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
    
     
      <Section>
        <SectionHeader title="2023/2024" linkTo="" />
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
      <View style={styles.paddingView}></View >
      </View>
      </ScrollView>
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    loader: {
      marginVertical: spacing[8] ,
    },
    sectionsContainer: {
      paddingVertical: spacing[5] ,
    },
    paddingView: {
      height: 200, // Aggiungi uno spazio extra, modifica a piacere
      backgroundColor: 'transparent', // Componente trasparente
    },
    button: {
      backgroundColor: '#FFFFFF', // Colore del background del bottone
      paddingVertical: 12,
      marginLeft : spacing[4] ,
      marginBottom: spacing[4] ,
      width : 100,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      color: 'black', // Colore del testo del bottone
      fontSize: 16,
      fontWeight: 'light',
    },
  });
