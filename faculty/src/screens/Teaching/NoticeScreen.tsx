import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import {
  faHourglassEnd,
  faHourglassStart,
  faPencil,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { formatDateFromString } from '@polito/lib/core';
import {
  Card,
  CtaButton,
  CtaButtonContainer,
  CtaButtonSpacer,
  Icon,
  Row,
  Section,
  Separator,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useCourses } from '../../core/contexts/CoursesContext';
import { CourseSharedScreensParamList } from './CourseSharedScreens';

type Props = NativeStackScreenProps<CourseSharedScreensParamList, 'Notice'>;

export const NoticeScreen = ({ navigation, route }: Props) => {
  const { noticeId, courseId } = route.params;
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { colors, fontSizes } = useTheme();
  const { selectedCourse, deleteNoticeFromCourse } = useCourses();

  const selectedNotice =
    selectedCourse?.id === courseId
      ? selectedCourse.notices.find(n => n.id === noticeId)
      : undefined;

  if (!selectedCourse || !selectedNotice) {
    return null;
  }

  const isExpired = Boolean(
    selectedNotice.endDate && selectedNotice.endDate < new Date().toISOString(),
  );

  const handleDeleteNotice = () => {
    Alert.alert(t('common.confirm'), t('other.alertDeleteNotice'), [
      { text: t('common.no'), style: 'cancel' },
      {
        text: t('common.yes'),
        style: 'destructive',
        onPress: () => {
          deleteNoticeFromCourse(selectedCourse.id, selectedNotice.id);
          navigation.goBack();
        },
      },
    ]);
  };

  const details: {
    id: string;
    icon: IconDefinition;
    label: string;
    value: string;
  }[] = [
    {
      id: 'publication',
      icon: faHourglassStart,
      label: t('other.publicationDate'),
      value: selectedNotice.startDate
        ? formatDateFromString(selectedNotice.startDate)
        : t('other.notAvailable'),
    },
    {
      id: 'expiration',
      icon: faHourglassEnd,
      label: t('other.expirationDate'),
      value:
        selectedNotice.alwaysVisible || !selectedNotice.endDate
          ? t('other.never')
          : formatDateFromString(selectedNotice.endDate),
    },
    {
      id: 'visibility',
      icon: selectedNotice.visible ? faEye : faEyeSlash,
      label: t('other.visibility'),
      value: selectedNotice.visible ? t('other.everyone') : t('other.onlyYou'),
    },
  ];

  return (
    <React.Fragment>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.content}>
          <Card rounded style={styles.card}>
            {details.map(detail => (
              <Row
                key={detail.id}
                align="center"
                gap={1}
                accessible
                accessibilityLabel={`${detail.label}: ${detail.value}`}
              >
                <View style={styles.iconBox}>
                  <Icon
                    icon={detail.icon}
                    size={fontSizes.md}
                    color={colors.secondaryText}
                  />
                </View>
                <Text style={styles.detailLabel}>
                  {`${detail.label}: `}
                  <Text style={styles.detailValue}>{detail.value}</Text>
                </Text>
              </Row>
            ))}
          </Card>

          <Section>
            <Separator />
            <Text style={styles.sectionTitle} accessibilityRole="header">
              {t('other.noticeTextTitle')}
            </Text>
            <Text style={styles.sectionContent}>{selectedNotice.content}</Text>
          </Section>
        </View>
        <CtaButtonSpacer />
      </ScrollView>

      <CtaButtonContainer absolute>
        <Row gap={2.5}>
          <CtaButton
            absolute={false}
            variant="outlined"
            destructive
            title={t('common.delete')}
            icon={faTrash}
            containerStyle={styles.ctaHalf}
            accessibilityHint={t('noticeScreen.deleteHint')}
            action={handleDeleteNotice}
          />
          <CtaButton
            absolute={false}
            title={t('common.edit')}
            icon={faPencil}
            disabled={isExpired}
            containerStyle={styles.ctaHalf}
            accessibilityState={{ disabled: isExpired }}
            accessibilityHint={
              isExpired
                ? t('noticeScreen.editDisabledHint')
                : t('noticeScreen.editHint')
            }
            action={() =>
              navigation.navigate('EditNoticeContent', { noticeId, courseId })
            }
          />
        </Row>
      </CtaButtonContainer>
    </React.Fragment>
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
    content: {
      padding: spacing[5],
      gap: spacing[5],
    },
    card: {
      padding: spacing[5],
      gap: spacing[3],
      margin: 0,
      marginVertical: 0,
      borderRadius: shapes.lg,
      elevation: 0,
    },
    iconBox: {
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    detailLabel: {
      flexShrink: 1,
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.sm,
      color: colors.secondaryText,
    },
    detailValue: {
      fontFamily: fontFamilies.heading,
      color: colors.prose,
    },
    sectionTitle: {
      fontFamily: fontFamilies.heading,
      fontSize: fontSizes.md,
      lineHeight: fontSizes.md * 1.25,
      color: colors.heading,
    },
    sectionContent: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      lineHeight: fontSizes.md * 1.5,
      color: colors.prose,
    },
    ctaHalf: {
      flex: 1,
      padding: 0,
    },
  });
