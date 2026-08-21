import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

import { faCalendarCheck } from '@fortawesome/free-regular-svg-icons';
import {
  faBroom,
  faCalendarDay,
  faCircleExclamation,
  faCircleHalfStroke,
  faFolderOpen,
  faFont,
  faShieldHalved,
} from '@fortawesome/free-solid-svg-icons';
import {
  PreferencesContextBase,
  hideFromScreenReader,
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
import { MenuComponentRef } from '@react-native-menu/menu';
import { useFocusEffect } from '@react-navigation/native';

import { useDownloadsContext } from '~/core/contexts/DownloadsContext';
import { getFileDatabase } from '~/core/database/FileDatabase';
import { useCheckMfa } from '~/core/queries/authHooks';
import { AppPreferences } from '~/core/types/preferences';
import { hasPrivateKeyMFA, resetPrivateKeyMFA } from '~/utils/keychain';

import i18next from 'i18next';
import { Settings } from 'luxon';

import { version } from '../../../../package.json';
import { useConfirmationDialog } from '../../../core/hooks/useConfirmationDialog';
import { useUpdateDevicePreferences } from '../../../core/queries/studentHooks';
import { formatFileSize } from '../../../utils/files';

const CleanCacheListItem = () => {
  const { t } = useTranslation();

  const { setFeedback } = useFeedbackContext();
  const { fontSizes } = useTheme();
  const {
    getCoursesCachePath,
    removeFileFromStorage,
    deleteLocalPath,
    cacheSizeVersion,
    refreshCacheVersion,
    isAnyDownloadInProgress,
  } = useDownloadsContext();
  const filesCache = getCoursesCachePath();
  const [cacheSize, setCacheSize] = useState<number>();
  const confirm = useConfirmationDialog({
    title: t('common.areYouSure?'),
    message: t('settingsScreen.cleanCacheConfirmMessage'),
  });
  const fileDatabaseRef = useRef(getFileDatabase());

  const refreshSize = useCallback(() => {
    fileDatabaseRef.current
      .getTotalSize()
      .then(size => {
        setCacheSize(size);
      })
      .catch(() => {
        setCacheSize(undefined);
      });
  }, []);

  useEffect(() => {
    refreshSize();
  }, [cacheSizeVersion, refreshSize]);

  useFocusEffect(
    useCallback(() => {
      refreshSize();
    }, [refreshSize]),
  );
  return (
    <ListItem
      isAction
      title={t('common.cleanCourseFiles')}
      subtitle={t('coursePreferencesScreen.cleanCourseFilesSubtitle', {
        size: cacheSize == null ? '-- MB' : formatFileSize(cacheSize),
      })}
      accessibilityRole="button"
      accessibilityState={{
        disabled:
          (cacheSize !== undefined && cacheSize === 0) ||
          isAnyDownloadInProgress,
      }}
      disabled={
        (cacheSize !== undefined && cacheSize === 0) || isAnyDownloadInProgress
      }
      leadingItem={<Icon icon={faBroom} size={fontSizes['2xl']} />}
      onPress={async () => {
        if (filesCache && (await confirm())) {
          try {
            const allFiles = await fileDatabaseRef.current.getAllFiles();
            await Promise.all(
              allFiles.map(f => removeFileFromStorage(f.path).catch(() => {})),
            );
            await fileDatabaseRef.current.deleteAllFiles();
            await deleteLocalPath(filesCache).catch(() => {});
            refreshCacheVersion();
            setFeedback({
              text: t('coursePreferencesScreen.cleanCacheFeedback'),
              isPersistent: false,
            });
            refreshSize();
          } catch {
            setFeedback({ text: t('common.error'), isPersistent: false });
          }
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
  const { colorScheme, updatePreference } =
    usePreferencesContext<AppPreferences>();
  const settingsColorScheme = useColorScheme();

  const menuRef = useRef<MenuComponentRef>(null);

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
      ref={menuRef}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${t('common.theme')}, ${t(`theme.${colorScheme}`)}`}
      accessibilityHint={t('settingsScreen.openThemeMenu')}
      accessibilityActions={[{ name: 'activate' }]}
      onAccessibilityAction={() => menuRef.current?.show()}
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
        {...hideFromScreenReader}
        title={t(`theme.${colorScheme}`)}
        isAction
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

  const menuRef = useRef<MenuComponentRef>(null);

  const choices = useMemo(() => {
    if (isDisabled) return [];

    return ['it', 'en'] as const;
  }, [isDisabled]);
  return (
    <StatefulMenuView
      ref={menuRef}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${t('common.language')}, ${t(`common.${language}`)}`}
      accessibilityHint={t('settingsScreen.openLanguageMenu')}
      accessibilityState={{ disabled: isDisabled }}
      accessibilityActions={[{ name: 'activate' }]}
      onAccessibilityAction={() => menuRef.current?.show()}
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
        {...hideFromScreenReader}
        isAction
        disabled={isDisabled}
        title={t(`common.${language}`)}
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

const StorageLocationListItem = () => {
  const { t } = useTranslation();
  const { fontSizes } = useTheme();
  const {
    fileStorageLocation,
    customStoragePath,
    customStorageDisplayPath,
    updatePreference,
  } = usePreferencesContext<AppPreferences>();
  const { setFeedback } = useFeedbackContext();
  const { pickStorageFolder, removeFileFromStorage } = useDownloadsContext();
  const [isMoving, setIsMoving] = useState(false);
  const currentLocation =
    fileStorageLocation === 'custom' ? 'custom' : 'internal';
  const confirmStorageChange = useConfirmationDialog({
    title: t('settingsScreen.storageChangeConfirmTitle'),
    message: t('settingsScreen.storageChangeConfirmMessage'),
  });

  const choices = useMemo(
    () => [
      { id: 'internal', title: t('settingsScreen.storageInternal') },
      { id: 'custom', title: t('settingsScreen.storageCustom') },
    ],
    [t],
  );

  const handlePickDirectory = useCallback(async () => {
    if (!(await confirmStorageChange())) return;
    try {
      const result = await pickStorageFolder();

      setIsMoving(true);
      setFeedback({ text: t('settingsScreen.storageChanging') });

      try {
        const fileDatabase = getFileDatabase();
        const allFiles = await fileDatabase.getAllFiles();
        await Promise.all(
          allFiles.map(f => removeFileFromStorage(f.path).catch(() => {})),
        );
        await fileDatabase.deleteAllFiles();
      } catch (deleteError) {
        console.error('Error removing files before switch:', deleteError);
      }

      updatePreference('customStoragePath', result.uri);
      updatePreference('customStorageDisplayPath', result.displayPath);
      updatePreference('fileStorageLocation', 'custom');
      setFeedback({ text: t('settingsScreen.storageCustomSet') });
    } catch (error: any) {
      if (error?.code !== 'CANCELLED') {
        console.error('Error picking directory:', error);
        setFeedback({ text: t('common.error'), isError: true });
      }
    } finally {
      setIsMoving(false);
    }
  }, [
    confirmStorageChange,
    updatePreference,
    setFeedback,
    t,
    pickStorageFolder,
    removeFileFromStorage,
  ]);

  const handleSwitchToInternal = useCallback(async () => {
    if (!customStoragePath) {
      updatePreference('fileStorageLocation', 'internal');
      return;
    }
    if (!(await confirmStorageChange())) return;

    setIsMoving(true);
    setFeedback({ text: t('settingsScreen.storageChanging') });

    try {
      const fileDatabase = getFileDatabase();
      const allFiles = await fileDatabase.getAllFiles();
      await Promise.all(
        allFiles.map(f => removeFileFromStorage(f.path).catch(() => {})),
      );
      await fileDatabase.deleteAllFiles();
    } catch (deleteError) {
      console.error('Error removing files before switch:', deleteError);
    } finally {
      setIsMoving(false);
    }

    updatePreference('fileStorageLocation', 'internal');
    setFeedback({ text: t('settingsScreen.storageInternalSet') });
  }, [
    customStoragePath,
    confirmStorageChange,
    updatePreference,
    setFeedback,
    t,
    removeFileFromStorage,
  ]);

  const handleChange = useCallback(
    async (newLocation: string) => {
      if (newLocation === currentLocation || isMoving) return;
      if (newLocation === 'custom') {
        await handlePickDirectory();
      } else {
        await handleSwitchToInternal();
      }
    },
    [currentLocation, isMoving, handlePickDirectory, handleSwitchToInternal],
  );

  const menuRef = useRef<MenuComponentRef>(null);

  const subtitle = useMemo(() => {
    if (currentLocation === 'custom' && customStorageDisplayPath) {
      return customStorageDisplayPath;
    }
    return currentLocation === 'custom'
      ? t('settingsScreen.storageCustomDescription')
      : t('settingsScreen.storageInternalDescription');
  }, [currentLocation, customStorageDisplayPath, t]);

  return (
    <StatefulMenuView
      ref={menuRef}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${t('settingsScreen.storageTitle')}, ${
        currentLocation === 'custom'
          ? t('settingsScreen.storageCustom')
          : t('settingsScreen.storageInternal')
      }`}
      accessibilityHint={t('settingsScreen.openStorageMenu')}
      accessibilityState={{ disabled: isMoving }}
      accessibilityActions={[{ name: 'activate' }]}
      onAccessibilityAction={() => menuRef.current?.show()}
      actions={choices.map(c => ({
        id: c.id,
        title: c.title,
        state: c.id === currentLocation ? 'on' : undefined,
      }))}
      onPressAction={({ nativeEvent: { event } }) => {
        handleChange(event);
      }}
    >
      <ListItem
        {...hideFromScreenReader}
        isAction
        disabled={isMoving}
        title={
          currentLocation === 'custom'
            ? t('settingsScreen.storageCustom')
            : t('settingsScreen.storageInternal')
        }
        subtitle={subtitle}
        leadingItem={<Icon icon={faFolderOpen} size={fontSizes['2xl']} />}
      />
    </StatefulMenuView>
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
                  accessibilityHint={t('common.tapToNavigate')}
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
          {Platform.OS === 'android' && (
            <Section>
              <SectionHeader title={t('settingsScreen.storageTitle')} />
              <OverviewList indented>
                <StorageLocationListItem />
              </OverviewList>
            </Section>
          )}
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
