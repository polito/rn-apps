import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AccessibilityInfo,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import {
  faCalendar,
  faCircleUser,
  faFile,
} from '@fortawesome/free-regular-svg-icons';
import {
  faComment,
  faDownload,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { formatDateFromString } from '@polito/lib/core';
import {
  BottomModal,
  CtaButton,
  CtaButtonContainer,
  CtaButtonSpacer,
  EmptyState,
  Icon,
  ListItem,
  OverviewList,
  Row,
  Section,
  SectionHeader,
  Text,
  Theme,
  useBottomModal,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useCourses } from '../../core/contexts/CoursesContext';
import { TeachingStackParamList } from './TeachingNavigator';

type Props = NativeStackScreenProps<TeachingStackParamList, 'Assignment'>;

type AnswerModalContentProps = {
  fileName: string;
  close: () => void;
  onSend: (answer: string) => void;
};

const AnswerModalContent = ({
  fileName,
  close,
  onSend,
}: AnswerModalContentProps) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { colors } = useTheme();
  const [answer, setAnswer] = useState('');
  const [focused, setFocused] = useState(false);
  const canSend = answer.trim().length > 0;

  return (
    <View style={styles.modal}>
      <View style={styles.modalHeader}>
        <Pressable
          onPress={close}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={t('common.close')}
        >
          <Text style={styles.modalClose}>{t('common.close')}</Text>
        </Pressable>
      </View>
      <View style={styles.modalBody}>
        <Text style={styles.modalTitle} accessibilityRole="header">
          {fileName}
        </Text>
        <View
          style={[styles.answerCard, focused && { borderColor: colors.link }]}
        >
          <Text style={styles.answerLabel} importantForAccessibility="no">
            {t('assignmentScreen.answerLabel')}
          </Text>
          <TextInput
            value={answer}
            onChangeText={setAnswer}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            multiline
            autoCapitalize="sentences"
            placeholder={t('assignmentScreen.answerPlaceholder')}
            placeholderTextColor={colors.secondaryText}
            selectionColor={colors.link}
            style={styles.answerInput}
            accessibilityLabel={t('assignmentScreen.answerLabel')}
            accessibilityHint={t('assignmentScreen.answerHint')}
          />
        </View>
      </View>
      <CtaButton
        absolute={false}
        title={t('assignmentScreen.sendAnswer')}
        icon={faComment}
        disabled={!canSend}
        accessibilityState={{ disabled: !canSend }}
        accessibilityHint={
          canSend ? undefined : t('assignmentScreen.sendAnswerDisabledHint')
        }
        action={() => onSend(answer.trim())}
      />
    </View>
  );
};

export const AssignmentScreen = ({ navigation, route }: Props) => {
  const { assignmentId } = route.params;
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { colors, fontSizes } = useTheme();
  const { selectedCourse, removeAssignmentFromCourse } = useCourses();
  const {
    modal: bottomModal,
    open: showBottomModal,
    close: closeBottomModal,
  } = useBottomModal();

  const assignment = selectedCourse?.assignments.find(
    item => item.id === assignmentId,
  );

  if (!selectedCourse || !assignment) {
    return (
      <EmptyState icon={faFile} message={t('assignmentScreen.notFound')} />
    );
  }

  const formattedDate = formatDateFromString(assignment.date);
  const fileName = `${assignment.name}.${assignment.mimeType}`;
  const studentLabel = assignment.studentName ?? assignment.student;

  const deleteAssignment = () => {
    Alert.alert(t('other.confirm'), t('other.alertAssignment'), [
      { text: t('common.no'), style: 'cancel' },
      {
        text: t('common.yes'),
        style: 'destructive',
        onPress: () => {
          removeAssignmentFromCourse(selectedCourse.id, assignment.id);
          AccessibilityInfo.announceForAccessibility(
            t('assignmentScreen.deleted'),
          );
          navigation.goBack();
        },
      },
    ]);
  };

  const openAnswer = () => {
    showBottomModal(
      <AnswerModalContent
        fileName={fileName}
        close={closeBottomModal}
        onSend={() => {
          closeBottomModal();
          AccessibilityInfo.announceForAccessibility(
            t('assignmentScreen.answerSent'),
          );
        }}
      />,
    );
  };

  return (
    <>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.header}>
          <Text style={styles.title} accessibilityRole="header">
            {fileName}
          </Text>
          <View
            accessible
            accessibilityLabel={t('assignmentScreen.metaLabel', {
              date: formattedDate,
              student: studentLabel,
            })}
          >
            <Row align="center" gap={3}>
              <Row align="center" gap={1}>
                <Icon
                  icon={faCalendar}
                  size={fontSizes.md}
                  color={colors.secondaryText}
                />
                <Text style={styles.metaDate}>{formattedDate}</Text>
              </Row>
              <Row align="center" gap={1} flexShrink={1}>
                <Icon
                  icon={faCircleUser}
                  size={fontSizes.md}
                  color={colors.secondaryText}
                />
                <Text style={styles.metaStudent} numberOfLines={1}>
                  {studentLabel}
                </Text>
              </Row>
            </Row>
          </View>
        </View>

        <Section>
          <SectionHeader title={t('other.description')} />
          <Text style={styles.description}>
            {assignment.description || t('assignmentScreen.noDescription')}
          </Text>
        </Section>

        <OverviewList rounded>
          <ListItem
            title={t('assignmentScreen.downloadFile')}
            trailingItem={
              <Icon
                icon={faDownload}
                size={fontSizes.xl}
                color={colors.secondaryText}
              />
            }
            disabled
            accessibilityRole="button"
            accessibilityState={{ disabled: true }}
            accessibilityLabel={`${t('assignmentScreen.downloadFile')}, ${fileName}`}
            accessibilityHint={t('assignmentScreen.downloadUnavailableHint')}
          />
        </OverviewList>

        <CtaButtonSpacer />
      </ScrollView>

      <CtaButtonContainer absolute>
        <Row gap={2.5}>
          <CtaButton
            absolute={false}
            variant="outlined"
            destructive
            title={t('other.delete')}
            icon={faTrash}
            containerStyle={styles.ctaHalf}
            accessibilityHint={t('assignmentScreen.deleteHint')}
            action={deleteAssignment}
          />
          <CtaButton
            absolute={false}
            title={t('assignmentScreen.answer')}
            icon={faComment}
            containerStyle={styles.ctaHalf}
            accessibilityHint={t('assignmentScreen.answerButtonHint')}
            action={openAnswer}
          />
        </Row>
      </CtaButtonContainer>

      <BottomModal dismissable {...bottomModal} />
    </>
  );
};

const createStyles = ({
  colors,
  fontFamilies,
  fontSizes,
  shapes,
  spacing,
}: Theme) =>
  StyleSheet.create({
    header: {
      paddingHorizontal: spacing[5],
      paddingTop: spacing[4],
      gap: spacing[1],
    },
    title: {
      fontFamily: fontFamilies.heading,
      fontSize: fontSizes.xl,
      lineHeight: fontSizes.xl * 1.25,
      color: colors.heading,
    },
    metaDate: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      color: colors.secondaryText,
    },
    metaStudent: {
      flexShrink: 1,
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.sm,
      color: colors.secondaryText,
    },
    description: {
      paddingHorizontal: spacing[5],
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      lineHeight: fontSizes.md * 1.5,
      color: colors.prose,
    },
    ctaHalf: {
      flex: 1,
      padding: 0,
    },
    modal: {
      backgroundColor: colors.background,
      borderTopLeftRadius: shapes.md,
      borderTopRightRadius: shapes.md,
    },
    modalHeader: {
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
      backgroundColor: colors.surface,
      borderTopLeftRadius: shapes.md,
      borderTopRightRadius: shapes.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.divider,
    },
    modalClose: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      color: colors.secondaryText,
    },
    modalBody: {
      padding: spacing[5],
      gap: spacing[5],
    },
    modalTitle: {
      fontFamily: fontFamilies.heading,
      fontSize: fontSizes.md,
      color: colors.heading,
    },
    answerCard: {
      minHeight: 175,
      padding: spacing[3],
      borderRadius: shapes.lg,
      borderWidth: 1,
      borderColor: colors.surface,
      backgroundColor: colors.surface,
    },
    answerLabel: {
      fontFamily: fontFamilies.heading,
      fontSize: fontSizes.md,
      color: colors.heading,
    },
    answerInput: {
      flex: 1,
      padding: 0,
      textAlignVertical: 'top',
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      color: colors.prose,
    },
  });
