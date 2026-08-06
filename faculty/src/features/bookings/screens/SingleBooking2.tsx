import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Platform } from 'react-native';

import {
  faArrowLeft,
  faLocationDot,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import {
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

import { ProfileStackParamList } from '../../../screens/Servizi/ServiceNavigator';
import { useBookings } from '../hooks/useBookings';

export const SingleBooking2 = () => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { selectedBooking, removeBooking } = useBookings(); // Recupero i corsi dal context
  const { fontSizes, colors, spacing } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <IconButton
          icon={faArrowLeft}
          size={22}
          onPress={() => navigation.navigate('PrenotaSpaziStrutture')}
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
          {t('other.booking')}
        </Text>
      ),
    });
  }, [navigation, colors, t]);

  if (!selectedBooking) return null;

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
                  /^Prenotazione spazio/,
                  t('other.booking'),
                )}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'flex-end',
                paddingRight: spacing[4],
              }}
            />
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
          title="Annulla Prenotazione"
          action={() => {
            Alert.alert(t('other.confirm'), t('other.alertBooking2'), [
              { text: t('common.cancel'), style: 'cancel' },
              {
                text: t('other.Confirm'),
                style: 'destructive',
                onPress: () => {
                  removeBooking(selectedBooking.id);
                  navigation.navigate('PrenotaSpaziStrutture');
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
