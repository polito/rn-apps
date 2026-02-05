import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import { faFlagCheckered } from '@fortawesome/free-solid-svg-icons';
import { usePreferencesContext } from '@polito/lib/core';
import { formatDate } from '@polito/lib/core';
import {
  ActivityIndicator,
  BottomBarSpacer,
  BottomModal,
  Col,
  CtaButton,
  Icon,
  ListItem,
  ModalContent,
  OverviewList,
  PersonListItem,
  RefreshControl,
  Row,
  ScreenTitle,
  Section,
  SectionHeader,
  Text,
  type Theme,
  useBottomModal,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppPreferences } from '~/core/types/preferences';

import { useGetPerson } from '../../../core/queries/peopleHooks';
import { TeachingStackParamList } from '../../teaching/components/TeachingNavigator';

type Props = NativeStackScreenProps<TeachingStackParamList, 'RecordedGrade'>;
export const RecordedGradeScreen = ({ navigation, route }: Props) => {
  const { t } = useTranslation();
  const { grade } = route.params;
  const { fontSizes, colors } = useTheme();
  const { accessibility } = usePreferencesContext<AppPreferences>();
  const teacherIds = grade.teacherId !== null ? grade.teacherId : undefined;
  const staffQueries = useGetPerson(teacherIds);

  const styles = useStylesheet(createStyles);

  const {
    open: showBottomModal,
    modal: bottomModal,
    close: closeBottomModal,
  } = useBottomModal();

  const onPressEvent = () => {
    showBottomModal(
      <ModalContent
        title={t('recordedGradeScreen.titleOnTimePoint')}
        close={closeBottomModal}
      >
        <View style={styles.textModal}>
          <Text>{t('recordedGradeScreen.textModal')}</Text>
          <CtaButton
            title={t('recordedGradeScreen.ctaButtonModal')}
            action={() => navigation.navigate('TranscriptCareer')}
            absolute={false}
            containerStyle={{ paddingHorizontal: 0 }}
          />
        </View>
      </ModalContent>,
    );
  };

  return (
    <>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={<RefreshControl queries={[staffQueries]} manual />}
      >
        {!grade ? (
          <ActivityIndicator />
        ) : (
          <SafeAreaView>
            <Row pb={0} ph={5} pt={5} gap={2}>
              <Col
                flexGrow={1}
                flexShrink={1}
                gap={2}
                style={{ marginBottom: 20 }}
              >
                <ScreenTitle title={grade.courseName} />
                <View>
                  <Text>{`${formatDate(new Date(grade.date))} ${
                    accessibility?.fontSize && accessibility.fontSize < 150
                      ? '-' +
                        t('common.creditsWithUnit', {
                          credits: grade.credits,
                        })
                      : ''
                  }`}</Text>
                </View>
                <Col
                  flexGrow={1}
                  flexShrink={1}
                  gap={2}
                  style={{ marginBottom: 20 }}
                >
                  <Text>
                    {accessibility?.fontSize && accessibility.fontSize >= 150
                      ? t('common.creditsWithUnit', {
                          credits: grade.credits,
                        })
                      : ''}
                  </Text>
                </Col>
              </Col>
              <Col
                align="center"
                justify="center"
                mt={2}
                flexShrink={0}
                style={[
                  styles.grade,
                  accessibility?.fontSize && accessibility.fontSize >= 150
                    ? { padding: 0 }
                    : {},
                ]}
              >
                <Text
                  style={
                    grade.grade.length < 3
                      ? styles.gradeText
                      : styles.longGradeText
                  }
                  numberOfLines={1}
                >
                  {grade.grade}
                </Text>
              </Col>
            </Row>
            <Section>
              {!!grade.onTimeExamPoints && (
                <>
                  <SectionHeader
                    separator={false}
                    title={t('recordedGradeScreen.additionalPoint')}
                    trailingIcon={{
                      onPress: onPressEvent,
                      icon: faQuestionCircle,
                      color: colors.link,
                    }}
                  />
                  <OverviewList indented loading={!grade}>
                    <ListItem
                      leadingItem={
                        <Icon icon={faFlagCheckered} size={fontSizes['2xl']} />
                      }
                      title={t('recordedGradeScreen.titleOnTimePoint')}
                      trailingItem={
                        <Text style={styles.onTimeItem}>
                          {'+' + grade.onTimeExamPoints}
                        </Text>
                      }
                    />
                  </OverviewList>
                </>
              )}
            </Section>

            <Section>
              {staffQueries.data && (
                <>
                  <SectionHeader title={t('recordedGradeScreen.staff')} />
                  <OverviewList
                    indented
                    loading={!grade || staffQueries.isLoading}
                  >
                    <PersonListItem
                      key={`${staffQueries.data.id}`}
                      person={staffQueries.data}
                      subtitle={t('recordedGradeScreen.teacher')}
                    />
                  </OverviewList>
                </>
              )}
            </Section>
          </SafeAreaView>
        )}
        <BottomBarSpacer />
      </ScrollView>
      <BottomModal dismissable {...bottomModal} />
    </>
  );
};

const createStyles = ({
  colors,
  fontSizes,
  spacing,
  fontWeights,
  palettes,
  dark,
}: Theme) =>
  StyleSheet.create({
    grade: {
      minWidth: 60,
      height: 60,
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: spacing[2],
    },
    gradeText: {
      fontSize: fontSizes['2xl'],
      fontWeight: fontWeights.semibold,
    },
    longGradeText: {
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.semibold,
    },
    onTimeItem: {
      fontWeight: 'bold',
      fontSize: fontSizes.xl,
      color: palettes.success[dark ? 400 : 700],
    },
    textModal: {
      padding: spacing[7],
      gap: spacing[2],
    },
  });
