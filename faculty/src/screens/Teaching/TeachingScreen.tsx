import { useTranslation } from 'react-i18next';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
} from 'react-native';

import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { formatDateFromString, useOfflineDisabled } from '@polito/lib/core';
import {
  BottomBarSpacer,
  DisclosureIndicator,
  Icon,
  ListItem,
  OverviewList,
  Row,
  Section,
  SectionHeader,
  Text,
  useTheme,
} from '@polito/lib/ui';
import { useHeaderHeight } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { SectionList } from '../../core/components/SectionList';
import { useCourses } from '../../core/contexts/CoursesContext';
import { useGetCourses } from '../../core/queries/courseHooks';
import { CourseIndicator } from './CourseIndicator';
import { CourseListItem } from './CourseListItem';
import { TeachingStackParamList, useTeachingScroll } from './TeachingNavigator';

const MAX_SECTION_ITEMS = 3;

export const TeachingScreen = () => {
  const { t } = useTranslation();
  const coursesQuery = useGetCourses();
  const isOffline = useOfflineDisabled();
  const { fakeExams, setSelectedCourse, setSelectedExam } = useCourses();
  const navigation =
    useNavigation<NativeStackNavigationProp<TeachingStackParamList>>();
  const { colors, palettes } = useTheme();
  const headerHeight = useHeaderHeight();
  const { setIsScrolled } = useTeachingScroll();

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIsScrolled(e.nativeEvent.contentOffset.y > -headerHeight + 10);
  };

  const courseColors = [
    palettes.error[600],
    palettes.orange[600],
    palettes.green[600],
  ];

  const courses = coursesQuery.data ?? [];
  const extraCourses = Math.max(0, courses.length - MAX_SECTION_ITEMS);
  const extraExams = Math.max(0, fakeExams.length - MAX_SECTION_ITEMS);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="never"
      contentInset={{ top: headerHeight }}
      scrollIndicatorInsets={{ top: headerHeight }}
      onScroll={handleScroll}
      scrollEventThrottle={16}
    >
      <View style={{ paddingTop: 20 }} />

      <Section>
        <SectionHeader
          title={t('other.myCourses')}
          linkTo="MyCourses"
          linkToMoreCount={extraCourses}
        />
        <OverviewList
          loading={coursesQuery.isLoading && !isOffline}
          indented
          emptyStateText={
            isOffline ? t('common.cacheMiss') : t('coursesScreen.emptyState')
          }
        >
          {courses.slice(0, MAX_SECTION_ITEMS).map((course, index) => (
            <CourseListItem
              key={`${course.shortcode}${course.id}`}
              course={{
                id: course.id,
                title: course.name,
                code: course.shortcode,
              }}
              color={courseColors[index % courseColors.length]}
              disabled={course.id === null}
              onPress={() => {
                if (course.id === null) return;
                setSelectedCourse(null);
                navigation.navigate('Course', { id: course.id });
              }}
            />
          ))}
        </OverviewList>
      </Section>

      <Section>
        <SectionHeader
          title={t('other.appeals')}
          linkTo="ExamsCalls"
          linkToMoreCount={extraExams}
        />
        <SectionList>
          {fakeExams.slice(0, MAX_SECTION_ITEMS).map((exam, index) => (
            <ListItem
              key={exam.id}
              title={exam.subject}
              leadingItem={
                <CourseIndicator
                  color={courseColors[index % courseColors.length]}
                />
              }
              trailingItem={<DisclosureIndicator />}
              subtitle={
                <Row gap={2} pt={1} align="center">
                  <Row gap={1} align="center">
                    <Icon icon={faCalendar} color={colors.secondaryText} />
                    <Text variant="secondaryText">
                      {exam.date === 'Oggi'
                        ? t('other.today')
                        : formatDateFromString(exam.date)}
                    </Text>
                  </Row>
                  {exam.where ? (
                    <Row gap={1} flexShrink={1} align="center">
                      <Icon icon={faLocationDot} color={colors.secondaryText} />
                      <Text
                        variant="secondaryText"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{ flexShrink: 1 }}
                      >
                        {exam.where}
                      </Text>
                    </Row>
                  ) : null}
                </Row>
              }
              onPress={() => {
                setSelectedExam(exam);
                navigation.navigate('Exam', { id: exam.id });
              }}
            />
          ))}
        </SectionList>
      </Section>

      <BottomBarSpacer />
    </ScrollView>
  );
};
