import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';

import { faCalendar, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { usePreferencesContext } from '@polito/lib/core';
import {
  BottomBarSpacer,
  Icon,
  ListItem,
  OverviewList,
  RefreshControl,
  Section,
  SectionHeader,
  SwitchListItem,
  useTheme,
} from '@polito/lib/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useGetCourses } from '~/core/queries/courseHooks.ts';
import { AppPreferences } from '~/core/types/preferences';
import { AgendaStackParamList } from '~/features/agenda/components/AgendaNavigator.tsx';
import { CourseIndicator } from '~/features/courses/components/CourseIndicator.tsx';

type Props = NativeStackScreenProps<AgendaStackParamList, 'AgendaPreferences'>;

export const AgendaPreferencesScreen = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const coursesQuery = useGetCourses();
  const { courses: coursesPrefs, updatePreference } =
    usePreferencesContext<AppPreferences>();
  const { spacing, fontSizes } = useTheme();

  const hasHiddenEvents =
    coursesPrefs &&
    Object.values(coursesPrefs).some(
      prefs =>
        (prefs?.itemsToHideInAgenda && prefs.itemsToHideInAgenda.length > 0) ||
        (prefs?.singleItemsToHideInAgenda &&
          prefs.singleItemsToHideInAgenda.length > 0),
    );

  return (
    <>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          paddingVertical: spacing[5],
        }}
        refreshControl={<RefreshControl queries={[coursesQuery]} manual />}
      >
        {coursesQuery.data &&
          (coursesQuery.data.length > 0 ? (
            <Section>
              <SectionHeader title={t('AgendaPreferences.showInAgenda')} />
              <OverviewList indented>
                {coursesQuery.data.map(
                  (course, index) =>
                    coursesPrefs[course.uniqueShortcode] && (
                      <SwitchListItem
                        key={`${course.shortcode}-${course.id}-${index}`}
                        title={course.name}
                        accessibilityLabel={
                          course.name ?? t('agendaPreferencesScreen.courseItem')
                        }
                        disabled={!coursesPrefs[course.uniqueShortcode]}
                        value={
                          !coursesPrefs[course.uniqueShortcode]
                            .isHiddenInAgenda &&
                          !coursesPrefs[course.uniqueShortcode].isHidden
                        }
                        leadingItem={
                          <CourseIndicator
                            uniqueShortcode={course.uniqueShortcode}
                          />
                        }
                        onChange={value => {
                          updatePreference('courses', {
                            ...coursesPrefs,
                            [course.uniqueShortcode]: {
                              ...coursesPrefs[course.uniqueShortcode],
                              isHiddenInAgenda: !value,
                            },
                          });
                        }}
                      />
                    ),
                )}
              </OverviewList>
            </Section>
          ) : (
            <OverviewList emptyStateText={t('coursesScreen.emptyState')} />
          ))}
        <Section>
          <OverviewList>
            <ListItem
              title={t('common.hiddenEvents')}
              isAction
              accessibilityRole="button"
              accessibilityHint={t('agendaPreferencesScreen.hiddenEventsHint')}
              accessibilityState={{ disabled: !hasHiddenEvents }}
              onPress={() => {
                navigation.navigate('HiddenEvents');
              }}
              disabled={!hasHiddenEvents}
              trailingItem={<Icon icon={faChevronRight} size={fontSizes.xl} />}
              leadingItem={<Icon icon={faCalendar} size={fontSizes['2xl']} />}
            />
          </OverviewList>
        </Section>
      </ScrollView>
      <BottomBarSpacer />
    </>
  );
};
