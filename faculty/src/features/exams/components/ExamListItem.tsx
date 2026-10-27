import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { usePreferencesContext } from '@polito/lib/core';
import { Icon, ListItem, Row, Text, useTheme } from '@polito/lib/ui';

import { AppPreferences } from '~/core/types/preferences';

import { CourseIcon } from '../../../screens/Teaching/CourseIcon';
import { Exam } from '../types/exams';
import { formatExamDay, formatExamPlaces } from '../utils/exam';

type Props = {
  exam: Exam;
  index: number;
  total: number;
  onPress: () => void;
};

export const ExamListItem = ({ exam, index, total, onPress }: Props) => {
  const { t } = useTranslation();
  const { colors, fontSizes } = useTheme();
  const { courses: coursesPreferences } =
    usePreferencesContext<AppPreferences>();
  const coursePreferences = coursesPreferences[exam.courseId];
  const day = formatExamDay(exam.examStartsAt, t);
  const places = formatExamPlaces(exam.places);

  return (
    <ListItem
      title={exam.courseName}
      subtitle={
        <Row gap={3} pt={1} align="center">
          <Row gap={1} align="center">
            <Icon
              icon={faCalendar}
              size={fontSizes.sm}
              color={colors.secondaryText}
            />
            <Text variant="secondaryText">{day}</Text>
          </Row>
          {places.length > 0 && (
            <Row gap={1} align="center" style={styles.places}>
              <Icon
                icon={faLocationDot}
                size={fontSizes.sm}
                color={colors.secondaryText}
              />
              <Text
                variant="secondaryText"
                numberOfLines={1}
                style={styles.places}
              >
                {places}
              </Text>
            </Row>
          )}
        </Row>
      }
      leadingItem={
        <CourseIcon
          color={coursePreferences?.color ?? exam.courseColor}
          icon={coursePreferences?.icon ?? exam.courseIcon}
        />
      }
      isAction
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={[
        exam.courseName,
        day,
        places,
        t('common.elementCount', { count: index + 1, total }),
      ]
        .filter(Boolean)
        .join(', ')}
      accessibilityHint={t('examScreen.openHint')}
    />
  );
};

const styles = StyleSheet.create({
  places: {
    flexShrink: 1,
  },
});
