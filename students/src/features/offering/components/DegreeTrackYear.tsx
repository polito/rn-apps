import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { useOfflineDisabled } from '@polito/lib/core';
import {
  ListItem,
  OverviewList,
  Text,
  Theme,
  useStylesheet,
} from '@polito/lib/ui';

import {
  getTracksCoursesGrouped,
  getTracksCoursesWithoutGroup,
} from '../../../utils/offerings';
import { useDegreeContext } from '../contexts/DegreeContext';
import { OfferingCourseYear } from '../screens/DegreeTracksScreen';
import { CourseTrailingItem } from './CourseTrailingItem';
import { GroupCourses } from './GroupCourses';

interface DegreeTrackYearProps {
  item: OfferingCourseYear;
}

export const DegreeTrackYear = ({ item }: DegreeTrackYearProps) => {
  const { teachingYear, data: courses } = item;
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const firstLevelCourses = getTracksCoursesWithoutGroup(courses);
  const coursesByGroup = useMemo(
    () => getTracksCoursesGrouped(courses),
    [courses],
  );

  const isOffline = useOfflineDisabled();

  const { year } = useDegreeContext();

  const accessibilityYearLabel = useMemo(() => {
    const textNumber = [
      'first',
      'second',
      'third',
      'fourth',
      'fifth',
      'sixth',
      'seventh',
      'eighth',
      'ninth',
      'tenth',
    ];
    if (teachingYear >= 1 && teachingYear <= 10) {
      const yearText = t(`common.${textNumber[teachingYear - 1]}`);
      const yearWord = t('common.year');
      return `${yearText} ${yearWord}`;
    }
    return `${year}° ${t('common.year')}`;
  }, [t, teachingYear, year]);

  const [expandedGroupIndex, setExpandedGroupIndex] = useState<number>();
  return (
    <View style={styles.trackSectionContainer}>
      <Text
        accessible={true}
        accessibilityRole="none"
        accessibilityLabel={accessibilityYearLabel}
        variant="subHeading"
        style={styles.subHeading}
      >
        {teachingYear}° {t('common.year')}
      </Text>
      <View
        accessibilityRole="list"
        accessibilityLabel={t('common.listWithCount', {
          name: accessibilityYearLabel,
          count: firstLevelCourses.length + coursesByGroup.length,
        })}
      >
        <OverviewList rounded={true} style={styles.firstLevelOverviewList}>
          {firstLevelCourses.map((course, index) => (
            <ListItem
              accessible={true}
              accessibilityLabel={[
                course.name,
                course.cfu,
                t('common.cfu'),
              ].join(', ')}
              title={course.name}
              titleProps={{ numberOfLines: undefined }}
              key={`${course.teachingYear.toString()}-${
                course.shortcode
              }-${index}`}
              style={styles.listItem}
              containerStyle={styles.listItemContainer}
              linkTo={{
                screen: 'DegreeCourse',
                params: {
                  courseShortcode: course.shortcode,
                  teachingYear: year,
                },
              }}
              accessibilityRole="button"
              accessibilityHint={t('common.tapToNavigate')}
              trailingItem={<CourseTrailingItem cfu={course.cfu} />}
              disabled={isOffline}
              accessibilityState={{ disabled: isOffline }}
            />
          ))}
          {coursesByGroup.map((group, index) => (
            <GroupCourses
              key={index}
              group={group}
              isExpanded={expandedGroupIndex === index}
              toggleExpand={() =>
                setExpandedGroupIndex(prevIndex =>
                  prevIndex !== index ? index : undefined,
                )
              }
              disabled={isOffline}
            />
          ))}
        </OverviewList>
      </View>
    </View>
  );
};

const createStyles = ({ spacing, colors, palettes, dark }: Theme) =>
  StyleSheet.create({
    firstLevelOverviewList: {
      marginHorizontal: spacing[4],
      elevation: 0,
    },
    icon: {
      marginRight: -spacing[1],
    },
    subHeading: {
      color: dark ? palettes.info['400'] : palettes.info['700'],
      marginBottom: spacing[2],
      marginHorizontal: spacing[4],
      textTransform: 'none',
    },
    trackSectionContainer: {
      marginTop: spacing[2],
    },
    list: {
      marginHorizontal: spacing[4],
    },
    listItem: {
      backgroundColor: dark ? colors.surfaceDark : palettes.gray['100'],
    },
    listItemContainer: {
      minHeight: 45,
    },
  });
