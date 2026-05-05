import React from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { formatDateFromString } from '@polito/lib/core';
import {
  BottomBarSpacer,
  CtaButton,
  CtaButtonContainer,
  CtaButtonSpacer,
  DisclosureIndicator,
  IndentedDivider,
  ListItem,
  OverviewList,
  Row,
  Section,
  Select,
} from '@polito/lib/ui';
import { Theme, useStylesheet } from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useCourses } from '../../core/contexts/CoursesContext';
// import { CourseLectureMultiSelectScreen } from './CourseLectureMultiSelectScreen';
import { CourseSharedScreensParamList } from './CourseSharedScreens';
import { LectureStatusBadge } from './LectureStatusBadge';

export const CourseLecturesTab = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<CourseSharedScreensParamList>>();

  const { selectedCourse, setSelectedLecture } = useCourses();

  // Troviamo il corso corrispondente
  const course = selectedCourse;
  const styles = useStylesheet(createStyles);
  const { t } = useTranslation();

  // When returning to this tab, clear the selected lecture in context
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setSelectedLecture(null);
    });

    return unsubscribe;
  }, [navigation, setSelectedLecture]);

  const [filter, setFilter] = React.useState<
    'newest' | 'oldest' | 'compiled' | 'toCompile' | 'drafts' | 'noFilter'
  >('noFilter');

  const [ellipsesFilter, setEllipsesFilter] = React.useState<
    'all' | 'untilToday'
  >('all');

  const getEllipsesFilterLabel = (currentFilter: 'all' | 'untilToday') => {
    switch (currentFilter) {
      case 'all':
        return t('common.all');
      case 'untilToday':
        return t('common.untilToday');
    }
  };

  const getFilterLabel = (
    currentFilter:
      | 'newest'
      | 'oldest'
      | 'compiled'
      | 'toCompile'
      | 'drafts'
      | 'noFilter'
      | undefined,
  ) => {
    switch (currentFilter) {
      case 'newest':
        return t('common.newestFirst');
      case 'oldest':
        return t('common.oldestFirst');
      case 'compiled':
        return t('common.compiled');
      case 'toCompile':
        return t('common.toCompile');
      case 'drafts':
        return t('common.draftPlural');
      default:
        return t('common.noFilter');
    }
  };

  const lectures = React.useMemo(() => {
    if (!course) return [];
    switch (filter) {
      case 'newest':
        return [...course.lessons].sort(
          (a, b) =>
            new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime(),
        );
      case 'oldest':
        return [...course.lessons].sort(
          (a, b) =>
            new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime(),
        );

      case 'compiled':
        return [...course.lessons].filter(
          lesson => lesson.status === 'compiled',
        );
      case 'toCompile':
        return [...course.lessons].filter(
          lesson => lesson.status === 'to compile',
        );
      case 'drafts':
        return [...course.lessons].filter(lesson => lesson.status === 'draft');
      default:
        return course.lessons;
    }
  }, [course, filter]);

  const filteredLectures = React.useMemo(() => {
    if (ellipsesFilter === 'untilToday') {
      const today = new Date();
      return lectures.filter(lecture => {
        const lectureDate = new Date(lecture.date ?? 0);
        return lectureDate <= today;
      });
    }
    return lectures;
  }, [lectures, ellipsesFilter]);

  // Se il corso non esiste, restituiamo null
  if (!course) {
    return null;
  }

  return (
    <React.Fragment>
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.container}
        >
          <Row align="center" justify="space-between" gap={2} pr={4}>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Select
                label={getFilterLabel(filter)}
                options={[
                  { id: 'noFilter', title: getFilterLabel('noFilter') },
                  { id: 'newest', title: getFilterLabel('newest') },
                  { id: 'oldest', title: getFilterLabel('oldest') },
                  { id: 'compiled', title: getFilterLabel('compiled') },
                  { id: 'toCompile', title: getFilterLabel('toCompile') },
                  { id: 'drafts', title: getFilterLabel('drafts') },
                ]}
                onSelectOption={id =>
                  setFilter(
                    id as
                      | 'newest'
                      | 'oldest'
                      | 'compiled'
                      | 'toCompile'
                      | 'drafts'
                      | 'noFilter',
                  )
                }
              />
            </View>

            <View style={{ flexShrink: 0, marginRight: 10 }}>
              <Select
                ellipsis={true}
                label={getEllipsesFilterLabel(ellipsesFilter)}
                options={[
                  { id: 'all', title: getEllipsesFilterLabel('all') },
                  {
                    id: 'untilToday',
                    title: getEllipsesFilterLabel('untilToday'),
                  },
                ]}
                onSelectOption={id =>
                  setEllipsesFilter(id as 'all' | 'untilToday')
                }
              />
            </View>
          </Row>

          <Section>
            <OverviewList indented style={styles.listContainer}>
              {filteredLectures.map((lecture, index) => {
                return (
                  <React.Fragment key={lecture.id}>
                    <ListItem
                      isAction
                      title={
                        lecture.title ? lecture.title : t('common.newLecture')
                      }
                      subtitle={`${lecture.date ? formatDateFromString(lecture.date) : t('common.datePlaceholder')} - ${lecture.time ? lecture.time : t('common.timePlaceholder')}`}
                      onPress={() => {
                        setSelectedLecture(lecture);
                        navigation.navigate('Lecture');
                      }}
                      onLongPress={
                        selectedCourse?.id != null
                          ? () => {
                              navigation.navigate('MultiSelectLectures', {
                                initialSelectedIds: [lecture.id],
                              });
                            }
                          : undefined
                      }
                      trailingItem={
                        <Row align="center">
                          <LectureStatusBadge lecture={lecture} />
                          <DisclosureIndicator />
                        </Row>
                      }
                    />
                    {index < lectures.length - 1 && <IndentedDivider />}
                  </React.Fragment>
                );
              })}
            </OverviewList>
          </Section>
          <BottomBarSpacer />
          <CtaButtonSpacer />
        </ScrollView>
      </SafeAreaView>
      <CtaButtonContainer absolute={true}>
        <CtaButton
          title={t('courseLecturesScreen.addLecture')}
          action={() => {
            navigation.navigate('AddOrEditLectureContent');
          }}
          icon={faPlus}
          absolute={true}
        />
      </CtaButtonContainer>
    </React.Fragment>
  );
};

const createStyles = ({ spacing, shapes }: Theme) =>
  StyleSheet.create({
    listContainer: {
      borderRadius: shapes.lg,
      marginTop: spacing[2.5],
      elevation: 0,
    },
    container: {
      marginTop: spacing[5],
    },
  });
