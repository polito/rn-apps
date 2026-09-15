import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AccessibilityInfo, FlatList, TouchableOpacity } from 'react-native';

import {
  PreferencesContextBase,
  usePreferencesContext,
} from '@polito/lib/core';
import { courseIcons } from '@polito/lib/features/courses';
import {
  BottomBarSpacer,
  CtaButton,
  CtaButtonSpacer,
  Icon,
  useSafeAreaSpacing,
  useTheme,
} from '@polito/lib/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppPreferences } from '~/core/types/preferences';

import { TeachingStackParamList } from '../../teaching/components/TeachingNavigator';

const icons = Object.entries(courseIcons);

type Props = NativeStackScreenProps<TeachingStackParamList, 'CourseIconPicker'>;

export const CourseIconPickerScreen = ({ navigation, route }: Props) => {
  const { t } = useTranslation();
  const { spacing, fontSizes } = useTheme();
  const [searchFilter, setSearchFilter] = useState('');
  const { courses: coursesPrefs, updatePreference } =
    usePreferencesContext<AppPreferences>();
  const { marginHorizontal } = useSafeAreaSpacing();
  const { uniqueShortcode } = route.params;
  const coursePrefs = useMemo(
    () => coursesPrefs[uniqueShortcode],
    [uniqueShortcode, coursesPrefs],
  );
  const filteredIcons = useMemo(
    () =>
      searchFilter
        ? icons.filter(([k]) => k.toLowerCase().includes(searchFilter))
        : icons,
    [searchFilter],
  );

  useEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        onChangeText: e => setSearchFilter(e.nativeEvent.text.toLowerCase()),
      },
    });
  }, [navigation]);

  return (
    <>
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={filteredIcons}
        renderItem={({ item }) => (
          <TouchableOpacity
            accessibilityLabel={t(
              `icons.${(item?.[1] as { iconName?: string })?.iconName}`,
            )}
            accessible
            accessibilityRole="button"
            style={{
              flex: 1,
              alignItems: 'center',
              padding: spacing[4],
            }}
            onPress={() => {
              setTimeout(() => {
                AccessibilityInfo.announceForAccessibility(
                  [
                    t('coursePreferencesScreen.selectedIcon'),
                    t(
                      `icons.${(item?.[1] as { iconName?: string })?.iconName}`,
                    ),
                  ].join(', '),
                );
              }, 200);
              updatePreference('courses', {
                ...coursesPrefs,
                [uniqueShortcode]: {
                  ...coursePrefs,
                  icon: item[0],
                },
              });
              navigation.goBack();
            }}
          >
            <Icon icon={item[1]} size={fontSizes['2xl']} />
          </TouchableOpacity>
        )}
        numColumns={5}
        contentContainerStyle={[
          { paddingHorizontal: spacing[5] },
          marginHorizontal,
        ]}
        ListFooterComponent={
          <>
            <CtaButtonSpacer />
            <BottomBarSpacer />
          </>
        }
      />
      {coursePrefs.icon != null && (
        <CtaButton
          title={t('common.remove')}
          destructive
          action={() => {
            updatePreference('courses', {
              ...coursesPrefs,
              [uniqueShortcode]: {
                ...coursePrefs,
                icon: null,
              },
            } as PreferencesContextBase<AppPreferences>['courses']);
            navigation.goBack();
          }}
        />
      )}
    </>
  );
};
