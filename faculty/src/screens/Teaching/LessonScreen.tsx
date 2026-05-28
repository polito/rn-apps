import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { faCalendar, faClock } from '@fortawesome/free-regular-svg-icons';
import {
  faLanguage,
  faLocationDot,
  faPencil,
  faPeopleGroup,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { formatDateFromString } from '@polito/lib/core';
import {
  BottomBarSpacer,
  Col,
  CtaButton,
  CtaButtonContainer,
  CtaButtonSpacer,
  Icon,
  IndentedDivider,
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

import { getTeachingTypeTitle } from '../../core/constants/teachingTypes';
import { useCourses } from '../../core/contexts/CoursesContext';
import { CourseSharedScreensParamList } from './CourseSharedScreens';
import { LectureStatusBadge } from './LectureStatusBadge';
import { StaffListItem } from './StaffListItem';

const OTHER_INFO_FIELDS = [
  {
    id: 'room',
    icon: faLocationDot,
    labelKey: 'other.room',
    getValue: (lecture: any) => lecture?.room,
  },
  {
    id: 'language',
    icon: faLanguage,
    labelKey: 'common.language',
    getValue: (lecture: any) => lecture?.language,
  },
  {
    id: 'team',
    icon: faPeopleGroup,
    labelKey: 'other.team',
    getValue: (lecture: any, course: any) => {
      if (!lecture?.team || !course?.teams) return null;
      const team = course.teams.find((t: any) => t.id === lecture.team);
      return team?.title;
    },
  },
];

export const LessonScreen = () => {
  const styles = useStylesheet(createStyles);
  const { selectedLecture, selectedCourse, deleteLessonFromCourse } =
    useCourses(); // Recupero i corsi dal context
  const { fontSizes } = useTheme();
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<CourseSharedScreensParamList>>();

  const handleDeleteLecture = () => {
    Alert.alert(
      t('common.confirm'),
      t('courseLecturesScreen.alertDeleteLecture'),
      [
        {
          text: t('common.no'),
          style: 'cancel',
        },
        {
          text: t('common.yes'),
          onPress: () => {
            if (selectedLecture && selectedCourse) {
              deleteLessonFromCourse(selectedCourse.id, selectedLecture.id);
              navigation.goBack();
            }
          },
        },
      ],
    );
  };

  return (
    <React.Fragment>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Section style={styles.section}>
          <Row align="center" justify="space-between">
            <Text variant="heading" style={styles.TitleText}>
              {selectedLecture?.title || t('other.title')}
            </Text>
            <LectureStatusBadge lecture={selectedLecture ?? undefined} />
          </Row>

          <Row align="center" style={styles.dateTimeContainer}>
            <View style={styles.dateContainer}>
              <Icon icon={faCalendar} size={fontSizes.md} />
              <Text style={styles.dateTimeText}>
                {selectedLecture?.date
                  ? formatDateFromString(selectedLecture?.date)
                  : t('common.datePlaceholder')}
              </Text>
            </View>

            <View style={styles.timeContainer}>
              <Icon icon={faClock} size={fontSizes.md} />
              <Text style={styles.dateTimeText}>
                {selectedLecture?.time || t('common.timePlaceholder')}
              </Text>
            </View>
          </Row>
        </Section>

        <Section>
          <SectionHeader
            title={t('other.topic')}
            titleStyle={styles.sectionHeader}
          />
          <Text style={styles.ContentText}>
            {selectedLecture?.content || t('other.description')}
          </Text>
        </Section>

        <Section>
          <SectionHeader title="Staff" titleStyle={styles.sectionHeader} />
          <OverviewList indented rounded style={styles.listContainer}>
            {selectedLecture?.staff?.map((staff, index) => {
              return (
                <React.Fragment key={staff.id}>
                  <StaffListItem
                    staff={staff}
                    subtitle={
                      staff.teachingType
                        ? getTeachingTypeTitle(staff.teachingType)
                        : t('common.none')
                    }
                    trailingItem={<View />} // Empty view to remove the pencil icon button from the staff list items
                  />
                  {index < (selectedLecture.staff?.length ?? 0) - 1 && (
                    <IndentedDivider />
                  )}
                </React.Fragment>
              );
            })}
          </OverviewList>
        </Section>

        <Section>
          <SectionHeader
            title={t('other.otherInfo')}
            titleStyle={styles.sectionHeader}
          />
          <OverviewList indented rounded style={styles.listContainer}>
            {OTHER_INFO_FIELDS.map((field, index) => {
              const value = field.getValue(selectedLecture, selectedCourse);
              const subtitle =
                field.id === 'team' && !selectedLecture?.team
                  ? t('common.allStudents')
                  : value
                    ? value
                    : t('common.none');

              return (
                <React.Fragment key={field.id}>
                  <ListItem
                    key={index}
                    leadingItem={
                      <Icon icon={field.icon} size={fontSizes['2xl']} />
                    }
                    title={t(field.labelKey)}
                    subtitle={subtitle}
                  />
                  {index < OTHER_INFO_FIELDS.length - 1 && <IndentedDivider />}
                </React.Fragment>
              );
            })}
          </OverviewList>
        </Section>
        <BottomBarSpacer />
        <CtaButtonSpacer />
      </ScrollView>

      <CtaButtonContainer absolute={true} style={styles.ctaContainer}>
        <Row gap={2.5}>
          <Col flex={1}>
            <CtaButton
              title={t('common.delete')}
              action={handleDeleteLecture}
              icon={faTrash}
              absolute={true}
              containerStyle={styles.ctaButtonContainer}
              destructive
              variant="outlined"
            />
          </Col>
          <Col flex={1}>
            <CtaButton
              title={t('common.edit')}
              action={() => {
                navigation.navigate('AddOrEditLectureContent');
              }}
              icon={faPencil}
              absolute={true}
              containerStyle={styles.ctaButtonContainer}
            />
          </Col>
        </Row>
      </CtaButtonContainer>
    </React.Fragment>
  );
};

const createStyles = ({ spacing, fontSizes, fontWeights }: Theme) =>
  StyleSheet.create({
    dateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[1],
      marginTop: spacing[1],
    },
    timeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[1],
      marginTop: spacing[1],
    },
    dateTimeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[3],
    },
    section: {
      padding: spacing[5],
      paddingBottom: 0,
    },
    ContentText: {
      fontSize: fontSizes.md,
      paddingHorizontal: spacing[5],
      fontFamily: 'Montserrat-Regular',
    },
    dateTimeText: {
      fontSize: fontSizes.sm,
    },
    sectionHeader: {
      fontSize: fontSizes.md,
      fontWeight: fontWeights.semibold,
      fontFamily: 'Montserrat-SemiBold',
    },
    TitleText: {
      fontSize: fontSizes.xl,
      fontWeight: fontWeights.semibold,
      fontFamily: 'Montserrat-SemiBold',
    },
    listContainer: {
      marginHorizontal: spacing[5],
      elevation: 0,
    },
    divider: {
      marginLeft: spacing[4],
    },
    ctaContainer: {
      paddingBottom: spacing[5],
    },
    ctaButtonContainer: {
      padding: 0,
    },
  });
