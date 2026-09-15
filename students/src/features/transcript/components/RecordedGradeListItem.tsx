import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { formatDate } from '@polito/lib/core';
import {
  DisclosureIndicator,
  ListItem,
  Row,
  Text,
  type Theme,
  useStylesheet,
} from '@polito/lib/ui';
import { ExamGrade } from '@polito/student-api-client';

import { hideFromScreenReader } from '../../../core/accessibility/hideFromScreenReader';
import { useAccessibility } from '../../../core/hooks/useAccessibilty';
import { formatGrade } from '../../../utils/grades';

type RecordedGradeProps = {
  grade: ExamGrade;
  index: number;
  total: number;
};

export const RecordedGradeListItem = ({
  grade,
  index,
  total,
}: RecordedGradeProps) => {
  const { t } = useTranslation();
  const { buildCompositeListLabel } = useAccessibility();
  const styles = useStylesheet(createStyles);

  const formattedGrade = t(formatGrade(grade.grade));
  const dateLabel = formatDate(grade.date);
  const creditsLabel = t('common.creditsWithUnit', { credits: grade.credits });

  const accessibilityLabel = useMemo(
    () =>
      buildCompositeListLabel(
        [
          t('transcriptGradesScreen.recordedGradeItem', {
            courseName: grade.courseName,
            date: dateLabel,
            credits: creditsLabel,
            grade: formattedGrade,
          }),
        ],
        index,
        total,
      ),
    [
      buildCompositeListLabel,
      grade.courseName,
      dateLabel,
      creditsLabel,
      formattedGrade,
      index,
      total,
      t,
    ],
  );

  return (
    <ListItem
      title={grade.courseName}
      subtitle={`${dateLabel} - ${creditsLabel}`}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={t('common.tapToNavigate')}
      trailingItem={
        <Row align="center" pl={2}>
          <View {...hideFromScreenReader}>
            <Text variant="title" style={styles.grade}>
              {formattedGrade}
            </Text>
          </View>
          <View {...hideFromScreenReader}>
            <DisclosureIndicator />
          </View>
        </Row>
      }
      linkTo={{
        screen: 'RecordedGrade',
        params: {
          grade: {
            ...grade,
            date: grade.date.toISOString(),
          },
        },
      }}
    />
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    grade: {
      marginLeft: spacing[2],
    },
  });
