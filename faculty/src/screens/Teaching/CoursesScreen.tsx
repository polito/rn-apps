import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';

import {
  ListItem,
  Section,
  SectionHeader,
  Theme,
  useStylesheet,
} from '@polito/lib';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { SectionList } from '../../core/components/SectionList';
import { useCourses } from '../../core/contexts/CoursesContext';
import { TeachingStackParamList } from './TeachingNavigator';

export const CoursesScreen = () => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { fakeCourses, setSelectedCourse } = useCourses(); // Usa il hook per ottenere i dati
  const navigation =
    useNavigation<NativeStackNavigationProp<TeachingStackParamList>>();

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
          <SectionHeader title="2023/2024" linkTo="" />
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
        <View style={styles.paddingView} />
      </View>
    </ScrollView>
  );
};

const createStyles = ({ palettes, colors, spacing }: Theme) =>
  StyleSheet.create({
    loader: {
      marginVertical: spacing[8],
    },
    sectionsContainer: {
      paddingVertical: spacing[5],
    },
    paddingView: {
      height: 200, // Aggiungi uno spazio extra, modifica a piacere
      backgroundColor: undefined, // Componente trasparente
    },
    button: {
      backgroundColor: colors.white, // Colore del background del bottone
      paddingVertical: 12,
      marginLeft: spacing[4],
      marginBottom: spacing[4],
      width: 100,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      color: palettes.text[700], // Colore del testo del bottone
      fontSize: 16,
      fontWeight: 'light',
    },
  });
