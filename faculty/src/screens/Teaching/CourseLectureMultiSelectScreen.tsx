import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, SafeAreaView, ScrollView, StyleSheet } from 'react-native';

import { faSquare } from '@fortawesome/free-regular-svg-icons';
import { faSquareCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import { formatDateFromString } from '@polito/lib/core';
import {
  BottomBarSpacer,
  CtaButton,
  CtaButtonContainer,
  Icon,
  IndentedDivider,
  ListItem,
  OverviewList,
  Section,
  TextButton,
  Theme,
  useStylesheet,
} from '@polito/lib/ui';
import { useTheme } from '@polito/lib/ui';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useCourses } from '../../core/contexts/CoursesContext';
import { CourseSharedScreensParamList } from './CourseSharedScreens';
import { LectureStatusBadge } from './LectureStatusBadge';

type MultiSelectLecturesRouteProp = RouteProp<
  CourseSharedScreensParamList,
  'MultiSelectLectures'
>;

export const CourseLectureMultiSelectScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<CourseSharedScreensParamList>>();
  const route = useRoute<MultiSelectLecturesRouteProp>();
  const initialSelectedIds = route.params?.initialSelectedIds;
  const { t } = useTranslation();
  const { selectedCourse, deleteLessonFromCourse } = useCourses();
  const styles = useStylesheet(createStyles);
  const { palettes, fontSizes } = useTheme();

  const lectures = useMemo(
    () => selectedCourse?.lessons ?? [],
    [selectedCourse?.lessons],
  );

  const [selectedLectureIds, setSelectedLectureIds] = useState<Set<number>>(
    () => new Set(initialSelectedIds ?? []),
  );

  const allLecturesSelected =
    lectures.length > 0 && lectures.every(l => selectedLectureIds.has(l.id));

  const handleToggleLecture = useCallback((lectureId: number) => {
    setSelectedLectureIds(prev => {
      const next = new Set(prev);
      if (next.has(lectureId)) {
        next.delete(lectureId);
      } else {
        next.add(lectureId);
      }
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (allLecturesSelected) {
      setSelectedLectureIds(new Set());
    } else {
      setSelectedLectureIds(new Set(lectures.map(l => l.id)));
    }
  }, [allLecturesSelected, lectures]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <TextButton onPress={handleSelectAll}>
            {t('other.selectAll')}
          </TextButton>
        );
      },
    });
  }, [navigation, t, handleSelectAll]);

  if (!selectedCourse) {
    return null;
  }

  const handleDeleteSelected = () => {
    Alert.alert(
      t('common.confirm'),
      t('courseLecturesScreen.alertDeleteSelected'),
      [
        {
          text: t('common.no'),
          style: 'cancel',
        },
        {
          text: t('common.yes'),
          onPress: () => {
            if (selectedCourse) {
              selectedLectureIds.forEach(lectureId => {
                deleteLessonFromCourse(selectedCourse.id, lectureId);
              });
            }
            navigation.goBack();
          },
        },
      ],
    );
  };

  const isSelected = (lectureId: number) => selectedLectureIds.has(lectureId);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Section style={styles.section}>
          <OverviewList indented style={styles.listContainer}>
            {lectures.map((lecture, index) => {
              return (
                <React.Fragment key={lecture.id}>
                  <ListItem
                    isAction
                    title={
                      lecture.title ? lecture.title : t('common.newLecture')
                    }
                    subtitle={`${lecture.date ? formatDateFromString(lecture.date) : t('common.datePlaceholder')} - ${lecture.time ? lecture.time : t('common.timePlaceholder')}`}
                    onPress={() => {
                      handleToggleLecture(lecture.id);
                    }}
                    trailingItem={
                      <React.Fragment>
                        <LectureStatusBadge lecture={lecture} variant="void" />
                        <Icon
                          icon={
                            isSelected(lecture.id) ? faSquareCheck : faSquare
                          }
                          color={palettes.gray[500]}
                          size={fontSizes.md}
                          style={styles.checkbox}
                        />
                      </React.Fragment>
                    }
                  />
                  {index < lectures.length - 1 && <IndentedDivider />}
                </React.Fragment>
              );
            })}
          </OverviewList>
        </Section>
        <BottomBarSpacer />
      </ScrollView>

      <CtaButtonContainer absolute>
        <CtaButton
          absolute={true}
          icon={faTrash}
          title={t('common.deleteSelected')}
          action={handleDeleteSelected}
          variant="outlined"
          destructive
          // containerStyle={styles.CTAbutton}
        />
      </CtaButtonContainer>
    </SafeAreaView>
  );
};

const createStyles = ({ spacing, colors, shapes, palettes }: Theme) =>
  StyleSheet.create({
    container: {
      paddingTop: spacing[5],
      gap: spacing[5],
      backgroundColor: colors.background,
    },
    section: {
      marginTop: 0,
      paddingTop: 0,
    },
    headerRow: {
      marginBottom: spacing[5],
    },
    listContainer: {
      borderRadius: shapes.lg,
      elevation: 0,
      marginTop: 0,
      paddingTop: 0,
    },
    divider: {
      marginLeft: spacing[4],
    },
    checkbox: {
      marginLeft: spacing[1],
    },
    checkboxSelected: {
      backgroundColor: palettes.primary[400],
      borderColor: palettes.primary[400],
    },
    CTAbutton: {
      backgroundColor: colors.background,
    },
  });
