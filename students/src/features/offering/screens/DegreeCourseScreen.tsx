import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import {
  faAngleDown,
  faBriefcase,
  faChartLine,
  faFlaskVial,
  faMicroscope,
  faPersonChalkboard,
} from '@fortawesome/free-solid-svg-icons';
import { useOfflineDisabled } from '@polito/lib/core';
import {
  BottomBarSpacer,
  Card,
  GlobalStyles,
  Grid,
  Icon,
  ListItem,
  LoadingContainer,
  Metric,
  OverviewList,
  RefreshControl,
  Row,
  ScreenTitle,
  Section,
  SectionHeader,
  StatefulMenuView,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { MenuAction } from '@react-native-menu/menu';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useGetOfferingCourse } from '~/core/queries/offeringHooks.ts';

import { CourseStatisticsFilterType } from '../../courses/components/CourseStatisticsFilters.tsx';
import { ServiceStackParamList } from '../../services/components/ServicesNavigator';
import { StaffListItem } from '../components/StaffListItem';

type Props = NativeStackScreenProps<ServiceStackParamList, 'DegreeCourse'>;
const listTitleProps = { numberOfLines: 4 };
export const DegreeCourseScreen = ({ route }: Props) => {
  const { courseShortcode, year: initialYear } = route.params;
  const styles = useStylesheet(createStyles);
  const { t } = useTranslation();
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [currentYear, setCurrentYear] = useState(initialYear);

  const isOffline = useOfflineDisabled();

  const courseQuery = useGetOfferingCourse({
    courseShortcode,
    year: selectedYear,
  });
  const { palettes, spacing } = useTheme();
  const offeringCourse = courseQuery.data;

  const moreStaffCount = useMemo(() => {
    if (!offeringCourse) return undefined;
    return offeringCourse.staff.length > 3
      ? offeringCourse.staff.length - 3
      : undefined;
  }, [offeringCourse]);

  useEffect(() => {
    if (!offeringCourse) return;
    setCurrentYear(offeringCourse.year);
  }, [offeringCourse]);

  const yearOptions = useMemo(() => {
    if (
      !offeringCourse?.editions ||
      isOffline ||
      !currentYear ||
      offeringCourse.editions.length < 2
    )
      return [];
    return offeringCourse.editions?.map(
      edition =>
        ({
          id: edition.toString(),
          title: edition,
          state: edition === currentYear ? 'on' : undefined,
        }) as MenuAction,
    );
  }, [currentYear, isOffline, offeringCourse]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={<RefreshControl queries={[courseQuery]} manual />}
    >
      <SafeAreaView>
        <LoadingContainer loading={courseQuery.isLoading}>
          <Section>
            <ScreenTitle style={styles.heading} title={offeringCourse?.name} />
            <Text style={styles.shortCode} variant="caption">
              {offeringCourse?.shortcode}
            </Text>
          </Section>
          <Card style={styles.metricsCard}>
            <Row justify="space-between">
              <Grid>
                <View
                  style={GlobalStyles.grow}
                  importantForAccessibility="yes"
                  accessible={true}
                >
                  <StatefulMenuView
                    actions={yearOptions}
                    onPressAction={async ({ nativeEvent: { event } }) => {
                      setSelectedYear(() => event);
                      await courseQuery.refetch();
                    }}
                  >
                    <Row
                      accessible={true}
                      accessibilityRole="button"
                      accessibilityLabel={[
                        t('degreeCourseScreen.period'),
                        `${offeringCourse?.teachingPeriod ?? '--'} - ${
                          currentYear ?? '--'
                        }`,
                        t('degreeCourseScreen.periodSelect'),
                      ].join(', ')}
                      justify="flex-start"
                      align="center"
                    >
                      <Metric
                        title={t('degreeCourseScreen.period')}
                        value={`${offeringCourse?.teachingPeriod ?? '--'} - ${
                          currentYear ?? '--'
                        }`}
                      />
                      {yearOptions.length > 0 && (
                        <Icon
                          icon={faAngleDown}
                          color={palettes.secondary['500']}
                          size={14}
                          style={{
                            marginLeft: spacing[2],
                            marginTop: spacing[4],
                          }}
                        />
                      )}
                    </Row>
                  </StatefulMenuView>
                </View>

                <Metric
                  title={t('courseInfoTab.creditsLabel')}
                  value={t('common.creditsWithUnit', {
                    credits: offeringCourse?.cfu,
                  })}
                  accessibilityLabel={`${t('courseInfoTab.creditsLabel')}: ${
                    offeringCourse?.cfu
                  }`}
                  style={GlobalStyles.grow}
                />
              </Grid>
            </Row>
          </Card>
          {offeringCourse?.hours &&
            (offeringCourse.hours.lecture ||
              offeringCourse.hours.classroomExercise ||
              offeringCourse.hours.labExercise ||
              offeringCourse.hours.tutoring) && (
              <OverviewList accessibilityRole="list">
                {!!offeringCourse.hours.lecture && (
                  <ListItem
                    inverted
                    title={t('degreeCourseScreen.hours', {
                      hours: offeringCourse.hours.lecture.toString(),
                    })}
                    titleStyle={styles.title}
                    titleProps={listTitleProps}
                    subtitle={t('degreeCourseScreen.lecture')}
                    leadingItem={<Icon size={20} icon={faBriefcase} />}
                    accessibilityLabel={`${t('degreeCourseScreen.lecture')}: ${t(
                      'degreeCourseScreen.hours',
                      {
                        hours: offeringCourse.hours.lecture.toString(),
                      },
                    )}`}
                    accessibilityRole="none"
                  />
                )}
                {!!offeringCourse?.hours?.classroomExercise && (
                  <ListItem
                    inverted
                    title={t('degreeCourseScreen.hours', {
                      hours: offeringCourse.hours.classroomExercise.toString(),
                    })}
                    titleStyle={styles.title}
                    titleProps={listTitleProps}
                    subtitle={t('degreeCourseScreen.classroomExercise')}
                    leadingItem={<Icon size={20} icon={faMicroscope} />}
                    accessibilityLabel={`${t('degreeCourseScreen.classroomExercise')}: ${t(
                      'degreeCourseScreen.hours',
                      {
                        hours:
                          offeringCourse.hours.classroomExercise.toString(),
                      },
                    )}`}
                    accessibilityRole="none"
                  />
                )}
                {!!offeringCourse?.hours?.labExercise && (
                  <ListItem
                    inverted
                    title={t('degreeCourseScreen.hours', {
                      hours: offeringCourse?.hours?.labExercise?.toString(),
                    })}
                    titleStyle={styles.title}
                    titleProps={listTitleProps}
                    subtitle={t('degreeCourseScreen.labExercise')}
                    leadingItem={<Icon size={20} icon={faFlaskVial} />}
                    accessibilityLabel={`${t('degreeCourseScreen.labExercise')}: ${t(
                      'degreeCourseScreen.hours',
                      {
                        hours: offeringCourse?.hours?.labExercise?.toString(),
                      },
                    )}`}
                    accessibilityRole="none"
                  />
                )}
                {!!offeringCourse?.hours?.tutoring && (
                  <ListItem
                    inverted
                    title={t('degreeCourseScreen.hours', {
                      hours: offeringCourse.hours.tutoring.toString(),
                    })}
                    titleStyle={styles.title}
                    titleProps={listTitleProps}
                    subtitle={t('degreeCourseScreen.tutoring')}
                    leadingItem={<Icon size={20} icon={faPersonChalkboard} />}
                    accessibilityLabel={`${t('degreeCourseScreen.tutoring')}: ${t(
                      'degreeCourseScreen.hours',
                      {
                        hours: offeringCourse.hours.tutoring.toString(),
                      },
                    )}`}
                    accessibilityRole="none"
                  />
                )}
                {offeringCourse && (
                  <ListItem
                    title={t('degreeCourseScreen.statistics')}
                    titleStyle={styles.title}
                    titleProps={listTitleProps}
                    subtitle={t('degreeCourseScreen.statistics')}
                    linkTo={{
                      screen: 'CourseStatistics',
                      params: {
                        courseShortcode: offeringCourse.shortcode,
                        filter: CourseStatisticsFilterType.DEFAULT,
                        nameCourse: offeringCourse.name,
                      },
                    }}
                    leadingItem={<Icon size={20} icon={faChartLine} />}
                    accessibilityLabel={`${t('degreeCourseScreen.statistics')} ${t('common.forCourse')} ${offeringCourse.name}`}
                    accessibilityRole="button"
                    accessibilityHint={t('common.tapToNavigate')}
                  />
                )}
              </OverviewList>
            )}

          <Section style={styles.staffSection}>
            <SectionHeader
              title={t('degreeCourseScreen.staff')}
              linkToMoreCount={moreStaffCount}
              linkTo={
                moreStaffCount && offeringCourse
                  ? {
                      screen: 'Staff',
                      params: {
                        courseShortcode: offeringCourse.shortcode,
                        year: initialYear,
                        staff: offeringCourse.staff,
                      },
                    }
                  : undefined
              }
            />
            <OverviewList
              emptyStateText={t('degreeCourseScreen.noStaff')}
              accessibilityRole="list"
              accessibilityLabel={t('degreeCourseScreen.staff')}
            >
              {offeringCourse?.staff?.slice(0, 3).map((item, index, arr) => (
                <StaffListItem
                  key={`${item.id}${item.courseId}`}
                  staff={item}
                  index={index}
                  total={arr.length}
                />
              ))}
            </OverviewList>
          </Section>
          <Section>
            <SectionHeader title={t('common.other')} />
            <OverviewList
              accessibilityRole="list"
              accessibilityLabel={t('common.other')}
            >
              <ListItem
                title={t('courseGuideScreen.title')}
                linkTo={{
                  screen: 'DegreeCourseGuide',
                  params: {
                    courseShortcode: offeringCourse?.shortcode,
                    year: initialYear,
                  },
                }}
                accessibilityLabel={`${t('courseGuideScreen.title')} ${t('common.forCourse')} ${offeringCourse?.name}`}
                accessibilityRole="button"
                accessibilityHint={t('common.tapToNavigate')}
              />
            </OverviewList>
          </Section>
          <BottomBarSpacer />
        </LoadingContainer>
      </SafeAreaView>
    </ScrollView>
  );
};

const createStyles = ({ spacing, palettes, fontSizes }: Theme) =>
  StyleSheet.create({
    heading: {
      paddingHorizontal: Platform.select({
        android: spacing[2],
        ios: spacing[4],
      }),
      paddingTop: spacing[2],
      marginBottom: spacing[1],
    },
    metricsCard: {
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[4],
      marginTop: 0,
      marginBottom: spacing[7],
    },
    shortCode: {
      paddingHorizontal: Platform.select({
        android: spacing[2],
        ios: spacing[4],
      }),
    },
    title: {
      fontSize: fontSizes.sm,
      lineHeight: fontSizes.md * 1.2,
    },
    staffSection: {},
    label: {
      color: palettes.secondary['500'],
    },
  });
