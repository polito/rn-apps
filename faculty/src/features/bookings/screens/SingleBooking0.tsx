import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Platform } from 'react-native';

import {
  faArrowLeft,
  faLocationDot,
  faPeopleLine,
  faPlug,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import {
  Badge,
  Card,
  CtaButton,
  Icon,
  IconButton,
  ListItem,
  OverviewList,
  Row,
  Section,
  SectionHeader,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useCourses } from '../../core/contexts/CoursesContext';
import { ProfileStackParamList } from './ServiceNavigator';

export const SingleBooking0 = () => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { selectedBooking, removeBooking } = useCourses(); // Recupero i corsi dal context
  const { fontSizes, spacing } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <IconButton
          icon={faArrowLeft}
          size={22}
          onPress={() => navigation.navigate('PrenotaAula')}
        />
      ),
      headerTitle: () => (
        <Text
          variant="heading"
          style={{
            textAlign: 'center',
            width: '100%',
            marginLeft: Platform.OS === 'android' ? -25 : -55,
          }}
        >
          {t('other.request')}
        </Text>
      ),
    });
  }, [navigation, t]);

  if (!selectedBooking) return null;
  const getBadgeColors = (status: string) => {
    switch (status) {
      case 'in attesa':
        return { backgroundColor: '#FFF3CD', foregroundColor: '#856404' }; // light yellow bg, dark yellow text
      case 'accettata':
        return { backgroundColor: '#D4EDDA', foregroundColor: '#155724' }; // light green bg, dark green text
      case 'respinta':
        return { backgroundColor: '#F8D7DA', foregroundColor: '#721C24' }; // light red bg, dark red text
      default:
        return { backgroundColor: '#E2E3E5', foregroundColor: '#6C757D' }; // default grey
    }
  };

  const { backgroundColor, foregroundColor } = getBadgeColors(
    selectedBooking.status,
  );

  return (
    <>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Section>
          <Row style={{ alignItems: 'center' }}>
            <View style={{ flex: 2 }}>
              <Text
                variant="heading"
                style={styles.TitleText}
                numberOfLines={2}
              >
                {selectedBooking?.title.replace(
                  /^Richiesta aula/,
                  t('other.request'),
                )}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'flex-end',
                paddingRight: spacing[4],
              }}
            >
              <Badge
                text={
                  selectedBooking?.status === 'in attesa'
                    ? t('other.waiting')
                    : selectedBooking.status === 'accettata'
                      ? t('other.accepted')
                      : selectedBooking.status === 'respinta'
                        ? t('other.rejected')
                        : selectedBooking.status
                }
                backgroundColor={backgroundColor}
                foregroundColor={foregroundColor}
              />
            </View>
          </Row>

          <Text style={styles.dateText}>
            {selectedBooking?.date} {selectedBooking?.time}
          </Text>
        </Section>

        <Section>
          <SectionHeader title={t('other.requirements')} />
          <OverviewList indented>
            {selectedBooking?.capacity ? (
              <ListItem
                leadingItem={
                  <Icon icon={faPeopleLine} size={fontSizes['2xl']} />
                }
                title={t('other.capacity')}
                subtitle={selectedBooking.capacity.toString()}
              />
            ) : (
              <View />
            )}
            <ListItem
              leadingItem={<Icon icon={faPlug} size={fontSizes['2xl']} />}
              title={t('other.powerSockets')}
              subtitle={
                selectedBooking.powerOutput ? 'Disponibili' : 'Non necessarie'
              }
            />{' '}
            : <View />
            {selectedBooking?.where ? (
              <ListItem
                leadingItem={
                  <Icon icon={faLocationDot} size={fontSizes['2xl']} />
                }
                title={
                  selectedBooking.status === 'accettata'
                    ? t('other.assignedRoom')
                    : t('other.zone')
                }
                subtitle={
                  selectedBooking.status === 'accettata'
                    ? `Aula X`
                    : selectedBooking.where
                }
              />
            ) : (
              <View />
            )}
            {selectedBooking?.chairType !== 'Indifferente' ? (
              <ListItem
                leadingItem={
                  <Icon icon={faPeopleLine} size={fontSizes['2xl']} />
                }
                title={t('other.deskType')}
                subtitle={selectedBooking.chairType}
              />
            ) : (
              <View />
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
      {selectedBooking.status === 'in attesa' ? (
        <CtaButton
          title={t('other.cancelRequest')}
          action={() => {
            Alert.alert(t('other.confirm'), t('other.alertBooking2'), [
              { text: t('common.cancel'), style: 'cancel' },
              {
                text: t('other.confirm'),
                style: 'destructive',
                onPress: () => {
                  removeBooking(selectedBooking.id);
                  navigation.navigate('PrenotaAula');
                },
              },
            ]);
          }}
          absolute={false}
          variant="filled"
          icon={faTrash}
          destructive
        />
      ) : (
        <View />
      )}
    </>
  );
};

const createStyles = ({ palettes, spacing }: Theme) =>
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
      backgroundColor: undefined, // Componente trasparente
    },
    dateText: {
      fontSize: 16,
      color: palettes.gray[500], // Colore più soft per la data
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
