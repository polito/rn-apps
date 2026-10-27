import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import {
  Icon,
  Row,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';

import { ExamStudent } from '../types/exams';

type Props = {
  students: ExamStudent[];
};

export const ExamEnrolledSummary = ({ students }: Props) => {
  const { t } = useTranslation();
  const { colors, fontSizes } = useTheme();
  const styles = useStylesheet(createStyles);
  const [expanded, setExpanded] = useState(true);

  const rows = [
    {
      key: 'attendanceDebt',
      value: students.filter(student => student.hasAttendanceDebt).length,
    },
    {
      key: 'firstAttendance',
      value: students.filter(student => student.isFirstAttendance).length,
    },
    {
      key: 'extraTime',
      value: students.filter(student => student.hasExtraTime).length,
    },
    {
      key: 'graduating',
      value: students.filter(student => student.isGraduating).length,
    },
  ];

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => setExpanded(prev => !prev)}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={`${t('examEnrolledStudentsScreen.total')} ${students.length}`}
        accessibilityHint={t(
          expanded
            ? 'examEnrolledStudentsScreen.collapseHint'
            : 'examEnrolledStudentsScreen.expandHint',
        )}
      >
        <Row align="center" justify="space-between">
          <Text weight="semibold">
            {t('examEnrolledStudentsScreen.total')}{' '}
            <Text weight="bold">{students.length}</Text>
          </Text>
          <Icon
            icon={expanded ? faChevronUp : faChevronDown}
            size={fontSizes.md}
            color={colors.prose}
          />
        </Row>
      </Pressable>
      {expanded &&
        rows.map(row => (
          <Row
            key={row.key}
            justify="space-between"
            style={styles.row}
            accessible
            accessibilityLabel={`${t(`examEnrolledStudentsScreen.summary.${row.key}`)}, ${row.value}`}
          >
            <Text variant="secondaryText">
              {t(`examEnrolledStudentsScreen.summary.${row.key}`)}
            </Text>
            <Text weight="semibold">{row.value}</Text>
          </Row>
        ))}
    </View>
  );
};

const createStyles = ({ dark, palettes, spacing, shapes }: Theme) =>
  StyleSheet.create({
    container: {
      marginHorizontal: spacing[4],
      padding: spacing[3],
      borderRadius: shapes.lg,
      borderWidth: 1,
      borderColor: dark ? palettes.primary[700] : palettes.primary[200],
      backgroundColor: dark ? palettes.primary[900] : palettes.primary[50],
    },
    row: {
      marginTop: spacing[2],
    },
  });
