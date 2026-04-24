import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { useOfflineDisabled } from '@polito/lib/core';
import {
  BottomBarSpacer,
  Card,
  Col,
  GlobalStyles,
  Grid,
  Icon,
  ListItem,
  Metric,
  OverviewList,
  PersonListItem,
  RefreshControl,
  Row,
  Section,
  SectionHeader,
  StatefulMenuView,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { Person } from '@polito/student-api-client';
import { MenuAction } from '@react-native-menu/menu';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';

import { useNotifications } from '../../../core/hooks/useNotifications';
import { useOpenInAppLink } from '../../../core/hooks/useOpenInAppLink.ts';
import {
  CourseSectionEnum,
  getCourseKey,
  useGetCourse,
  useGetCourseEditions,
  useGetCourseExams,
} from '../../../core/queries/courseHooks';
import { useGetPersons } from '../../../core/queries/peopleHooks';
import { LectureCard } from '../../agenda/components/LectureCard';
import { useGetNextLecture } from '../../agenda/queries/lectureHooks';
import { ExamListItem } from '../../teaching/components/ExamListItem';
import { TeachingStackParamList } from '../../teaching/components/TeachingNavigator';
import { CourseStatisticsFilterType } from '../components/CourseStatisticsFilters.tsx';
import { useCourseContext } from '../contexts/CourseContext';
import { useOptionalCourseTabContentTopStyle } from '../hooks/useCourseCollapsingContentStyle';
import { useCourseCollapsingTabScroll } from '../hooks/useCourseCollapsingTabScroll';

type StaffMember = Person & { courseRole: 'roleHolder' | 'roleCollaborator' };

export const CourseInfoScreen = () => {
  const { t } = useTranslation();
  const courseId = useCourseContext();
  const styles = useStylesheet(createStyles);
  const { spacing, palettes } = useTheme();
  const { getUnreadsCount, getUnreadsCountPerCourse } = useNotifications();
  const { fontSizes } = useTheme();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const { data: editions } = useGetCourseEditions(courseId);
  const courseQuery = useGetCourse(courseId);
  const {
    nextLecture,
    dayOfMonth,
    weekDay,
    monthOfYear,
    isLoadingNextLecture,
  } = useGetNextLecture(courseId);
  const openInAppLink = useOpenInAppLink();
  const courseExamsQuery = useGetCourseExams(
    courseId,
    courseQuery.data?.shortcode,
  );
  const { queries: staffQueries, isLoading: isStaffLoading } = useGetPersons(
    courseQuery.data?.staff.map(s => s.id),
  );

  const unreadsCurrentYear = getUnreadsCount([
    'teaching',
    'courses',
    `${courseId}`,
  ]);
  const unreadsPrevEditions =
    (getUnreadsCountPerCourse(null, editions) ?? 0) - (unreadsCurrentYear ?? 0);

  const isOffline = useOfflineDisabled();

  const { getParent } = useNavigation();

  const menuActions = useMemo(() => {
    if (!editions) return [];
    return editions.map(e => {
      const editionsCount = getUnreadsCount(['teaching', 'courses', `${e.id}`]);
      return {
        id: `${e.id}`,
        title: e.year.toString(),
        state: courseId === +e.id ? 'on' : undefined,
        image: editionsCount
          ? Platform.select({ ios: 'circle.fill', android: 'circle' })
          : undefined,
        imageColor: editionsCount ? palettes.rose[600] : undefined,
      } as MenuAction;
    });
  }, [editions, courseId, palettes, getUnreadsCount]);
  useEffect(() => {
    if (!courseQuery.data || isStaffLoading) {
      return;
    }
    const staffData: StaffMember[] = [];

    staffQueries.forEach((staffQuery, index) => {
      if (!staffQuery.data || isStaffLoading) return;

      staffData.push({
        ...staffQuery.data,
        courseRole:
          courseQuery.data.staff[index].role === 'Titolare'
            ? 'roleHolder'
            : 'roleCollaborator',
      });
    });

    setStaff(staffData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseQuery.data, isStaffLoading]);

  const queryClient = useQueryClient();
  const isGuideDataMissing = useCallback(
    () =>
      queryClient.getQueryData(
        getCourseKey(courseId, CourseSectionEnum.Guide),
      ) === undefined,
    [courseId, queryClient],
  );
  const isGuideDisabled = useOfflineDisabled(isGuideDataMissing);
  const isStatisticsDisabled = !courseQuery.data?.shortcode;
  const { scrollHandler } = useCourseCollapsingTabScroll();
  const topContentStyle = useOptionalCourseTabContentTopStyle();

  return (
    <Animated.ScrollView
      style={GlobalStyles.grow}
      contentContainerStyle={topContentStyle}
      contentInsetAdjustmentBehavior="never"
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      refreshControl={
        <RefreshControl
          queries={[courseQuery, courseExamsQuery, ...staffQueries]}
          manual
        />
      }
    >
      <SafeAreaView>
        <Card style={styles.metricsCard} accessible={true}>
          <Grid>
            <View
              style={GlobalStyles.grow}
              importantForAccessibility="yes"
              accessibilityRole="button"
              accessible={true}
            >
              <StatefulMenuView
                actions={menuActions}
                onPressAction={async ({ nativeEvent: { event } }) => {
                  // replace current screen with same screen with event id as param
                  (
                    getParent()! as NativeStackNavigationProp<
                      TeachingStackParamList,
                      'Course'
                    >
                  ).replace('Course', {
                    id: +event,
                    animated: false,
                  });
                }}
              >
                <Row justify="flex-start" align="center">
                  <Metric
                    title={t('common.period')}
                    value={`${courseQuery.data?.teachingPeriod ?? '--'} - ${
                      courseQuery.data?.year ?? '--'
                    }`}
                    accessibilityLabel={`${t('degreeCourseScreen.period')}: ${
                      courseQuery.data?.teachingPeriod ?? '--'
                    } - ${courseQuery.data?.year ?? '--'}`}
                    style={styles.periodMetric}
                  />
                  <Col align="center">
                    {unreadsPrevEditions > 0 && (
                      <Icon
                        icon={faCircle}
                        size={8}
                        color={styles.dotIcon.color}
                        style={styles.dotIcon}
                      />
                    )}
                    {(editions?.length ?? 0) > 0 && (
                      <Icon
                        icon={faAngleDown}
                        size={14}
                        style={{
                          marginTop: unreadsPrevEditions
                            ? undefined
                            : spacing[4],
                        }}
                        color={styles.periodDropdownIcon.color}
                      />
                    )}
                  </Col>
                </Row>
              </StatefulMenuView>
            </View>
          </Grid>
        </Card>
        <Section>
          <SectionHeader title={t('courseInfoTab.nextLectureLabel')} />
          <OverviewList
            indented
            loading={isLoadingNextLecture}
            emptyStateText={
              isOffline && isLoadingNextLecture
                ? t('common.cacheMiss')
                : t('courseInfoTab.nextLectureEmptyState')
            }
          >
            {nextLecture && (
              <Row style={styles.nextLectureBox}>
                <Col style={styles.dayColumn} align="stretch">
                  <View style={[styles.dayBox, styles.nextLecBox]}>
                    <Text
                      variant="heading"
                      style={[styles.nextLec, styles.secondaryDay]}
                    >
                      {weekDay}
                    </Text>
                    <Text variant="heading" style={styles.nextLec}>
                      {dayOfMonth}
                    </Text>
                    {monthOfYear && (
                      <Text variant="heading" style={styles.nextLec}>
                        {monthOfYear}
                      </Text>
                    )}
                  </View>
                </Col>
                <Col flex={1}>
                  {nextLecture && (
                    <LectureCard
                      item={nextLecture}
                      nextLecture
                      nextDate={`${weekDay}/${dayOfMonth}/${monthOfYear}`}
                    />
                  )}
                </Col>
              </Row>
            )}
          </OverviewList>
        </Section>

        <Section>
          <SectionHeader title={t('courseInfoTab.staffSectionTitle')} />
          <OverviewList
            indented
            loading={
              !courseQuery?.data ||
              ((courseQuery.data?.staff?.length ?? 0) > 0 && staff.length === 0)
            }
          >
            {staff.map(member => (
              <PersonListItem
                key={`${member.id}`}
                person={member}
                subtitle={t(`common.${member.courseRole}`)}
              />
            ))}
          </OverviewList>
        </Section>
        <Section>
          <SectionHeader title={t('examsScreen.title')} />
          <OverviewList
            loading={courseExamsQuery.isLoading}
            indented
            emptyStateText={
              isOffline && courseExamsQuery.isLoading
                ? t('common.cacheMiss')
                : t('examsScreen.emptyState')
            }
          >
            {courseExamsQuery.data?.map(exam => (
              <ExamListItem
                key={`${exam.id}` + exam.moduleNumber}
                exam={exam}
              />
            ))}
          </OverviewList>
        </Section>

        <Section>
          <SectionHeader title={t('courseInfoTab.linksSectionTitle')} />
          <OverviewList
            indented
            loading={!courseQuery?.data}
            emptyStateText={
              isOffline && courseQuery.isLoading
                ? t('common.cacheMiss')
                : t('courseInfoTab.linksSectionEmptyState')
            }
          >
            {courseQuery.data?.links.map((link, index) => (
              <ListItem
                key={index}
                leadingItem={<Icon icon={faLink} size={fontSizes.xl} />}
                title={link.description ?? t('courseInfoTab.linkDefaultTitle')}
                subtitle={link.url}
                onPress={() => openInAppLink(link.url)}
              />
            ))}
          </OverviewList>
        </Section>

        <Section>
          <SectionHeader title={t('courseInfoTab.moreSectionTitle')} />
          <OverviewList>
            <ListItem
              title={t('courseGuideScreen.title')}
              linkTo={{ screen: 'CourseGuide', params: { courseId } }}
              disabled={isGuideDisabled}
            />
            <ListItem
              title={t('courseStatisticsScreen.title')}
              subtitle={t('courseStatisticsScreen.subtitle')}
              linkTo={{
                screen: 'CourseStatistics',
                params: {
                  courseShortcode: courseQuery.data?.shortcode,
                  year: courseQuery.data?.year,
                  teacherId: courseQuery.data?.teacherId,
                  filter: CourseStatisticsFilterType.YEAR,
                  nameCourse: courseQuery.data?.name,
                },
              }}
              disabled={isStatisticsDisabled}
            />
          </OverviewList>
        </Section>
        <BottomBarSpacer />
      </SafeAreaView>
    </Animated.ScrollView>
  );
};

const createStyles = ({
  palettes,
  spacing,
  colors,
  fontWeights,
  shapes,
}: Theme) =>
  StyleSheet.create({
    grow: {
      flex: 1,
    },
    metricsCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[4],
      marginTop: spacing[4],
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
      color: palettes.rose['600'],
    },
    dayColumn: {
      width: '15%',
      maxWidth: 200,
    },
    secondaryDay: {
      textTransform: 'capitalize',
      fontWeight: fontWeights.medium,
    },
    dayBox: {
      display: 'flex',
      alignItems: 'center',
      paddingVertical: spacing[2],
    },
    nextLecBox: {
      display: 'flex',
      backgroundColor: colors.heading,
      borderRadius: shapes.lg,
      marginLeft: spacing[1],
      marginTop: spacing[2],
    },
    nextLec: {
      color: colors.surface,
    },
    nextLectureBox: {
      gap: spacing[4],
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[2],
    },
  });
