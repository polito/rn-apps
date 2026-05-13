import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { faBell, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { formatDateFromString } from '@polito/lib/core';
import {
  BottomBarSpacer,
  DisclosureIndicator,
  Icon,
  IconButton,
  ListItem,
  Row,
  Section,
  SectionHeader,
  Text,
  useTheme,
} from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { SectionList } from '../../core/components/SectionList';
import { useCourses } from '../../core/contexts/CoursesContext';
import { CourseIndicator } from './CourseIndicator';
import { CourseListItem } from './CourseListItem';
import { TeachingStackParamList } from './TeachingNavigator';

const MAX_SECTION_ITEMS = 3;

export const TeachingScreen = () => {
  const { t } = useTranslation();
  const { fakeCourses, fakeExams, setSelectedExam } = useCourses();
  const navigation =
    useNavigation<NativeStackNavigationProp<TeachingStackParamList>>();
  const { colors, palettes, spacing, dark } = useTheme();

  const courseColors = [
    palettes.error[600],
    palettes.orange[600],
    palettes.green[600],
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon={faBell}
          color={dark ? colors.title : palettes.primary[700]}
          size={20}
          accessibilityLabel={t('common.notifications')}
          style={{ marginRight: -spacing[2] }}
          onPress={() => {}}
        />
      ),
    });
  }, [navigation, palettes, spacing, dark, colors, t]);

  const extraCourses = Math.max(0, fakeCourses.length - MAX_SECTION_ITEMS);
  const extraExams = Math.max(0, fakeExams.length - MAX_SECTION_ITEMS);

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={{ paddingTop: 10 }} />

      <Section>
        <SectionHeader
          title={t('other.myCourses')}
          linkTo="MyCourses"
          linkToMoreCount={extraCourses}
        />
        <SectionList>
          {fakeCourses.slice(0, MAX_SECTION_ITEMS).map((course, index) => (
            <CourseListItem
              key={course.id}
              course={course}
              color={courseColors[index % courseColors.length]}
            />
          ))}
        </SectionList>
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
              trailingItem={<DisclosureIndicator size={16} />}
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
