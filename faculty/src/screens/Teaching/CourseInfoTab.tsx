import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { faUser } from '@fortawesome/free-regular-svg-icons';
import {
  BottomBarSpacer,
  Card,
  GlobalStyles,
  Grid,
  Icon,
  ListItem,
  Metric,
  OverviewList,
  Row,
  Section,
  SectionHeader,
  Theme,
  useBottomBarAwareStyles,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useCourses } from '../../core/contexts/CoursesContext';
import { TeachingStackParamList } from './TeachingNavigator';

export const CourseInfoTab = () => {
  const { t } = useTranslation();
  const { palettes } = useTheme();
  const { spacing } = useTheme();
  const {
    selectedCourse,
    setSelectedProfile,
    getProfileById,
    setSelectedExam,
    getExamFromId,
    fakeExams,
  } = useCourses();
  const navigation =
    useNavigation<NativeStackNavigationProp<TeachingStackParamList>>();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const styles = useStylesheet(createStyles);
  const { setOptions } = useNavigation();
  const { fontSizes } = useTheme();

  useEffect(() => {
    const headerTitle = selectedCourse?.title || 'Course';
    setOptions({
      headerTitle,
      headerBackTitleVisible: headerTitle.length <= 20,
    });
  }, [selectedCourse?.title, setOptions]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      e.preventDefault();
      navigation.navigate('Incarichi');
    });

    return unsubscribe;
  }, [navigation]);

  // Se nessun corso è selezionato, mostra un messaggio di errore
  if (!selectedCourse) {
    return (
      <View style={{ padding: spacing[5] }}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 16,
            color: palettes.red[600],
          }}
        >
          No course selected
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={bottomBarAwareStyles}
      contentInsetAdjustmentBehavior="automatic"
      bounces={false}
    >
      <Section>
        <View style={{ marginTop: spacing[10] }}>
          <Card style={styles.metricsCard} accessible={true}>
            <Grid numColumns={2} gap={16}>
              <View style={GlobalStyles.grow}>
                <Row justify="flex-start" align="center">
                  <Metric
                    title={t('other.period')}
                    value={selectedCourse.registered}
                    style={styles.periodMetric}
                  />
                </Row>
              </View>
              <View style={GlobalStyles.grow}>
                <Row justify="flex-start" align="center">
                  <Metric
                    title={t('courseInfoTab.creditsLabel')}
                    value={`${selectedCourse.cfu} cfu`}
                    style={styles.periodMetric}
                  />
                </Row>
              </View>
            </Grid>
          </Card>
        </View>
      </Section>
      {/* Sezione per lo staff */}
      <Section>
        {selectedCourse.managed ? (
          <SectionHeader title={t('other.managingAccesses')} linkTo="Staff" />
        ) : (
          <SectionHeader title="Staff" />
        )}

        <OverviewList indented>
          {selectedCourse.staff.map(staff => (
            <ListItem
              key={staff.id}
              leadingItem={<Icon icon={faUser} size={fontSizes['2xl']} />}
              title={staff.name}
              subtitle={
                staff.role === 'Titolare'
                  ? t('other.owner')
                  : t('other.collaborator')
              }
              onPress={() => {
                if (staff.idProfile) {
                  const profile = getProfileById(staff.idProfile);
                  setSelectedProfile(profile ?? null);
                  navigation.navigate('Contatto');
                }
              }}
            />
          ))}
        </OverviewList>
      </Section>

      {/* Sezione per gli appelli */}
      <Section>
        <SectionHeader title={t('examsScreen.title')} />
        <OverviewList indented>
          {selectedCourse.examcalls.map(call => (
            <ListItem
              key={`${call.id}`}
              title={call.name}
              subtitle={call.date === 'Oggi' ? t('other.today') : call.date}
              onPress={() => {
                const exam = getExamFromId(call.idExam, fakeExams);
                if (exam) {
                  navigation.navigate('Exam3');
                  setSelectedExam(exam);
                }
              }}
            />
          ))}
        </OverviewList>
      </Section>

      {/* Sezione per altro */}
      <Section>
        <SectionHeader title={t('other.other')} linkTo="" />
        <OverviewList>
          <ListItem title={t('courseGuideScreen.title')} linkTo="CourseGuide" />
        </OverviewList>
      </Section>
      <BottomBarSpacer />
    </ScrollView>
  );
};

const createStyles = ({ colors, palettes, spacing }: Theme) =>
  StyleSheet.create({
    heading: {
      paddingTop: spacing[5],
      paddingHorizontal: spacing[4],
    },
    metricsCard: {
      justifyContent: 'space-between',
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[4],
      marginTop: 0,
      marginBottom: spacing[7],
    },
    periodMetric: {
      marginRight: spacing[2],
    },
    periodDropdownIcon: {
      color: palettes.secondary['500'],
    },
    dotIcon: {
      marginBottom: spacing[2],
      color: colors.prose['600'],
    },
  });
