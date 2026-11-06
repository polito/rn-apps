import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { faClock, faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import {
  DecorativeIcon,
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

import { DateTime } from 'luxon';

import { SectionHeaderLink } from '../../core/components/SectionHeaderLink';
import { Lesson } from '../../core/contexts/CoursesContext';

type Props = {
  lessons: Lesson[];
};

const getLessonStart = (lesson: Lesson) => {
  const [startTime] = lesson.time?.split('-') ?? [];
  const date = DateTime.fromISO(lesson.date);
  if (!date.isValid) return undefined;
  if (!startTime) return date;
  const time = DateTime.fromFormat(startTime.trim(), 'HH:mm');
  return time.isValid
    ? date.set({ hour: time.hour, minute: time.minute })
    : date;
};

export const CourseNextLecture = ({ lessons }: Props) => {
  const { t, i18n } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { colors, fontSizes } = useTheme();
  const navigation = useNavigation<any>();

  const nextLecture = useMemo(() => {
    const now = DateTime.now();
    return lessons
      .map(lesson => ({ lesson, start: getLessonStart(lesson) }))
      .filter(
        (item): item is { lesson: Lesson; start: DateTime } =>
          !!item.start && item.start >= now,
      )
      .sort((a, b) => a.start.toMillis() - b.start.toMillis())[0];
  }, [lessons]);

  const title = t('courseInfoTab.nextLectureTitle');
  const showAllLabel = t('courseInfoTab.showAll');

  const weekDay = nextLecture?.start.setLocale(i18n.language).toFormat('ccc');
  const dayOfMonth = nextLecture?.start.toFormat('d');
  const timeRange = nextLecture?.lesson.time?.split('-').join(' - ');
  const room = nextLecture?.lesson.room ?? t('common.none');
  const placeId = nextLecture?.lesson.placeId;

  return (
    <Section>
      <SectionHeader
        title={title}
        linkTo="CourseRegisterScreen"
        accessibilityLabel={[title, showAllLabel].join(', ')}
        trailingItem={<SectionHeaderLink label={showAllLabel} />}
      />
      <OverviewList
        indented
        style={styles.listContainer}
        emptyStateText={t('courseInfoTab.nextLectureEmptyState')}
      >
        {nextLecture && (
          <Row style={styles.container} align="flex-start">
            <View
              style={styles.dateBox}
              accessible
              accessibilityLabel={nextLecture.start
                .setLocale(i18n.language)
                .toFormat('cccc d LLLL')}
            >
              <Text style={styles.weekDay}>{weekDay}</Text>
              <Text style={styles.dayOfMonth}>{dayOfMonth}</Text>
            </View>
            <Row style={styles.lectureCard} align="center">
              <View
                style={styles.lectureInfo}
                accessible
                accessibilityLabel={[room, timeRange]
                  .filter(Boolean)
                  .join(', ')}
              >
                <Text style={styles.room} numberOfLines={1}>
                  {room}
                </Text>
                <Row align="center" style={styles.timeRow}>
                  <DecorativeIcon
                    icon={faClock}
                    color={colors.secondaryText}
                    size={fontSizes.md}
                  />
                  <Text style={styles.time} numberOfLines={1}>
                    {timeRange}
                  </Text>
                </Row>
              </View>
              {placeId && (
                <TouchableOpacity
                  style={styles.goButton}
                  accessibilityRole="button"
                  accessibilityLabel={`${t('courseInfoTab.go')}, ${room}`}
                  accessibilityHint={t('courseInfoTab.goHint')}
                  hitSlop={6}
                  onPress={() =>
                    navigation.navigate('PlacesTeachingStack', {
                      screen: 'Place',
                      params: { placeId, isCrossNavigation: true },
                    })
                  }
                >
                  <DecorativeIcon
                    icon={faLocationArrow}
                    color={colors.white}
                    size={fontSizes.md}
                  />
                  <Text style={styles.goLabel}>{t('courseInfoTab.go')}</Text>
                </TouchableOpacity>
              )}
            </Row>
          </Row>
        )}
      </OverviewList>
    </Section>
  );
};

const createStyles = ({
  dark,
  colors,
  palettes,
  spacing,
  shapes,
  fontSizes,
  fontFamilies,
}: Theme) =>
  StyleSheet.create({
    listContainer: {
      borderRadius: shapes.lg,
      marginHorizontal: spacing[4],
      elevation: 0,
    },
    container: {
      padding: spacing[4],
      gap: spacing[4],
    },
    dateBox: {
      width: 57,
      alignItems: 'center',
      paddingTop: spacing[1],
      paddingBottom: spacing[2],
      paddingHorizontal: spacing[2],
      borderRadius: shapes.md,
      backgroundColor: colors.background,
    },
    weekDay: {
      color: colors.title,
      fontFamily: 'Montserrat-Medium',
      fontSize: fontSizes.md,
      lineHeight: 24,
    },
    dayOfMonth: {
      color: colors.title,
      fontFamily: fontFamilies.heading,
      fontSize: fontSizes.md,
      lineHeight: 20,
    },
    lectureCard: {
      flex: 1,
      minWidth: 0,
      gap: spacing[1.5],
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
      borderRadius: shapes.md,
      backgroundColor: dark ? palettes.primary[600] : palettes.info[100],
    },
    lectureInfo: {
      flex: 1,
      minWidth: 0,
      gap: spacing[1],
    },
    room: {
      color: colors.prose,
      fontFamily: fontFamilies.heading,
      fontSize: fontSizes.sm,
      lineHeight: 20,
    },
    timeRow: {
      gap: spacing[1.5],
    },
    time: {
      flexShrink: 1,
      color: colors.secondaryText,
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.sm,
      lineHeight: 20,
    },
    goButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[2],
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
      minHeight: 36,
      borderRadius: shapes.lg,
      backgroundColor: palettes.primary[500],
    },
    goLabel: {
      color: colors.white,
      fontFamily: 'Montserrat-SemiBold',
      fontSize: fontSizes.sm,
      lineHeight: 20,
    },
  });
