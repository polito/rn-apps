import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

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

import { formatGrade } from '../../../utils/grades';

type RecordedGradeProps = {
  grade: ExamGrade;
};

export const RecordedGradeListItem = ({ grade }: RecordedGradeProps) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);

  return (
    <ListItem
      key={grade.courseName}
      title={grade.courseName}
      subtitle={`${formatDate(grade.date)} - ${t('common.creditsWithUnit', {
        credits: grade.credits,
      })}`}
      trailingItem={
        <Row align="center" pl={2}>
          <Text
            variant="title"
            style={styles.grade}
            accessibilityLabel={`${t('common.grade')}: ${grade?.grade}`}
          >
            {t(formatGrade(grade.grade))}
          </Text>
          <DisclosureIndicator />
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
