import React, {useLayoutEffect} from 'react';
import {Alert, SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {SectionHeader} from '../../ui/components/SectionHeader';
import {useStylesheet} from '../../ui/hooks/useStylesheet';
import {Theme} from '../../ui/types/Theme';
import {useCourses} from '../../core/contexts/CoursesContext';
import {Text} from '../../ui/components/Text';
import {Section} from '../../ui/components/Section';
import {Card} from '../../ui/components/Card';
import {
  faArrowLeft,
  faLanguage,
  faLocationDot,
  faPeopleLine,
  faPlug,
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
import {Badge} from '../../ui/components/Badge';
import {CtaButton} from '../../ui/components/CtaButton';
import {Platform} from 'react-native';
import { useTranslation } from 'react-i18next';

export const SingleBooking2 = () => {
  const {t} = useTranslation();
  const styles = useStylesheet(createStyles);
  const {selectedBooking, removeBooking} = useCourses(); // Recupero i corsi dal context
  const {fontSizes, colors, spacing} = useTheme();
  const navigation = useNavigation();
  if (!selectedBooking) return null;
  


  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <IconButton
          icon={faArrowLeft}
          size={22}
          onPress={() => navigation.navigate('Prenota_spaziStrutture')}
        />
      ),
      headerTitle: () => (
        <Text
          variant="heading"
          style={{
            textAlign: 'center',
            width: '100%',
            marginLeft: Platform.OS === 'android' ? -25 : -55,
          }}>
          {t('other.booking')}
        </Text>
      ),
    });
  }, [navigation, colors]);

  return (
    <>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
          <Section>
            <Row style={{alignItems: 'center'}}>
              <View style={{flex: 2}}>
                <Text
                  variant="heading"
                  style={styles.TitleText}
                  numberOfLines={2}>
                  {selectedBooking?.title.replace(/^Prenotazione spazio/, t('other.booking'))}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems: 'flex-end',
                  paddingRight: spacing[4],
                }}>
                
              </View>
            </Row>

            <Text style={styles.dateText}>
              {selectedBooking?.date} {selectedBooking?.time}
            </Text>
          </Section>

          <Section>
            <SectionHeader title={t('other.requirements')} />
            <OverviewList indented>
              {selectedBooking?.where ? (
                <ListItem
                  leadingItem={
                    <Icon icon={faLocationDot} size={fontSizes['2xl']} />
                  }
                  title={t('other.local')}
                  subtitle={selectedBooking.where}
                />
              ) : (
                <View></View>
              )}
            </OverviewList>
          </Section>

          <Section>
            <SectionHeader title={t('other.details')} />
            <Card>
              <Text style={styles.ContentText}>{selectedBooking?.details}</Text>
            </Card>
          </Section>
      </ScrollView>
      {selectedBooking.status == 'in attesa' ? (
        <CtaButton
          title={'Annulla Prenotazione'}
          action={() => {
            Alert.alert(
              t('other.confirm'),
              t('other.alertBooking2'),
              [
                {text: t('common.cancel'), style: 'cancel'},
                {
                  text: t('other.Confirm'),
                  style: 'destructive',
                  onPress: () => {
                    removeBooking(selectedBooking.id);
                    navigation.navigate('Prenota_spaziStrutture');
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
      ) : (
        <View></View>
      )}
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
