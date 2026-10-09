import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet } from 'react-native';

import {
  faEye,
  faEyeSlash,
  faHourglassEnd,
  faHourglassStart,
  faPencil,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { formatDateFromString } from '@polito/lib/core';
import {
  Card,
  Col,
  CtaButton,
  CtaButtonContainer,
  CtaButtonSpacer,
  Row,
  Section,
  Separator,
  Switch,
  Text,
} from '@polito/lib/ui';
import { Theme, useStylesheet } from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useCourses } from '../../core/contexts/CoursesContext';
import { CourseSharedScreensParamList } from './CourseSharedScreens';

export const NoticeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<CourseSharedScreensParamList>>();

  const styles = useStylesheet(createStyles);
  const {
    setVisibilityOfNotice,
    setSelectedNotice,
    selectedNotice: selectedNoticeInContext,
    selectedCourse,
    deleteNoticeFromCourse,
  } = useCourses();

  const selectedNotice =
    selectedCourse?.notices.find(
      (n: any) => n.id === selectedNoticeInContext?.id,
    ) ?? selectedNoticeInContext;
  const isExpired = Boolean(
    selectedNotice?.endDate &&
    selectedNotice.endDate < new Date().toISOString(),
  );
  const description = selectedNotice?.content || '';

  const [noticeVisibility, setNoticeVisibility] = useState(
    selectedNotice?.visible || false,
  );
  const { t } = useTranslation();
  useEffect(() => {
    if (selectedNotice) {
      setNoticeVisibility(selectedNotice.visible);
    }
  }, [selectedNotice]);

  useEffect(() => {
    setSelectedNotice(selectedNotice ?? null);
  }, [selectedNotice, setSelectedNotice]);

  const handleToggle = useMemo(() => {
    return (value: boolean) => {
      if (!selectedCourse || !selectedNotice) return;
      setVisibilityOfNotice(selectedCourse.id, selectedNotice.id, value);
      setNoticeVisibility(value);
    };
  }, [
    selectedCourse,
    selectedNotice,
    setVisibilityOfNotice,
    setNoticeVisibility,
  ]);

  const handleDeleteNotice = () => {
    Alert.alert(t('common.confirm'), t('other.alertDeleteNotice'), [
      {
        text: t('common.no'),
        style: 'cancel',
      },
      {
        text: t('common.yes'),
        onPress: () => {
          if (selectedCourse && selectedNotice) {
            deleteNoticeFromCourse(selectedCourse.id, selectedNotice.id);
            navigation.goBack();
          }
        },
      },
    ]);
  };

  const settings = useMemo(
    () => [
      {
        id: 1,
        content: t('other.publicationDate'),
        subtitle: (
          <Text style={styles.subtitle}>
            {selectedNotice!.startDate
              ? formatDateFromString(selectedNotice!.startDate)
              : t('other.notAvailable')}
          </Text>
        ),
        icon: <FontAwesomeIcon icon={faHourglassStart} style={styles.icon} />,
        trailingItem: null,
      },
      {
        id: 2,
        content: t('other.expirationDate'),
        subtitle: (
          <Text style={styles.subtitle}>
            {selectedNotice?.alwaysVisible
              ? t('other.never')
              : selectedNotice!.endDate &&
                formatDateFromString(selectedNotice!.endDate)}
          </Text>
        ),
        icon: <FontAwesomeIcon icon={faHourglassEnd} style={styles.icon} />,
        trailingItem: null,
      },
      {
        id: 3,
        content: t('other.visibility'),
        subtitle: (
          <Text style={styles.subtitle}>
            {selectedNotice?.visible ? t('other.everyone') : t('other.onlyYou')}
          </Text>
        ),
        icon: (
          <FontAwesomeIcon
            icon={selectedNotice?.visible ? faEye : faEyeSlash}
            style={styles.icon}
          />
        ),
        trailingItem: (
          <Switch value={noticeVisibility} onValueChange={handleToggle} />
        ),
      },
    ],
    [
      selectedNotice,
      noticeVisibility,
      t,
      styles.subtitle,
      styles.icon,
      handleToggle,
    ],
  );

  if (!selectedCourse || !selectedNotice) {
    return null;
  }

  return (
    <React.Fragment>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.container}
      >
        <Card style={styles.card}>
          <Col style={styles.cardContent}>
            {settings.map(setting => (
              <Row key={`${setting.id}`} style={styles.cardElement}>
                {setting.icon}
                <Text style={styles.title}>
                  {setting.content}: {setting.subtitle}
                </Text>
              </Row>
            ))}
          </Col>
        </Card>

        <Section>
          <Separator />
          <Text variant="heading" style={styles.sectionTitle}>
            {t('other.noticeTextTitle')}
          </Text>
          <Text style={styles.sectionContent}>{description}</Text>
        </Section>

        <CtaButtonSpacer />
      </ScrollView>

      <CtaButtonContainer absolute={true} style={styles.ctaContainer}>
        <Row gap={2.5}>
          <Col flex={1}>
            <CtaButton
              absolute={true}
              title={t('common.delete')}
              action={handleDeleteNotice}
              icon={faTrash}
              destructive
              variant="outlined"
            />
          </Col>
          <Col flex={1}>
            <CtaButton
              title={t('common.edit')}
              action={() => {
                navigation.navigate('EditNoticeContent');
              }}
              icon={faPencil}
              absolute={true}
              disabled={isExpired}
            />
          </Col>
        </Row>
      </CtaButtonContainer>
    </React.Fragment>
  );
};
const createStyles = ({
  palettes,
  spacing,
  fontSizes,
  fontWeights,
  shapes,
}: Theme) =>
  StyleSheet.create({
    container: {
      padding: spacing[5],
    },
    ctaContainer: {
      paddingBottom: spacing[5],
    },

    sectionTitle: {
      fontSize: fontSizes.md,
      fontWeight: fontWeights.semibold,
      fontFamily: 'Montserrat-SemiBold',
      color: palettes.primary[700],
    },
    sectionContent: {
      fontSize: fontSizes.md,
      fontWeight: fontWeights.normal,
      fontFamily: 'Montserrat-Regular',
      color: palettes.gray[800],
    },
    card: {
      padding: spacing[5],
      elevation: 0,
      borderRadius: shapes.lg,
      marginBottom: spacing[5],
    },
    cardContent: {
      gap: spacing[3],
    },
    cardElement: {
      alignItems: 'center',
    },
    icon: {
      color: palettes.gray[600],
      fontSize: fontSizes['2xl'],
      marginRight: spacing[1],
    },
    title: {
      color: palettes.gray[600],
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.normal,
      fontFamily: 'Montserrat-Regular',
    },
    subtitle: {
      color: palettes.text[800],
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      fontFamily: 'Montserrat-SemiBold',
    },
  });
