import React from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';

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
import {
  NoticeStatusBadge,
  getNoticeStatus,
  useNoticeStatusLabel,
} from './NoticeStatusBadge';

export const CourseNoticesTab = () => {
  const { selectedCourse } = useCourses();
  const navigation =
    useNavigation<NativeStackNavigationProp<CourseSharedScreensParamList>>();
  const styles = useStylesheet(createStyles);
  const { t } = useTranslation();
  const getStatusLabel = useNoticeStatusLabel();
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

  const getSubtitle = (notice: (typeof sortedNotices)[number]) => {
    if (notice.alwaysVisible) return t('courseNoticesTab.alwaysVisible');
    if (!notice.startDate) return '';
    const start = formatDateFromString(notice.startDate);
    return notice.endDate
      ? `${start} - ${formatDateFromString(notice.endDate)}`
      : start;
  };

  return (
    <React.Fragment>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.container}
      >
        <SafeAreaView>
          <Select
            compact
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
                      isAction
                      title={
                        notice.title ||
                        notice.content ||
                        t('courseNoticesTab.newNotice')
                      }
                      subtitle={getSubtitle(notice)}
                      accessibilityRole="button"
                      accessibilityLabel={[
                        notice.title ||
                          notice.content ||
                          t('courseNoticesTab.newNotice'),
                        getSubtitle(notice),
                        getStatusLabel(getNoticeStatus(notice)),
                      ]
                        .filter(Boolean)
                        .join(', ')}
                      accessibilityHint={t('courseNoticesTab.openHint')}
                      onPress={() =>
                        navigation.navigate('Notice', {
                          noticeId: notice.id,
                          courseId: course.id,
                        })
                      }
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
      <CtaButtonContainer absolute={true} style={styles.ctaContainer}>
        <CtaButton
          title={t('courseNoticesTab.newNotice')}
          accessibilityHint={t('courseNoticesTab.newNoticeHint')}
          action={() => {
            navigation.navigate('AddNoticeContent', { courseId: course.id });
          }}
          icon={faPlus}
          absolute={false}
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
    ctaContainer: {
      paddingBottom: spacing[5],
    },
  });
