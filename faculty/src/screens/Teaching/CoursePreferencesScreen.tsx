import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import {
  faCircle as faCircleRegular,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-regular-svg-icons';
import {
  faBell,
  faBroom,
  faCalendarDay,
  faCircle,
  faFile,
  faVideoCamera,
} from '@fortawesome/free-solid-svg-icons';
// import { useFeedbackContext } from '../../core/contexts/FeedbackContext';
import { usePreferencesContext } from '@polito/lib/core';
import { courseColors } from '@polito/lib/features/courses';
import {
  BottomBarSpacer,
  Icon,
  IndentedDivider,
  ListItem,
  OverviewList,
  Section,
  SectionHeader,
  SwitchListItem,
} from '@polito/lib/ui';
import { Theme, useStylesheet, useTheme } from '@polito/lib/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// import { RefreshControl } from '../../ui/components/RefreshControl';

import { CourseContext } from './CourseContext';
import { CourseSharedScreensParamList } from './CourseSharedScreens';

const CleanCourseFilesListItem = () => {
  const { t } = useTranslation();
  // const { setFeedback } = useFeedbackContext();

  const { fontSizes } = useTheme();
  // const [courseFilesCache] = useCourseFilesCachePath();
  // const [cacheSize, setCacheSize] = useState<number>(0);

  // const refreshSize = () => {
  //   if (courseFilesCache) {
  //     stat(courseFilesCache)
  //       .then(({ size }) => {
  //         setCacheSize(size);
  //       })
  //       .catch(() => {
  //         setCacheSize(0);
  //       });
  //   }
  // };

  // useEffect(refreshSize, [courseFilesCache]);

  return (
    <ListItem
      isAction
      title={t('coursePreferencesScreen.cleanCourseFiles')}
      subtitle={t('coursePreferencesScreen.cleanCourseFilesSubtitle')}
      // , {
      // size: cacheSize == null ? '-- MB' : formatFileSize(cacheSize),
      // })}
      subtitleProps={{ numberOfLines: 1 }}
      // disabled={cacheSize === 0}
      leadingItem={<Icon icon={faBroom} size={fontSizes['2xl']} />}
      // onPress={async () => {
      //   if (courseFilesCache && (await confirm())) {
      //     unlink(courseFilesCache).then(() => {
      //       setFeedback({
      //         text: t('coursePreferencesScreen.cleanCacheFeedback'),
      //       });
      //       refreshSize();
      //     });
      //   }
      // }}
    />
  );
};

type Props = NativeStackScreenProps<
  CourseSharedScreensParamList,
  'CoursePreferences'
>;

export const CoursePreferencesScreen = ({ navigation, route }: Props) => {
  const { t } = useTranslation();
  const { fontSizes } = useTheme();
  const { courseId, uniqueShortcode } = route.params;

  // const { mutate: updateCoursePreferences } =
  //   useUpdateCoursePreferences(courseId);
  const { courses: coursesPrefs, updatePreference } = usePreferencesContext();

  const coursePrefs = useMemo(
    () => coursesPrefs[uniqueShortcode],
    [uniqueShortcode, coursesPrefs],
  );

  const defaultPrefs = {
    color: courseColors[0].color,
    isHidden: false,
    isHiddenInAgenda: false,
    isExamCallsHidden: false,
  };

  const selectedColor = coursePrefs?.color || defaultPrefs.color;
  const styles = useStylesheet(createStyles);

  return (
    <CourseContext.Provider value={courseId}>
      <ScrollView
        style={styles.container}
        contentInsetAdjustmentBehavior="automatic"
        // refreshControl={<RefreshControl queries={[courseQuery]} />}
      >
        <SafeAreaView>
          <View>
            {/* Visualization */}
            <Section>
              <SectionHeader title={t('common.visualization')} />
              <OverviewList
                style={styles.listContainer}
                /* loading={courseQuery.isLoading} */ indented
              >
                <ListItem
                  title={t('common.color')}
                  subtitle={t('coursePreferencesScreen.colorSubtitle')}
                  isAction
                  onPress={() =>
                    navigation.navigate('CourseColorPicker', {
                      courseId,
                      uniqueShortcode,
                    })
                  }
                  leadingItem={
                    <Icon
                      icon={faCircle}
                      size={fontSizes['2xl']}
                      color={selectedColor}
                    />
                  }
                />
                <IndentedDivider />
                <ListItem
                  title={t('common.icon')}
                  subtitle={t('coursePreferencesScreen.iconSubtitle')}
                  isAction
                  onPress={() =>
                    navigation.navigate('CourseIconPicker', {
                      courseId,
                      uniqueShortcode,
                    })
                  }
                  leadingItem={
                    <Icon icon={faCircleRegular} size={fontSizes['2xl']} />
                  }
                />
                <IndentedDivider />
                <SwitchListItem
                  title={t('coursePreferencesScreen.showInExtracts')}
                  subtitle={t('coursePreferencesScreen.showInExtractsSubtitle')}
                  value={!coursePrefs?.isHidden}
                  leadingItem={<Icon icon={faEye} size={fontSizes['2xl']} />}
                  onChange={value => {
                    updatePreference('courses', {
                      ...coursesPrefs,
                      [uniqueShortcode]: {
                        ...defaultPrefs,
                        ...coursePrefs,
                        isHidden: !value,
                      },
                    });
                    // updateCoursePreferences({
                    //   notifications: {
                    //     notices: value,
                    //     lectures: value,
                    //     files: value,
                    //   },
                    // });
                  }}
                />
                <IndentedDivider />
                <SwitchListItem
                  title={t('coursePreferencesScreen.showExamCalls')}
                  value={!coursePrefs?.isExamCallsHidden}
                  leadingItem={<Icon icon={faEye} size={fontSizes['2xl']} />}
                  onChange={value => {
                    updatePreference('courses', {
                      ...coursesPrefs,
                      [uniqueShortcode]: {
                        ...defaultPrefs,
                        ...coursePrefs,
                        isExamCallsHidden: !value,
                      },
                    });
                  }}
                />
              </OverviewList>
            </Section>

            {/* Notifications */}
            <Section>
              <SectionHeader title={t('common.notifications')} />
              <OverviewList style={styles.listContainer} indented>
                <SwitchListItem
                  title={t('common.news')}
                  subtitle={t('coursePreferencesScreen.newsSubtitle')}
                  subtitleProps={{ numberOfLines: 1 }}
                  //   disabled={!courseQuery.data}
                  //   value={courseQuery.data?.notifications.notices}
                  leadingItem={<Icon icon={faBell} size={fontSizes['2xl']} />}
                  //   onChange={() => {
                  //     updateCoursePreferences({
                  //       notifications: {
                  //         notices: !courseQuery.data?.notifications.notices,
                  //       },
                  //     });
                  //   }}
                />
                <IndentedDivider />
                <SwitchListItem
                  title={t('common.file_plural')}
                  subtitle={t('coursePreferencesScreen.filesSubtitle')}
                  subtitleProps={{ numberOfLines: 1 }}
                  //   disabled={!courseQuery.data}
                  //   value={courseQuery.data?.notifications.files}
                  leadingItem={<Icon icon={faFile} size={fontSizes['2xl']} />}
                  //   onChange={() => {
                  //     updateCoursePreferences({
                  //       notifications: {
                  //         files: !courseQuery.data?.notifications.files,
                  //       },
                  //     });
                  //   }}
                />
                <IndentedDivider />
                <SwitchListItem
                  title={t('common.lecture_plural')}
                  subtitle={t('coursePreferencesScreen.lecturesSubtitle')}
                  subtitleProps={{ numberOfLines: 1 }}
                  //   disabled={!courseQuery.data}
                  //   value={courseQuery.data?.notifications.lectures}
                  leadingItem={
                    <Icon icon={faVideoCamera} size={fontSizes['2xl']} />
                  }
                  //   onChange={() => {
                  //     updateCoursePreferences({
                  //       notifications: {
                  //         lectures: !courseQuery.data?.notifications.lectures,
                  //       },
                  //     });
                  //   }}
                />
              </OverviewList>
            </Section>

            {/* Agenda */}
            <Section>
              <SectionHeader title={t('common.agenda')} />
              <OverviewList style={styles.listContainer} indented>
                <SwitchListItem
                  title={t('AgendaPreferences.hideInAgenda')}
                  disabled={!coursePrefs}
                  value={coursePrefs?.isHiddenInAgenda || coursePrefs?.isHidden}
                  leadingItem={
                    <Icon icon={faEyeSlash} size={fontSizes['2xl']} />
                  }
                  onChange={value => {
                    updatePreference('courses', {
                      ...coursesPrefs,
                      [uniqueShortcode]: {
                        ...defaultPrefs,
                        ...coursePrefs,
                        isHiddenInAgenda: value,
                      },
                    });
                  }}
                />
                <IndentedDivider />
                <ListItem
                  title={t('common.hiddenEvents')}
                  isAction
                  onPress={() => {
                    navigation.navigate('CourseHideEvent', {
                      courseId,
                      uniqueShortcode,
                    });
                  }}
                  //   disabled={
                  //     !coursePrefs?.itemsToHideInAgenda?.length &&
                  //     !coursePrefs.singleItemsToHideInAgenda?.length
                  //   }
                  leadingItem={
                    <Icon icon={faCalendarDay} size={fontSizes['2xl']} />
                  }
                />
              </OverviewList>
            </Section>

            {/* Files */}
            <Section>
              <SectionHeader title={t('common.file_plural')} />
              <OverviewList style={styles.listContainer} indented>
                <CleanCourseFilesListItem />
              </OverviewList>
            </Section>
          </View>
          <BottomBarSpacer />
        </SafeAreaView>
      </ScrollView>
    </CourseContext.Provider>
  );
};

const createStyles = ({ spacing, shapes, colors }: Theme) =>
  StyleSheet.create({
    container: {
      paddingTop: spacing[5],
      marginBottom: spacing[5],
    },
    listContainer: {
      borderRadius: shapes.lg,
      marginHorizontal: spacing[4],
      elevation: 0,
    },
    headerDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor:
        typeof colors.divider === 'string' ? colors.divider : undefined,
    },
  });
