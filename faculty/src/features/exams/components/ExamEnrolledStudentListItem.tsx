import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';

import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { HighlightedText } from '@polito/lib/features/people';
import { Icon, IconButton, ListItem, useTheme } from '@polito/lib/ui';

import { ExamStudent } from '../types/exams';
import { getStudentFullName } from '../utils/students';

type Props = {
  student: ExamStudent;
  highlight: string;
  index: number;
  total: number;
};

const STUDENT_EMAIL_DOMAIN = 'studenti.polito.it';

export const ExamEnrolledStudentListItem = ({
  student,
  highlight,
  index,
  total,
}: Props) => {
  const { t } = useTranslation();
  const { colors, fontSizes, palettes } = useTheme();
  const fullName = getStudentFullName(student);
  const tag = student.isGraduating
    ? t('examEnrolledStudentsScreen.graduating')
    : student.hasExtraTime
      ? t('examEnrolledStudentsScreen.extraTime')
      : undefined;
  const subtitle = [student.id, tag].filter(Boolean).join(' - ');
  const contactLabel = t('examEnrolledStudentsScreen.contact', {
    name: fullName,
  });
  const contact = () =>
    Linking.openURL(`mailto:${student.id}@${STUDENT_EMAIL_DOMAIN}`);

  return (
    <ListItem
      leadingItem={
        <Icon
          icon={faCircleUser}
          size={fontSizes['2xl']}
          color={colors.prose}
        />
      }
      title={
        <HighlightedText
          text={fullName}
          highlight={highlight}
          highlightColor={palettes.primary[500]}
        />
      }
      subtitle={subtitle}
      trailingItem={
        <IconButton
          icon={faEnvelope}
          color={colors.secondaryText}
          size={fontSizes.lg}
          onPress={contact}
          accessibilityRole="button"
          accessibilityLabel={contactLabel}
        />
      }
      accessibilityLabel={[
        fullName,
        subtitle,
        t('common.elementCount', { count: index + 1, total }),
      ].join(', ')}
      accessibilityHint={t('examEnrolledStudentsScreen.contactActionHint')}
      accessibilityActions={[{ name: 'contact', label: contactLabel }]}
      onAccessibilityAction={event => {
        if (event.nativeEvent.actionName === 'contact') {
          contact();
        }
      }}
    />
  );
};
