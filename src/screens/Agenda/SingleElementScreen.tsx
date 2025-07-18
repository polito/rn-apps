import React, {useLayoutEffect} from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {SectionHeader} from '../../ui/components/SectionHeader';
import {useStylesheet} from '../../ui/hooks/useStylesheet';
import {Theme} from '../../ui/types/Theme';
import {useCourses} from '../../core/contexts/CoursesContext';
import {Text} from '../../ui/components/Text';
import {Section} from '../../ui/components/Section';
import {Card} from '../../ui/components/Card';
import {
  faArrowLeft,
  faBook,
  faBookOpen,
  faEllipsisVertical,
  faLanguage,
  faLocationDot,
  faTrash,
  faUser,
  faVideo,
} from '@fortawesome/free-solid-svg-icons';
import {IconButton} from '../../ui/components/IconButton';
import {BottomBarSpacer} from '../../core/components/BottomBarSpacer';
import {OverviewList} from '../../ui/components/OverviewList';
import {ListItem} from '../../ui/components/ListItem';
import {Icon} from '../../ui/components/Icon';
import {useTheme} from '../../ui/hooks/useTheme';
import {VerticalDashedLine} from '../../ui/components/VerticalDashedLine';
import {useNavigation} from '@react-navigation/native';
import {Row} from '../../ui/components/Row';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {CtaButton} from '../../ui/components/CtaButton';
import {Platform} from 'react-native';
import { useTranslation } from 'react-i18next';
const CustomBackButton2 = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.goBack(); // Altrimenti torna alla schermata "Courses"
      }}
      style={{paddingHorizontal: 10}}>
      <FontAwesomeIcon icon={faArrowLeft} size={22} color="black" />
    </TouchableOpacity>
  );
};

const capitalizeFirstLetter = (text: string) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};
export const SingleElementScreen = () => {
  const styles = useStylesheet(createStyles);
  const {selectedCourse, selectedAgendaItem, removeAgendaItem} = useCourses(); // Recupero i corsi dal context
  const {fontSizes, colors, spacing} = useTheme();
  const navigation = useNavigation();
  const {t} = useTranslation();
  if (!selectedAgendaItem) return null;

  if (
    selectedAgendaItem.type === 'lezione' ||
    selectedAgendaItem.type === 'Lezione' ||
    selectedAgendaItem.type === 'LEZIONE'
  ) {
    console.log(selectedAgendaItem.location);
    navigation.setOptions({
      headerTitle: () => (
        <Text
          variant="heading"
          style={{
            marginLeft: Platform.OS === 'android' ? 110 : 40,
            width: 100,
          }}>
          Lezione
        </Text>
      ),
      headerLeft: () => <CustomBackButton2 />,
    });
  } else {
    navigation.setOptions({
      headerTitle: () => (
        <Text
          variant="heading"
          style={{
            marginLeft: Platform.OS === 'android' ? 75 : 10,
            width: Platform.OS === 'android' ? 200 : 120,
          }}>
          Appuntamento
        </Text>
      ),
      headerLeft: () => <CustomBackButton2 />,
    });
  }

  return (
    <>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
          <Section>
            <Text variant="heading" style={styles.TitleText}>
              {selectedAgendaItem?.title}
            </Text>
            <Text style={styles.dateText}>
              {selectedAgendaItem?.date} - {selectedAgendaItem?.time}
            </Text>
          </Section>
          <Section>
            <SectionHeader title={t('other.description')} />
            <Card>
              <Text style={styles.ContentText}>
                {selectedAgendaItem?.description}
              </Text>
            </Card>
          </Section>
          {(selectedAgendaItem.type === 'Lezione' ||
            selectedAgendaItem.type === 'lezione' ||
            selectedAgendaItem.type === 'LEZIONE') && (
            <Section>
              <SectionHeader title={t('other.otherInfo')} />
              <OverviewList indented>
                {selectedAgendaItem.type && (
                  <ListItem
                    leadingItem={
                      <Icon icon={faLocationDot} size={fontSizes['2xl']} />
                    }
                    title={t('other.lessonRoom')}
                    subtitle={selectedAgendaItem.location}
                    onPress={()=>{
                      navigation.navigate('Places', {
                        screen: 'Place',
                        params: {placeId: 'TO_CEN03-XPTE-E002'},
                      });
                    }}    
                  />
                )}

                {selectedCourse?.title && (
                  <ListItem
                    leadingItem={
                      <Icon icon={faBookOpen} size={fontSizes['2xl']} />
                    }
                    title={t('common.course')}
                    subtitle={selectedCourse.title}
                    onPress={() => {
                      navigation.navigate('Didattica', {
                        screen: 'Course',
                        params: {from: 'Agenda'},
                      });
                    }}
                  />
                )}
              </OverviewList>
            </Section>
          )}
      </ScrollView>
      <CtaButton
        title={t('other.deleteFromAgenda')}
        action={() => {
          Alert.alert(
            t('other.confirm'),
            t('other.alertTextAgenda2'),
            [
              {
                text: t('common.cancel'),
                style: 'cancel',
              },
              {
                text: t('other.delete'),
                style: 'destructive',
                onPress: () => {
                  removeAgendaItem(selectedAgendaItem.id);
                  navigation.goBack(); // Torna indietro dopo l’eliminazione
                },
              },
            ],
          );
        }}
        absolute={false}
        variant="filled"
        icon={faTrash}
        destructive
      />
    </>
  );
};

const createStyles = ({spacing}: Theme) =>
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
