import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';

import {
  faEarthAmericas,
  faLocationDot,
  faUser,
} from '@fortawesome/free-solid-svg-icons';

import { useCourses } from '../../core/contexts/CoursesContext';
import { Card } from '../../ui/components/Card';
import { Icon } from '../../ui/components/Icon';
import { ListItem } from '../../ui/components/ListItem';
import { OverviewList } from '../../ui/components/OverviewList';
import { Section } from '../../ui/components/Section';
import { SectionHeader } from '../../ui/components/SectionHeader';
import { Text } from '../../ui/components/Text';
import { useStylesheet } from '../../ui/hooks/useStylesheet';
import { useTheme } from '../../ui/hooks/useTheme';
import { Theme } from '../../ui/types/Theme';

export const LessonScreen = () => {
  const styles = useStylesheet(createStyles);
  const { selectedLecture, setSelectedLecture } = useCourses(); // Recupero i corsi dal context
  const { fontSizes } = useTheme();
  const { t } = useTranslation();

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Section>
        <Text variant="heading" style={styles.TitleText}>
          {selectedLecture?.title}
        </Text>
        <Text style={styles.dateText}>
          {selectedLecture?.date} - {selectedLecture?.time}
        </Text>
      </Section>
      <Section>
        <SectionHeader title={t('other.topic')} />
        <Card>
          <Text style={styles.ContentText}>{selectedLecture?.content}</Text>
        </Card>
      </Section>
      <Section>
        <SectionHeader title="Staff" />
        <OverviewList indented>
          {selectedLecture?.staff?.map((staff, index) => (
            <ListItem
              key={index}
              leadingItem={<Icon icon={faUser} size={fontSizes['2xl']} />}
              title={staff.name}
              subtitle={
                staff.role === 'Titolare'
                  ? t('other.owner')
                  : t('other.collaborator')
              }
            />
          ))}
        </OverviewList>
      </Section>
      <Section>
        <SectionHeader title={t('other.otherInfo')} />
        <OverviewList indented>
          {selectedLecture?.room ? (
            <ListItem
              leadingItem={
                <Icon icon={faLocationDot} size={fontSizes['2xl']} />
              }
              title={t('other.lessonRoom')}
              subtitle={selectedLecture.room}
            />
          ) : (
            <View></View>
          )}
          {selectedLecture?.language ? (
            <ListItem
              leadingItem={
                <Icon icon={faEarthAmericas} size={fontSizes['2xl']} />
              }
              title={t('common.language')}
              subtitle={selectedLecture.language}
            />
          ) : (
            <View></View>
          )}
        </OverviewList>
      </Section>
    </ScrollView>
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    container: {
      marginBottom: spacing[5],
    },
    sectionsContainer: {
      paddingVertical: spacing[5],
      minHeight: '100%',
    },
    section: {
      marginBottom: spacing[5],
    },
    cardContainer: {
      flexDirection: 'column',
      gap: spacing[3],
      paddingHorizontal: spacing[4],
    },
    card: {
      padding: spacing[3],
    },
    paddingView: {
      height: 200, // Aggiungi uno spazio extra, modifica a piacere
      backgroundColor: 'transparent', // Componente trasparente
    },
    dateText: {
      fontSize: 16,
      color: 'gray', // Colore più soft per la data
      marginTop: spacing[1],
      marginLeft: spacing[4],
    },
    ContentText: {
      fontSize: 16,
      marginTop: spacing[4],
      marginLeft: spacing[4],
      marginBottom: spacing[4],
    },
    TitleText: {
      fontSize: 20,
      marginTop: spacing[4],
      marginLeft: spacing[4],
    },
  });
