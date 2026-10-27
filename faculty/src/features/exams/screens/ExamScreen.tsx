import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';

import {
  faClipboardCheck,
  faHourglassHalf,
  faInbox,
  faLocationDot,
  faPlus,
  faSpinner,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { formatDate } from '@polito/lib/core';
import {
  BottomBarSpacer,
  CtaButton,
  CtaButtonSpacer,
  EmptyState,
  Icon,
  ListItem,
  OverviewList,
  Row,
  ScreenDateTime,
  ScreenTitle,
  Text,
  Theme,
  useSafeBottomBarHeight,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ExamStatusBadge } from '../components/ExamStatusBadge';
import { useExam } from '../contexts/ExamsContext';
import { ExamsStackParamList } from '../navigation/ExamsScreens';
import {
  formatExamDay,
  formatExamPlaces,
  formatExamTimeRange,
} from '../utils/exam';

type Props = NativeStackScreenProps<ExamsStackParamList, 'Exam'>;

export const ExamScreen = ({ navigation, route }: Props) => {
  const { id } = route.params;
  const { t } = useTranslation();
  const { colors, fontSizes } = useTheme();
  const styles = useStylesheet(createStyles);
  const bottomBarHeight = useSafeBottomBarHeight();
  const { exam, courseStudents } = useExam(id);

  if (!exam) {
    return <EmptyState icon={faInbox} message={t('examScreen.notFound')} />;
  }

  const day = formatExamDay(exam.examStartsAt, t);
  const timeRange = formatExamTimeRange(exam.examStartsAt, exam.examEndsAt);
  const bookingEndsAt = formatDate(exam.bookingEndsAt);
  const places = formatExamPlaces(exam.places);
  const enrolledCount = t('examScreen.enrolledOfTotal', {
    enrolled: exam.bookedStudentIds.length,
    total: courseStudents.length,
  });
  const bookingStatus = t(`examScreen.bookingStatuses.${exam.bookingStatus}`);

  const leadingIcon = (icon: typeof faUsers) => (
    <Icon icon={icon} size={fontSizes['2xl']} color={colors.prose} />
  );

  return (
    <>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.heading}>
          <ScreenTitle title={exam.courseName} />
          <Text style={styles.type}>{exam.type}</Text>
          <ScreenDateTime
            accessible
            accessibilityLabel={`${day}, ${t('common.time')} ${timeRange}`}
            date={day}
            time={timeRange}
          />
        </View>
        <OverviewList indented>
          <ListItem
            leadingItem={leadingIcon(faSpinner)}
            title={t('examScreen.bookingStatus')}
            trailingItem={
              <ExamStatusBadge
                text={bookingStatus}
                tone={exam.bookingStatus === 'bookable' ? 'primary' : 'danger'}
              />
            }
            accessibilityLabel={`${t('examScreen.bookingStatus')}, ${bookingStatus}`}
          />
          <ListItem
            leadingItem={leadingIcon(faUsers)}
            title={t('examScreen.enrolledStudents')}
            subtitle={enrolledCount}
            isAction
            onPress={() =>
              navigation.navigate('ExamEnrolledStudents', { id: exam.id })
            }
            accessibilityRole="button"
            accessibilityLabel={`${t('examScreen.enrolledStudents')}, ${enrolledCount}`}
            accessibilityHint={t('examScreen.enrolledStudentsHint')}
          />
          <ListItem
            leadingItem={leadingIcon(faHourglassHalf)}
            title={bookingEndsAt}
            subtitle={t('examScreen.reservationBy')}
            inverted
            accessibilityLabel={`${t('examScreen.reservationBy')} ${bookingEndsAt}`}
          />
          <ListItem
            leadingItem={leadingIcon(faLocationDot)}
            title={places}
            subtitle={t('examScreen.openPlaces')}
            isAction
            onPress={() => navigation.getParent()?.navigate('Places')}
            accessibilityRole="button"
            accessibilityLabel={places}
            accessibilityHint={t('examScreen.openPlacesHint')}
          />
        </OverviewList>
        <CtaButtonSpacer />
        <BottomBarSpacer />
      </ScrollView>
      <Row gap={3} style={[styles.ctaRow, { bottom: bottomBarHeight }]}>
        <CtaButton
          absolute={false}
          variant="outlined"
          title={t('examScreen.addStudents')}
          icon={faPlus}
          accessibilityHint={t('examScreen.addStudentsHint')}
          action={() => navigation.navigate('ExamAddStudents', { id: exam.id })}
          containerStyle={styles.cta}
        />
        <CtaButton
          absolute={false}
          title={t('examScreen.checkAttendance')}
          icon={faClipboardCheck}
          accessibilityHint={t('examScreen.checkAttendanceHint')}
          action={() => navigation.navigate('ExamAttendance', { id: exam.id })}
          containerStyle={styles.cta}
        />
      </Row>
    </>
  );
};

const createStyles = ({ fontSizes, spacing }: Theme) =>
  StyleSheet.create({
    heading: {
      padding: spacing[5],
      gap: spacing[2],
    },
    type: {
      fontSize: fontSizes.lg,
    },
    ctaRow: {
      position: 'absolute',
      left: 0,
      right: 0,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[4],
    },
    cta: {
      flex: 1,
      padding: 0,
    },
  });
