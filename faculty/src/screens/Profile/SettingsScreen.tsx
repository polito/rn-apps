import { useLayoutEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

import {
  faBroom,
  faCircleHalfStroke,
  faFont,
} from '@fortawesome/free-solid-svg-icons';
import {
  PreferencesContextBase,
  useOfflineDisabled,
  usePreferencesContext,
} from '@polito/lib/core';
import {
  BottomBarSpacer,
  Icon,
  ListItem,
  OverviewList,
  Section,
  SectionHeader,
  StatefulMenuView,
  Text,
  Theme,
  lightTheme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppPreferences } from '~/core/types/preferences';

import i18next from 'i18next';
import { Settings } from 'luxon';

import { version } from '../../../package.json';
import { ProfileStackParamList } from './ProfileNavigator';

const themeSwatches: Record<string, string> = {
  dark: lightTheme.palettes.navy[900],
  light: lightTheme.palettes.lightBlue[200],
};

const ThemeIcon = () => {
  const { colorScheme } = usePreferencesContext<AppPreferences>();

  if (colorScheme === 'system') {
    return <Icon icon={faCircleHalfStroke} size={30} />;
  }

  return (
    <View
      style={{
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: themeSwatches[colorScheme],
      }}
    />
  );
};

const ThemeListItem = () => {
  const { t } = useTranslation();
  const { colorScheme, updatePreference } =
    usePreferencesContext<AppPreferences>();

  const actions = useMemo(
    () =>
      (['dark', 'light', 'system'] as const).map(id => ({
        id,
        title: t(`theme.${id}`),
        image:
          id === 'system'
            ? Platform.select({
                ios: 'circle.lefthalf.fill',
                android: 'circle_half',
              })
            : Platform.select({ ios: 'circle.fill', android: 'circle' }),
        imageColor: themeSwatches[id] ?? themeSwatches.dark,
        state: id === colorScheme ? ('on' as const) : undefined,
      })),
    [t, colorScheme],
  );

  return (
    <StatefulMenuView
      actions={actions}
      onPressAction={({ nativeEvent: { event } }) => {
        updatePreference(
          'colorScheme',
          event as PreferencesContextBase<AppPreferences>['colorScheme'],
        );
      }}
    >
      <ListItem
        isAction
        title={t(`theme.${colorScheme}`)}
        accessibilityLabel={`${t('common.theme')}: ${t(
          `theme.${colorScheme}`,
        )}. ${t('settingsScreen.openThemeMenu')}`}
        leadingItem={<ThemeIcon />}
      />
    </StatefulMenuView>
  );
};

const LanguageListItem = () => {
  const { t } = useTranslation();
  const { language, updatePreference } =
    usePreferencesContext<AppPreferences>();
  const isDisabled = useOfflineDisabled();

  const actions = useMemo(
    () =>
      isDisabled
        ? []
        : (['it', 'en'] as const).map(id => ({
            id,
            title: t(`common.${id}`),
            state: id === language ? ('on' as const) : undefined,
          })),
    [t, isDisabled, language],
  );

  return (
    <StatefulMenuView
      actions={actions}
      onPressAction={({ nativeEvent: { event } }) => {
        if (event !== 'it' && event !== 'en') return;
        updatePreference('language', event);
        i18next
          .changeLanguage(event)
          .then(() => (Settings.defaultLocale = event));
      }}
    >
      <ListItem
        isAction
        disabled={isDisabled}
        title={t(`common.${language}`)}
        accessibilityLabel={`${t('common.language')}: ${t(
          `common.${language}`,
        )}. ${t('settingsScreen.openLanguageMenu')}`}
      />
    </StatefulMenuView>
  );
};

export const SettingsScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { t } = useTranslation();
  const { fontSizes } = useTheme();
  const styles = useStylesheet(createStyles);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text
          variant="heading"
          style={{ marginLeft: i18next.language === 'it' ? 80 : 100 }}
        >
          {t('settingsScreen.title')}
        </Text>
      ),
    });
  }, [navigation, t]);

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={styles.container}>
        <Section>
          <SectionHeader title={t('common.theme')} />
          <OverviewList indented>
            <ThemeListItem />
          </OverviewList>
        </Section>

        <Section>
          <SectionHeader title={t('common.language')} />
          <OverviewList indented>
            <LanguageListItem />
          </OverviewList>
        </Section>

        <Section>
          <SectionHeader title={t('common.accessibility')} />
          <OverviewList indented>
            <ListItem
              isAction
              title={t('accessibilitySettingsScreen.fontSettingsTitle')}
              accessibilityRole="button"
              leadingItem={<Icon icon={faFont} size={fontSizes['2xl']} />}
              onPress={() => {
                navigation.navigate('AccessibilitySettings');
              }}
            />
          </OverviewList>
        </Section>

        <Section>
          <SectionHeader title={t('common.cache')} />
          <OverviewList indented>
            <ListItem
              isAction
              title={t('common.cleanCourseFiles')}
              subtitle={t('coursePreferencesScreen.cleanCourseFilesSubtitle', {
                size: '-- MB',
              })}
              accessibilityRole="button"
              leadingItem={<Icon icon={faBroom} size={fontSizes['2xl']} />}
              onPress={() => {
                // why: faculty has no downloads cache yet, wired once files are stored locally
              }}
            />
          </OverviewList>
        </Section>

        <Text style={styles.version}>
          {t('settingsScreen.appVersion', { version })}
        </Text>
      </View>
      <BottomBarSpacer />
    </ScrollView>
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    container: {
      paddingVertical: spacing[5],
    },
    version: {
      paddingHorizontal: spacing[5],
    },
  });
