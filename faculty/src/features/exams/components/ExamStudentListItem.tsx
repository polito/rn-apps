import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { faSquare } from '@fortawesome/free-regular-svg-icons';
import {
  faMinus,
  faPlus,
  faSquareCheck,
} from '@fortawesome/free-solid-svg-icons';
import { HighlightedText } from '@polito/lib/features/people';
import { Icon, ListItem, Theme, useStylesheet, useTheme } from '@polito/lib/ui';

import { ExamStudent } from '../types/exams';
import { getStudentFullName } from '../utils/students';

type Variant = 'checkbox' | 'add';

type Props = {
  student: ExamStudent;
  variant: Variant;
  selected: boolean;
  highlight: string;
  index: number;
  total: number;
  onToggle: (studentId: string) => void;
};

export const ExamStudentListItem = ({
  student,
  variant,
  selected,
  highlight,
  index,
  total,
  onToggle,
}: Props) => {
  const { t } = useTranslation();
  const { colors, fontSizes, palettes } = useTheme();
  const styles = useStylesheet(createStyles);
  const fullName = getStudentFullName(student);

  const trailingIcon =
    variant === 'add'
      ? selected
        ? faMinus
        : faPlus
      : selected
        ? faSquareCheck
        : faSquare;

  return (
    <ListItem
      title={
        <HighlightedText
          text={fullName}
          highlight={highlight}
          highlightColor={palettes.primary[500]}
        />
      }
      subtitle={student.id}
      trailingItem={
        <View style={styles.trailing}>
          <Icon
            icon={trailingIcon}
            size={fontSizes.lg}
            color={colors.secondaryText}
          />
        </View>
      }
      onPress={() => onToggle(student.id)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={[
        fullName,
        student.id,
        t('common.elementCount', { count: index + 1, total }),
      ].join(', ')}
      accessibilityHint={t(
        variant === 'add'
          ? selected
            ? 'examAddStudentsScreen.removeHint'
            : 'examAddStudentsScreen.addHint'
          : 'examSelectStudentsScreen.toggleHint',
      )}
    />
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    trailing: {
      minWidth: spacing[6],
      alignItems: 'center',
    },
  });
