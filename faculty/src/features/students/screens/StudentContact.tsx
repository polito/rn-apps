import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import {
  faAward,
  faCalendarCheck,
  faChevronRight,
  faEnvelope,
  faFlag,
  faHandHoldingHeart,
  faPersonHalfDress,
} from '@fortawesome/free-solid-svg-icons';
import { formatDateFromString } from '@polito/lib/core';
import {
  Badge,
  BottomBarSpacer,
  Col,
  Icon,
  ListItem,
  Metric,
  OverviewList,
  Row,
  Section,
  SectionHeader,
  Text,
  Theme,
  useHideTabs,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useCourses } from '../../../core/contexts/CoursesContext';
import type { StudentsStackParamList } from '../navigation/StudentsNavigator';

const profileImageSize = 120;

type Props = NativeStackScreenProps<StudentsStackParamList, 'StudentContact'>;

export const StudentContact = ({ navigation }: Props) => {
  useHideTabs();
  const { colors, fontSizes, palettes, dark } = useTheme();
  const styles = useStylesheet(createStyles);
  const { selectedStudent, selectedCourse } = useCourses();
  const { t } = useTranslation();

  if (!selectedStudent) return null;

  const courseCode = selectedCourse
    ? `${selectedCourse.code} - ${selectedCourse.cfu} CFU`
    : '—';
  const studentEmail = `${selectedStudent.id}@studenti.polito.it`;
  const latestExamDate = selectedStudent.passedExamsDate[0]
    ? formatDateFromString(selectedStudent.passedExamsDate[0])
    : '—';
  const subscriptionYear = selectedStudent.year
    ? `${selectedStudent.year}/${String(Number(selectedStudent.year) + 1)}`
    : '—';
  const iconColor = dark ? palettes.gray[50] : colors.heading;

  return (
    <ScrollView
      style={styles.scroll}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <SafeAreaView>
        <Col pv={5}>
          <Col ph={5} gap={6} mb={6}>
            <Col gap={1}>
              <Text weight="bold" variant="title" style={styles.title}>
                {selectedStudent.name} {selectedStudent.surname}
              </Text>
              <Text variant="secondaryText" uppercase weight="bold">
                {selectedStudent.id}
              </Text>
            </Col>
            <Row gap={6} align="center">
              <View
                accessible
                accessibilityLabel={t('common.profilePic', {
                  defaultValue: 'Profile picture',
                })}
                style={styles.profileImagePlaceholder}
              >
                <Icon
                  icon={faCircleUser}
                  size={fontSizes['3xl']}
                  color={colors.title}
                />
              </View>
              <Col style={styles.info}>
                <Metric
                  title={t('other.course', { defaultValue: 'Course' })}
                  value={courseCode}
                  valueStyle={styles.metricValue}
                  style={styles.spaceBottom}
                />
                <Metric
                  title={t('other.cds', { defaultValue: 'Cds' })}
                  value={selectedStudent.degreeCourse}
                  valueStyle={styles.metricValue}
                />
              </Col>
            </Row>
          </Col>

          <Section>
            <SectionHeader title={t('other.info', { defaultValue: 'Info' })} />
            <OverviewList indented>
              <ListItem
                title={t('other.specialNeeds', {
                  defaultValue: 'Special Needs',
                })}
                subtitle={t('other.specialNeedsSubtitle', {
                  defaultValue: 'List of all compensative measures',
                })}
                leadingItem={
                  <Icon
                    icon={faHandHoldingHeart}
                    size={fontSizes.xl}
                    color={iconColor}
                  />
                }
                trailingItem={
                  <Icon
                    icon={faChevronRight}
                    size={16}
                    color={palettes.gray[500]}
                  />
                }
                onPress={() => navigation.navigate('SpecialNeeds')}
              />
              <ListItem
                isAction
                title={t('other.email', { defaultValue: 'Email' })}
                subtitle={studentEmail}
                leadingItem={
                  <Icon
                    icon={faEnvelope}
                    size={fontSizes.xl}
                    color={iconColor}
                  />
                }
                onPress={() =>
                  navigation.navigate('EmailCompose', {
                    selectedIds: [selectedStudent.id],
                  })
                }
              />
              <ListItem
                title={t('other.examResult', { defaultValue: 'Exam result' })}
                subtitle={latestExamDate}
                leadingItem={
                  <Icon icon={faAward} size={fontSizes.xl} color={iconColor} />
                }
                trailingItem={
                  selectedStudent.exam === 'yes' ? (
                    <Badge
                      text="30L"
                      backgroundColor={
                        dark ? palettes.gray[500] : colors.background
                      }
                      foregroundColor={
                        dark ? palettes.gray[800] : palettes.gray[700]
                      }
                    />
                  ) : undefined
                }
              />
              <ListItem
                title={t('other.subscription', {
                  defaultValue: 'Subscription',
                })}
                subtitle={subscriptionYear}
                leadingItem={
                  <Icon
                    icon={faCalendarCheck}
                    size={fontSizes.xl}
                    color={iconColor}
                  />
                }
              />
              <ListItem
                title={t('other.citizenship', {
                  defaultValue: 'Citizenship',
                })}
                subtitle={
                  selectedStudent.countryOfBirth ||
                  t('other.countryFallback', { defaultValue: 'Italy' })
                }
                leadingItem={
                  <Icon icon={faFlag} size={fontSizes.xl} color={iconColor} />
                }
              />
              <ListItem
                title={t('other.gender', { defaultValue: 'Gender' })}
                subtitle={selectedStudent.gender || '—'}
                leadingItem={
                  <Icon
                    icon={faPersonHalfDress}
                    size={fontSizes.xl}
                    color={iconColor}
                  />
                }
              />
            </OverviewList>
          </Section>
        </Col>
        <BottomBarSpacer />
      </SafeAreaView>
    </ScrollView>
  );
};

const createStyles = ({ spacing, colors, fontSizes }: Theme) => {
  const profileImage = {
    width: profileImageSize,
    height: profileImageSize,
    borderRadius: profileImageSize,
  };

  return StyleSheet.create({
    scroll: {
      flex: 1,
    },
    title: {
      fontSize: fontSizes['2xl'],
    },
    info: {
      flex: 1,
      justifyContent: 'center',
    },
    profileImagePlaceholder: {
      ...profileImage,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
    },
    spaceBottom: {
      marginBottom: spacing[2],
    },
    metricValue: {
      textTransform: 'uppercase',
    },
  });
};
