import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';
import { stat, unlink } from 'react-native-fs';

import { faCalendarCheck } from '@fortawesome/free-regular-svg-icons';
import {
  faBroom,
  faCalendarDay,
  faCircleExclamation,
  faCircleHalfStroke,
  faFont,
  faShieldHalved,
} from '@fortawesome/free-solid-svg-icons';
import {
  PreferencesContextBase,
  formatFileSize,
  useFeedbackContext,
  useOfflineDisabled,
  usePreferencesContext,
} from '@polito/lib/core';
import {
  Badge,
  BottomBarSpacer,
  Col,
  DisclosureIndicator,
  Icon,
  ListItem,
  OverviewList,
  Section,
  SectionHeader,
  StatefulMenuView,
  SwitchListItem,
  Text,
  type Theme,
  lightTheme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';

import { useCheckMfa } from '~/core/queries/authHooks';
import { AppPreferences } from '~/core/types/preferences';
import { hasPrivateKeyMFA, resetPrivateKeyMFA } from '~/utils/keychain';

import i18next from 'i18next';
import { Settings } from 'luxon';

import { version } from '../../../../package.json';
import { useConfirmationDialog } from '../../../core/hooks/useConfirmationDialog';
import { useUpdateDevicePreferences } from '../../../core/queries/studentHooks';
import { useCoursesFilesCachePath } from '../../courses/hooks/useCourseFilesCachePath';

const CleanCacheListItem = () => {
  const { t } = useTranslation();

  const { setFeedback } = useFeedbackContext();

  const { fontSizes } = useTheme();
  const filesCache = useCoursesFilesCachePath();
  const [cacheSize, setCacheSize] = useState<number>();
  const confirm = useConfirmationDialog({
    title: t('common.areYouSure?'),
    message: t('settingsScreen.cleanCacheConfirmMessage'),
  });
  const refreshSize = () => {
    if (filesCache) {
      stat(filesCache)
        .then(({ size }) => {
          setCacheSize(size);
        })
        .catch(() => {
          setCacheSize(0);
        });
    }
  };

  useEffect(refreshSize, [filesCache]);
  return (
    <ListItem
      isAction
      title={t('common.cleanCourseFiles')}
      subtitle={t('coursePreferencesScreen.cleanCourseFilesSubtitle', {
        size: cacheSize == null ? '-- MB' : formatFileSize(cacheSize),
      })}
      accessibilityRole="button"
      disabled={cacheSize === 0}
      leadingItem={<Icon icon={faBroom} size={fontSizes['2xl']} />}
      onPress={async () => {
        if (filesCache && (await confirm())) {
          unlink(filesCache).then(() => {
            setFeedback({
              text: t('coursePreferencesScreen.cleanCacheFeedback'),
            });
            refreshSize();
          });
        }
      }}
    />
  );
};

const ThemeIcon = () => {
  const schemes: Record<string, string> = {
    dark: lightTheme?.palettes.navy[900],
    light: lightTheme?.palettes.lightBlue[200],
  };
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
        backgroundColor: schemes[colorScheme],
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />
  );
};

const VisualizationListItem = () => {
  const { t } = useTranslation();
  const { colorScheme, updatePreference } = usePreferencesContext();
  const settingsColorScheme = useColorScheme();

  const colorSchema = {
    dark: lightTheme?.palettes.navy[900],
    light: lightTheme?.palettes.lightBlue[200],
  };

  const themeColors = [
    {
      colorSchema: 'dark',
      id: 'dark',
      title: 'theme.dark',
      color: colorSchema.dark,
      state: colorScheme === 'dark',
      image: Platform.select({ ios: 'circle.fill', android: 'circle' }),
    },
    {
      colorSchema: 'light',
      id: 'light',
      title: 'theme.light',
      color: colorSchema.light,
      state: colorScheme === 'dark',
      image: Platform.select({ ios: 'circle.fill', android: 'circle' }),
    },
    {
      colorSchema: 'light',
      id: 'system',
      title: 'theme.system',
      color:
        colorScheme === 'dark' ||
        (colorScheme === 'system' && settingsColorScheme === 'dark')
          ? 'white'
          : colorSchema.dark,
      state: colorScheme === 'system',
      image: Platform.select({
        ios: 'circle.lefthalf.fill',
        android: 'circle_half',
      }),
    },
  ];

  return (
    <StatefulMenuView
      actions={themeColors.map(cc => {
        return {
          id: cc.id,
          title: t(`theme.${cc.id}`),
          image: cc.image,
          imageColor: cc.color,
          state: cc.id === colorScheme ? 'on' : undefined,
        };
      })}
      onPressAction={({ nativeEvent: { event } }) => {
        updatePreference(
          'colorScheme',
          event as PreferencesContextBase<AppPreferences>['colorScheme'],
        );
      }}
    >
      <ListItem
        title={t(`theme.${colorScheme}`)}
        isAction
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
  const { mutate } = useUpdateDevicePreferences();
  const isDisabled = useOfflineDisabled();

  const choices = useMemo(() => {
    if (isDisabled) return [];

    return ['it', 'en'] as const;
  }, [isDisabled]);
  return (
    <StatefulMenuView
      actions={choices.map(cc => {
        return {
          id: cc,
          title: t(`common.${cc}`),
          state: cc === language ? 'on' : undefined,
        };
      })}
      onPressAction={({ nativeEvent: { event } }) => {
        const lang = event as 'it' | 'en';

        mutate({ updatePreferencesRequest: { language: lang } });
        updatePreference('language', lang);

        i18next
          .changeLanguage(lang)
          .then(() => (Settings.defaultLocale = lang));
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

// TODO: temporarily removed
// eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
const Notifications = () => {
  const { t } = useTranslation();
  const { fontSizes } = useTheme();
  const { notifications, updatePreference } =
    usePreferencesContext<AppPreferences>();

  const onChangeNotification =
    (notificationType: string) => (value: boolean) => {
      updatePreference('notifications', {
        ...notifications,
        [notificationType]: value,
      } as PreferencesContextBase<AppPreferences>['notifications']);
    };

  return (
    <OverviewList indented>
      <SwitchListItem
        disabled
        accessible={true}
        accessibilityLabel={`${t('notifications.important')}. ${t(
          `common.activeStatus.${notifications?.important}`,
        )} `}
        accessibilityRole="switch"
        title={t('notifications.important')}
        value={notifications?.important}
        onChange={onChangeNotification('important')}
        leadingItem={
          <Icon icon={faCircleExclamation} size={fontSizes['2xl']} />
        }
      />
      <SwitchListItem
        disabled
        accessible={true}
        accessibilityLabel={`${t('notifications.events')}. ${t(
          `common.activeStatus.${notifications?.events}`,
        )} `}
        accessibilityRole="switch"
        title={t('notifications.events')}
        value={notifications?.events}
        onChange={onChangeNotification('events')}
        leadingItem={<Icon icon={faCalendarDay} size={fontSizes['2xl']} />}
      />
      <SwitchListItem
        disabled
        accessible={true}
        accessibilityLabel={`${t('notifications.presence')}. ${t(
          `common.activeStatus.${notifications?.presence}`,
        )} `}
        accessibilityRole="switch"
        title={t('notifications.reservationPresence')}
        value={notifications?.presence}
        onChange={onChangeNotification('presence')}
        leadingItem={<Icon icon={faCalendarCheck} size={fontSizes['2xl']} />}
      />
    </OverviewList>
  );
};

export const SettingsScreen = () => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { data: mfaStatus } = useCheckMfa(true);
  const { palettes } = useTheme();

  const [localMfaKey, setLocalMfaKey] = useState<boolean>(false);
  useEffect(() => {
    hasPrivateKeyMFA().then(res => setLocalMfaKey(res));
  }, [mfaStatus]);

  const handleKeyRemoval = useCallback(async () => {
    try {
      await resetPrivateKeyMFA();
      setLocalMfaKey(false);
      Alert.alert(
        t('mfaScreen.settings.removedTitle'),
        t('mfaScreen.settings.removed'),
        [{ text: t('common.ok') }],
      );
    } catch (error) {
      console.error('Error removing MFA key:', error);
    }
  }, [t]);

  const handleBadgeStatus = () => {
    if (mfaStatus?.status === 'active' && localMfaKey) {
      return (
        <Badge
          backgroundColor={palettes.success[500]}
          foregroundColor={palettes.text[100]}
          text={t('mfaScreen.settings.active')}
        />
      );
    }
    if (mfaStatus?.status === 'locked') {
      return (
        <Badge
          backgroundColor={palettes.warning[500]}
          foregroundColor={palettes.warning[100]}
          text={t('mfaScreen.settings.locked')}
        />
      );
    }
    if (
      mfaStatus?.status === 'available' ||
      mfaStatus?.status === 'needsReauth'
    ) {
      return (
        <Badge
          backgroundColor={palettes.warning[400]}
          foregroundColor={palettes.text[100]}
          text={t('mfaScreen.settings.disabled')}
        />
      );
    }
    return (
      <Badge
        backgroundColor={palettes.error[500]}
        foregroundColor={palettes.error[100]}
        text={t('common.error')}
      />
    );
  };

  useEffect(() => {
    if (
      (mfaStatus?.status === 'available' ||
        mfaStatus?.status === 'needsReauth') &&
      localMfaKey
    ) {
      handleKeyRemoval();
    }
  }, [mfaStatus?.status, localMfaKey, handleKeyRemoval]);

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <SafeAreaView>
        <View style={styles.container}>
          <Section>
            <SectionHeader title={t('common.theme')} />
            <OverviewList indented>
              <VisualizationListItem />
            </OverviewList>
          </Section>
          <Section>
            <SectionHeader title={t('common.language')} />
            <OverviewList indented>
              <LanguageListItem />
            </OverviewList>
          </Section>
          {/* <Section>
              <SectionHeader
                title={t('common.notifications')}
                trailingItem={<Badge text={t('common.comingSoon')} accessibility={accessibility} />}
              />
              <Notifications />
            </Section>*/}
          {mfaStatus?.status !== 'unavailable' && (
            <Section>
              <SectionHeader title={t('settingsScreen.securityTitle')} />
              <OverviewList indented>
                <ListItem
                  title={t('settingsScreen.authenticatorTitle')}
                  accessibilityRole="button"
                  linkTo={{
                    screen: 'MfaSettings',
                  }}
                  leadingItem={<Icon icon={faShieldHalved} size={20} />}
                  trailingItem={
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      {handleBadgeStatus()}
                      {Platform.OS === 'ios' && <DisclosureIndicator />}
                    </View>
                  }
                />
              </OverviewList>
            </Section>
          )}
          <Section>
            <SectionHeader title={t('common.accessibility')} />
            <OverviewList indented>
              <ListItem
                isAction
                title={t('accessibilitySettingsScreen.fontSettingsTitle')}
                accessibilityRole="button"
                linkTo={{ screen: 'AccessibilitySettings' }}
                leadingItem={<Icon icon={faFont} size={20} />}
              />
            </OverviewList>
          </Section>
          <Section>
            <SectionHeader title={t('common.cache')} />
            <OverviewList indented>
              <CleanCacheListItem />
            </OverviewList>
          </Section>
          <Col ph={4}>
            <Text>{t('settingsScreen.appVersion', { version })}</Text>
          </Col>
        </View>
        <BottomBarSpacer />
      </SafeAreaView>
    </ScrollView>
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    container: {
      paddingVertical: spacing[5],
    },
  });
