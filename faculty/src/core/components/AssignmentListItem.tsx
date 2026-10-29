import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, View } from 'react-native';

import { faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  DisclosureIndicator,
  IconButton,
  ListItem,
  Row,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Assignment, useCourses } from '../../core/contexts/CoursesContext';
import { TeachingStackParamList } from '../../screens/Teaching/TeachingNavigator';

interface Props {
  assignment: Assignment;
}

export const AssignmentListItem = ({ assignment }: Props) => {
  const styles = useStylesheet(createItemStyles);
  const { dark, fontSizes, palettes } = useTheme();
  const { selectedCourse, removeAssignmentFromCourse } = useCourses();
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<TeachingStackParamList>>();

  if (selectedCourse == null) return null;

  const fileName = `${assignment.name}.${assignment.mimeType}`;
  const removalRequested = !!assignment.removalRequested;
  const dangerColor = dark ? palettes.danger[400] : palettes.danger[600];
  const subtitle = removalRequested
    ? t('assignmentListItem.removalRequested')
    : [assignment.student, assignment.studentName].filter(Boolean).join(' - ');

  const confirmDelete = () => {
    Alert.alert(t('other.confirm'), t('other.alertAssignment'), [
      { text: t('common.no'), style: 'cancel' },
      {
        text: t('common.yes'),
        style: 'destructive',
        onPress: () =>
          removeAssignmentFromCourse(selectedCourse.id, assignment.id),
      },
    ]);
  };

  const accessibilityLabel = [
    assignment.unread ? t('assignmentListItem.unread') : undefined,
    fileName,
    subtitle,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <ListItem
      title={
        <Row align="center" gap={1}>
          {assignment.unread && (
            <View
              style={[styles.unreadDot, { backgroundColor: dangerColor }]}
            />
          )}
          <Text style={styles.title} numberOfLines={1}>
            {fileName}
          </Text>
        </Row>
      }
      subtitle={subtitle}
      subtitleStyle={removalRequested ? { color: dangerColor } : undefined}
      trailingItem={
        removalRequested ? (
          <IconButton
            icon={faTrash}
            color={dangerColor}
            size={fontSizes.xl}
            adjustSpacing="right"
            accessibilityLabel={t('other.delete')}
            onPress={confirmDelete}
          />
        ) : (
          <DisclosureIndicator />
        )
      }
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={t('assignmentListItem.openHint')}
      accessibilityActions={
        removalRequested
          ? [{ name: 'delete', label: t('other.delete') }]
          : undefined
      }
      onAccessibilityAction={event => {
        if (event.nativeEvent.actionName === 'delete') confirmDelete();
      }}
      onPress={() =>
        navigation.navigate('Assignment', { assignmentId: assignment.id })
      }
    />
  );
};

const createItemStyles = ({ colors, fontFamilies, fontSizes }: Theme) =>
  StyleSheet.create({
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    title: {
      flexShrink: 1,
      color: colors.prose,
      fontFamily: fontFamilies.title,
      fontSize: fontSizes.md,
      lineHeight: fontSizes.md * 1.5,
    },
  });
