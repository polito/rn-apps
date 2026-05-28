import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, SafeAreaView, ScrollView, StyleSheet } from 'react-native';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { formatDateFromString } from '@polito/lib/core';
import {
  BottomBarSpacer,
  CtaButton,
  CtaButtonContainer,
  DisclosureIndicator,
  IndentedDivider,
  ListItem,
  OverviewList,
  Section,
  Select,
} from '@polito/lib/ui';
import { Theme, useStylesheet } from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useCourses } from '../../core/contexts/CoursesContext';
import { CourseSharedScreensParamList } from './CourseSharedScreens';
import { NoticeStatusBadge } from './NoticeStatusBadge';

export const CourseNoticesTab = () => {
  const { selectedCourse, setSelectedNotice } = useCourses();
  const navigation =
    useNavigation<NativeStackNavigationProp<CourseSharedScreensParamList>>();
  const styles = useStylesheet(createStyles);
  const { t } = useTranslation();

  // Troviamo il corso corrispondente
  const course = selectedCourse;
  const [orderBy, setOrderBy] = React.useState<
    'newest' | 'oldest' | undefined
  >();

  if (!course) {
    return null;
  }

  const sortedNotices = [...selectedCourse.notices].sort((a, b) => {
    if (a.alwaysVisible !== b.alwaysVisible) {
      if (orderBy === 'oldest') {
        return a.alwaysVisible ? 1 : -1;
      }
      return a.alwaysVisible ? -1 : 1;
    }
    if (orderBy === 'newest') {
      return (
        new Date(b.startDate ?? 0).getTime() -
        new Date(a.startDate ?? 0).getTime()
      );
    }
    if (orderBy === 'oldest') {
      return (
        new Date(a.startDate ?? 0).getTime() -
        new Date(b.startDate ?? 0).getTime()
      );
    }
    return 0;
  });

  return (
    <React.Fragment>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.container}
      >
        <SafeAreaView>
          <Select
            label={
              orderBy === 'newest'
                ? t('common.newestFirst')
                : orderBy === 'oldest'
                  ? t('common.oldestFirst')
                  : t('common.orderBy')
            }
            options={[
              { id: 'newest', title: t('common.newestFirst') },
              { id: 'oldest', title: t('common.oldestFirst') },
            ]}
            onSelectOption={id => setOrderBy(id as 'newest' | 'oldest')}
          />
          <Section>
            <OverviewList indented style={styles.listContainer}>
              {sortedNotices.map((notice, index) => {
                return (
                  <React.Fragment key={notice.id}>
                    <ListItem
                      key={`${notice.id}`}
                      isAction
                      title={notice.content || t('courseNoticesTab.newNotice')}
                      subtitle={
                        notice.alwaysVisible
                          ? t('courseNoticesTab.alwaysVisible')
                          : notice.startDate
                            ? notice.endDate
                              ? formatDateFromString(notice.startDate) +
                                ' - ' +
                                formatDateFromString(notice.endDate)
                              : formatDateFromString(notice.startDate) +
                                ' - ' +
                                t('courseNoticesTab.alwaysVisible')
                            : ''
                      }
                      onPress={() => {
                        setSelectedNotice(notice);
                        navigation.navigate('NoticeScreen');
                      }}
                      trailingItem={
                        <React.Fragment>
                          <NoticeStatusBadge notice={notice} />
                          <DisclosureIndicator />
                        </React.Fragment>
                      }
                    />
                    {index < sortedNotices.length - 1 && <IndentedDivider />}
                  </React.Fragment>
                );
              })}
            </OverviewList>
          </Section>
        </SafeAreaView>
        <BottomBarSpacer />
      </ScrollView>
      <CtaButtonContainer absolute={Platform.OS === 'android'}>
        <CtaButton
          title={t('courseNoticesTab.newNotice')}
          action={() => {
            navigation.navigate('AddNoticeContent');
          }}
          icon={faPlus}
          absolute={Platform.OS === 'ios'}
        />
      </CtaButtonContainer>
    </React.Fragment>
  );
};

const createStyles = ({ spacing, shapes }: Theme) =>
  StyleSheet.create({
    listContainer: {
      borderRadius: shapes.lg,
      marginTop: spacing[2.5],
      elevation: 0,
    },
    container: {
      marginVertical: spacing[5],
    },
  });
