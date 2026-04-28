import { useLayoutEffect } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { Person } from '@polito/api-client';
import {
  BottomBarSpacer,
  Card,
  DisclosureIndicator,
  GlobalStyles,
  IndentedDivider,
  ListItem,
  Metric,
  OverviewList,
  PersonListItem,
  Row,
  ScreenTitle,
  Section,
  SectionHeader,
  Text,
} from '@polito/lib/ui';
import { Theme, useStylesheet, useTheme } from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';

import { useCourses } from '../../core/contexts/CoursesContext';
import { ExamListItem } from './ExamListItem';
import { MoodleStatusBadge } from './MoodleStatusBagde';

export const CourseInfoScreen = () => {
  const { t } = useTranslation();
  const { palettes, spacing } = useTheme();
  const { selectedCourse } = useCourses();
  const styles = useStylesheet(createStyles);
  const { setOptions } = useNavigation();

  useLayoutEffect(() => {
    const headerTitle = selectedCourse?.title || 'Course';
    setOptions({
      headerTitle,
      headerBackTitleVisible: headerTitle.length <= 20,
    });
  }, [selectedCourse?.title, setOptions]);

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
      style={styles.container}
      contentInsetAdjustmentBehavior="automatic"
    >
      <SafeAreaView>
        <Section style={styles.screenTitle}>
          <ScreenTitle title={selectedCourse.title} />
          <Text variant="caption">
            {selectedCourse.code}
            {selectedCourse.cfu
              ? ` - ${selectedCourse.cfu}${t('common.cfu').toLowerCase()}`
              : ''}
          </Text>
        </Section>
        <Card style={styles.metricsCard}>
          <View style={GlobalStyles.grow}>
            <Row justify="space-between" align="center">
              <Metric
                title={t('common.period')}
                value={`${selectedCourse?.period ?? '--'} - ${
                  selectedCourse?.year.split('/')[selectedCourse?.period - 1] ??
                  '--'
                }`}
                accessibilityLabel={`${t('degreeCourseScreen.period')}: ${
                  selectedCourse?.period ?? '--'
                } - ${selectedCourse?.year.split('/')[selectedCourse?.period - 1] ?? '--'}`}
                style={styles.periodMetric}
                color={palettes.secondary[700]}
              />
              <MoodleStatusBadge />
            </Row>
          </View>
        </Card>

        <Section>
          <SectionHeader
            title={t('courseInfoTab.staffSectionTitle')}
            linkTo="#"
          />
          <OverviewList indented style={styles.listContainer}>
            {selectedCourse.staff.map((member, index) => {
              const person: Person = {
                id: member.idProfile ?? member.id,
                firstName:
                  member.name.split(' ')[0] ?? member.name?.split(' ')[0] ?? '',
                lastName: member.name?.split(' ').slice(1).join(' ') ?? '',
                picture: '',
                email: '',
                role: member.role,
                phoneNumbers: [],
                facilityShortName: '',
                profileUrl: '',
                courses: [],
              };
              const t_role =
                member.role === 'Titolare' ? 'roleHolder' : 'roleCollaborator';

              return (
                <React.Fragment key={member.id}>
                  <PersonListItem
                    key={`${member.id}`}
                    person={person}
                    subtitle={t(`common.${t_role}`)}
                  />
                  {index < selectedCourse.staff.length - 1 && (
                    <IndentedDivider />
                  )}
                </React.Fragment>
              );
            })}
          </OverviewList>
        </Section>

        <Section>
          <SectionHeader title={t('examsScreen.title')} />
          <OverviewList indented style={styles.listContainer}>
            {selectedCourse.examcalls.map((call, index) => (
              <React.Fragment key={call.id}>
                <ExamListItem
                  /* hardcoded exam object for the exam list item */
                  exam={{
                    courseId: selectedCourse.id,
                    isTimeToBeDefined: false,
                    uniqueShortcode: selectedCourse.code,
                    id: call.idExam,
                    courseShortcode: selectedCourse.code,
                    courseName: selectedCourse.title,
                    teacherId: 1,
                    type: '',
                    status: 'unavailable',
                    bookingStartsAt: new Date('2025-12-09 09:00:00'),
                    bookingEndsAt: new Date('2026-01-09 09:00:00'),
                    examStartsAt:
                      call.date === 'Oggi' || call.date === 'Today'
                        ? new Date()
                        : new Date(call.date),
                    examEndsAt: new Date('2026-01-19 12:00:00'),
                    bookedCount: 5,
                    availableCount: 100,
                    question: null,
                    feedback: null,
                    isReschedulable: false,
                    notes: 'Bring your ID card.',
                    moduleNumber: 1,
                    places: [
                      {
                        buildingId: 'R2',
                        name: 'Aula R2',
                        floorId: '1',
                        roomId: '101',
                        siteId: 'Centrale',
                      },
                    ],
                    requestReason: null,
                    requestDetails: null,
                  }}
                />
                {index < selectedCourse.examcalls.length - 1 && (
                  <IndentedDivider />
                )}
              </React.Fragment>
            ))}
          </OverviewList>
        </Section>

        <Section>
          <SectionHeader title={t('other.other')} linkTo="" />
          <OverviewList indented style={styles.listContainer}>
            <ListItem
              title={t('courseGuideScreen.title')}
              linkTo="CourseGuide"
              trailingItem={<DisclosureIndicator />}
            />
          </OverviewList>
        </Section>
        <BottomBarSpacer />
      </SafeAreaView>
    </ScrollView>
  );
};

const createStyles = ({ colors, spacing, shapes, palettes }: Theme) =>
  StyleSheet.create({
    container: {
      paddingTop: spacing[5],
    },
    screenTitle: {
      marginHorizontal: spacing[4],
    },
    metricsCard: {
      justifyContent: 'space-between',
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[3],
      marginTop: 0,
      marginBottom: spacing[5], // This overwrites the default vertical margin of Card
      borderRadius: shapes.lg,
      marginHorizontal: spacing[4],
      elevation: 0,
    },
    periodMetric: {
      marginRight: spacing[2.5],
    },
    periodDropdownIcon: {
      color: palettes.secondary['500'],
    },
    dotIcon: {
      marginBottom: spacing[2],
      color: colors.prose['600'],
    },
    listContainer: {
      borderRadius: shapes.lg,
      marginHorizontal: spacing[4],
      elevation: 0,
    },
    staffContainerTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing[2.5],
      justifyContent: 'space-between',
    },
  });
