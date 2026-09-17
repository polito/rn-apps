import { Fragment, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {
  faChevronDown,
  faCircleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { useOfflineDisabled } from '@polito/lib/core';
import {
  BottomBarSpacer,
  Card,
  Icon,
  IndentedDivider,
  ListItem,
  OverviewList,
  Section,
  SectionHeader,
  Text,
  Theme,
  auto,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useGetCourses } from '~/core/queries/courseHooks';

import { TeachingStackParamList } from '../../teaching/components/TeachingNavigator';
import { CourseHeading } from '../components/CourseHeading';
import { formatAcademicYear } from '../utils/courses';

type Props = NativeStackScreenProps<
  TeachingStackParamList,
  'CourseNoAssignment'
>;

export const CourseNoAssignmentScreen = ({ route }: Props) => {
  const {
    uniqueShortcode,
    courseName,
    shortcode,
    cfu,
    year,
    parentCourseName,
  } = route.params;
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { colors, fontSizes, spacing, palettes, dark } = useTheme();
  const coursesQuery = useGetCourses();
  const [isExpanded, setIsExpanded] = useState(false);
  const expanded = useSharedValue(false);

  const animatedList = useAnimatedStyle(() => ({
    transform: [
      { scaleY: withTiming(expanded.value ? 1 : 0, { duration: 100 }) },
    ],
    height: withTiming(expanded.value ? auto : 0, { duration: 50 }),
  }));

  const animatedChevron = useAnimatedStyle(() => ({
    transform: [{ rotateX: withTiming(expanded.value ? '180deg' : '0deg') }],
  }));

  const course = useMemo(() => {
    for (const c of coursesQuery.data ?? []) {
      if (c.uniqueShortcode === uniqueShortcode) return c;
      const module = c.modules?.find(
        (_, index) => `${c.shortcode}${index + 1}` === uniqueShortcode,
      );
      if (module) return module;
    }
    return undefined;
  }, [coursesQuery.data, uniqueShortcode]);

  const editions = useMemo(
    () =>
      (course?.previousEditions ?? [])
        .filter(edition => edition.id !== null)
        .sort((a, b) => +b.year - +a.year),
    [course],
  );

  const hasPreviousEditions = editions.length > 0;
  const latestEditionId = editions[0]?.id;
  const isOffline = useOfflineDisabled();

  const toggleEditions = () => {
    expanded.value = !expanded.value;
    setIsExpanded(value => !value);
  };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <CourseHeading
        name={courseName}
        shortcode={shortcode}
        cfu={cfu}
        parentCourseName={parentCourseName}
      />
      <Section>
        <Card style={styles.card}>
          <Icon
            icon={faCircleExclamation}
            size={fontSizes['5xl']}
            color={colors.secondaryText}
          />
          <View style={styles.textBlock}>
            <Text
              variant="prose"
              weight="semibold"
              style={[styles.emptyStateText, styles.emptyStateTitle]}
            >
              {t('courseNoAssignmentScreen.title')}
            </Text>
            <Text variant="prose" style={styles.emptyStateText}>
              {t('courseNoAssignmentScreen.message', {
                year: formatAcademicYear(year ?? course?.year),
                interpolation: { escapeValue: false },
              })}
              {hasPreviousEditions &&
                `\n${t('courseNoAssignmentScreen.messagePreviousEditions')}`}
            </Text>
          </View>
          {hasPreviousEditions && (
            <View style={styles.editions}>
              <ListItem
                title={t('courseNoAssignmentScreen.previousEditions')}
                subtitle={t(
                  'courseNoAssignmentScreen.previousEditionsSubtitle',
                )}
                onPress={toggleEditions}
                accessibilityRole="button"
                accessibilityState={{ expanded: isExpanded }}
                trailingItem={
                  <Animated.View style={animatedChevron}>
                    <Icon
                      icon={faChevronDown}
                      color={dark ? palettes.gray[400] : colors.secondaryText}
                    />
                  </Animated.View>
                }
              />
              <Animated.View style={[animatedList, styles.editionsList]}>
                {editions.map((edition, index) => (
                  <Fragment key={edition.id}>
                    <ListItem
                      title={
                        edition.name
                          ? `${formatAcademicYear(edition.year)} - ${edition.name}`
                          : formatAcademicYear(edition.year)
                      }
                      linkTo={{
                        screen: 'Course',
                        params: {
                          id: +edition.id,
                          title: courseName,
                          uniqueShortcode,
                          lockEdition: true,
                        },
                      }}
                    />
                    {index < editions.length - 1 && (
                      <IndentedDivider indent={spacing[4]} />
                    )}
                  </Fragment>
                ))}
              </Animated.View>
            </View>
          )}
        </Card>
      </Section>
      <Section>
        <SectionHeader title={t('courseInfoTab.moreSectionTitle')} />
        <OverviewList>
          <ListItem
            title={t('courseGuideScreen.title')}
            linkTo={
              latestEditionId
                ? {
                    screen: 'CourseGuide',
                    params: { courseId: +latestEditionId },
                  }
                : {
                    screen: 'DegreeCourseGuide',
                    params: { courseShortcode: shortcode },
                  }
            }
            disabled={isOffline}
          />
        </OverviewList>
      </Section>
      <BottomBarSpacer />
    </ScrollView>
  );
};

const createStyles = ({
  spacing,
  colors,
  palettes,
  dark,
  fontSizes,
  fontFamilies,
}: Theme) =>
  StyleSheet.create({
    card: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: spacing[3],
      padding: spacing[3],
      marginHorizontal: spacing[3],
    },
    textBlock: {
      alignSelf: 'stretch',
      gap: spacing[1],
    },
    emptyStateText: {
      color: colors.secondaryText,
      textAlign: 'center',
      fontSize: fontSizes.md,
      lineHeight: fontSizes.md * 1.5,
    },
    emptyStateTitle: {
      fontFamily: fontFamilies.heading,
    },
    editions: {
      alignSelf: 'stretch',
      marginTop: spacing[2],
    },
    editionsList: {
      overflow: 'hidden',
      borderRadius: spacing[2],
      backgroundColor: dark ? colors.background : palettes.gray[100],
    },
  });
