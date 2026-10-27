import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { faHandHoldingHeart, faUser } from '@fortawesome/free-solid-svg-icons';
import { HighlightedText } from '@polito/lib/features/people';
import {
  Col,
  Icon,
  Row,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';

import { ExamStudent } from '../types/exams';
import { getStudentFullName } from '../utils/students';

type Props = {
  student: ExamStudent;
  isAbsent: boolean;
  highlight: string;
  index: number;
  total: number;
  onChange: (studentId: string, isAbsent: boolean) => void;
};

export const ExamAttendanceCard = ({
  student,
  isAbsent,
  highlight,
  index,
  total,
  onChange,
}: Props) => {
  const { t } = useTranslation();
  const { palettes } = useTheme();
  const styles = useStylesheet(createStyles);
  const fullName = getStudentFullName(student);

  const options = [
    { key: 'present', absent: false, label: t('examAttendanceScreen.present') },
    { key: 'absent', absent: true, label: t('examAttendanceScreen.absent') },
  ];

  return (
    <Row style={styles.container} gap={3}>
      <View
        style={styles.photo}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <Icon icon={faUser} size={40} color={styles.photoIcon.color} />
      </View>
      <Col flex={1} gap={1}>
        <Row
          align="flex-start"
          gap={2}
          accessible
          accessibilityLabel={[
            fullName,
            `${t('examAttendanceScreen.studentId')} ${student.id}`,
            `${t('examAttendanceScreen.course')} ${student.courseCode}`,
            student.hasSpecialNeeds
              ? t('examStudentsList.filters.specialNeeds')
              : undefined,
            t('common.elementCount', { count: index + 1, total }),
          ]
            .filter(Boolean)
            .join(', ')}
        >
          <Col flex={1} gap={1}>
            <HighlightedText
              text={fullName}
              highlight={highlight}
              highlightColor={palettes.primary[500]}
            />
            <Text variant="secondaryText">
              {t('examAttendanceScreen.studentId')}{' '}
              <Text weight="semibold">{student.id}</Text>
            </Text>
            <Text variant="secondaryText">
              {t('examAttendanceScreen.course')}{' '}
              <Text weight="semibold">{student.courseCode}</Text>
            </Text>
          </Col>
          {student.hasSpecialNeeds && (
            <View style={styles.specialNeeds}>
              <Icon
                icon={faHandHoldingHeart}
                size={14}
                color={styles.specialNeedsIcon.color}
              />
            </View>
          )}
        </Row>
        <View
          style={styles.segmented}
          accessibilityRole="radiogroup"
          accessibilityLabel={t('examAttendanceScreen.attendanceOf', {
            name: fullName,
          })}
        >
          {options.map(option => {
            const selected = option.absent === isAbsent;
            return (
              <Pressable
                key={option.key}
                onPress={() => onChange(student.id, option.absent)}
                style={[
                  styles.segment,
                  selected &&
                    (option.absent
                      ? styles.absentSelected
                      : styles.presentSelected),
                ]}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                accessibilityLabel={`${option.label}, ${fullName}`}
              >
                <Text
                  weight={selected ? 'semibold' : 'normal'}
                  style={selected ? styles.selectedText : styles.segmentText}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Col>
    </Row>
  );
};

const createStyles = ({ colors, dark, palettes, spacing, shapes }: Theme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: spacing[2],
      paddingVertical: spacing[3],
    },
    photo: {
      width: 100,
      height: 105,
      borderRadius: shapes.md,
      backgroundColor: dark ? palettes.gray[700] : palettes.gray[200],
      alignItems: 'center',
      justifyContent: 'center',
    },
    photoIcon: {
      color: dark ? palettes.gray[400] : palettes.gray[500],
    },
    specialNeeds: {
      width: 26,
      height: 26,
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: dark ? palettes.purple[800] : palettes.purple[100],
    },
    specialNeedsIcon: {
      color: dark ? palettes.purple[200] : palettes.purple[600],
    },
    segmented: {
      flexDirection: 'row',
      alignSelf: 'flex-end',
      marginTop: spacing[1],
      padding: spacing[0.5],
      borderRadius: shapes.sm,
      backgroundColor: dark ? palettes.gray[700] : palettes.gray[200],
    },
    segment: {
      minHeight: 32,
      justifyContent: 'center',
      paddingHorizontal: spacing[2],
      borderRadius: shapes.sm,
    },
    presentSelected: {
      backgroundColor: palettes.success[700],
    },
    absentSelected: {
      backgroundColor: palettes.danger[700],
    },
    selectedText: {
      color: colors.white,
    },
    segmentText: {
      color: colors.secondaryText,
    },
  });
