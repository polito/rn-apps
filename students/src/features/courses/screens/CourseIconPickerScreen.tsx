import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AccessibilityInfo, FlatList, TouchableOpacity } from 'react-native';

import {
  PreferencesContextBase,
  useAccessibilityFocusOnScreenFocus,
  usePreferencesContext,
  useScreenReader,
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
  const { announce } = useScreenReader();
  const { spacing, fontSizes } = useTheme();
  const [searchFilter, setSearchFilter] = useState('');
  const { courses: coursesPrefs, updatePreference } =
    usePreferencesContext<AppPreferences>();
  const { marginHorizontal } = useSafeAreaSpacing();
  const screenRef = useAccessibilityFocusOnScreenFocus<FlatList>();
  const { uniqueShortcode } = route.params;
  const coursePrefs = useMemo(
    () => coursesPrefs[uniqueShortcode],
    [uniqueShortcode, coursesPrefs],
  );
  const getIconLabel = useCallback(
    (item: (typeof icons)[number]) => {
      const iconName =
        (item?.[1] as { iconName?: string })?.iconName ?? item[0];
      return t(`icons.${iconName}`, {
        defaultValue: iconName.replace(/-/g, ' '),
      });
    },
    [t],
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
        placeholder: t('common.search'),
        onChangeText: e => setSearchFilter(e.nativeEvent.text.toLowerCase()),
      },
    });
  }, [navigation, t]);

  return (
    <>
      <FlatList
        ref={screenRef}
        contentInsetAdjustmentBehavior="automatic"
        data={filteredIcons}
        renderItem={({ item }) => (
          <TouchableOpacity
            accessible
            accessibilityRole="button"
            accessibilityLabel={getIconLabel(item)}
            accessibilityState={{ selected: coursePrefs?.icon === item[0] }}
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
                    getIconLabel(item),
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
              announce(
                t('courseIconPickerScreen.iconSelected', {
                  icon: getIconLabel(item),
                }),
              );
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
