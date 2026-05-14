import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useLayoutEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { faArrowLeft, faFont } from '@fortawesome/free-solid-svg-icons';
import { useOfflineDisabled, usePreferencesContext } from '@polito/lib/core';
import {
  Icon,
  IconButton,
  ListItem,
  SectionHeader,
  Select,
  Text,
  useTheme,
} from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppPreferences } from '~/core/types/preferences';

import i18next from 'i18next';
import { Settings } from 'luxon';

import { SectionList } from '../../core/components/SectionList';
import { ProfileStackParamList } from './ProfileNavigator';

// Componente Select per la lingua (rimane uguale)
const LanguageSelect = () => {
  const { t } = useTranslation();
  const { language, updatePreference } =
    usePreferencesContext<AppPreferences>();
  const isDisabled = useOfflineDisabled();

  const options = useMemo(() => {
    if (isDisabled) return [];
    return [
      { id: 'it', title: t('common.it') },
      { id: 'en', title: t('common.en') },
    ];
  }, [t, isDisabled]);

  const handleSelect = async (selectedId: string) => {
    if (selectedId !== 'it' && selectedId !== 'en') return;

    updatePreference('language', selectedId);

    try {
      await i18next.changeLanguage(selectedId);
      Settings.defaultLocale = selectedId;
    } catch (error) {
      console.error('Errore nel cambio lingua:', error);
    }
  };

  return (
    <Select
      label={t('common.language')}
      value={language}
      onSelectOption={handleSelect}
      options={options}
      disabled={isDisabled}
      accessibilityLabel={`${t('common.language')}: ${t(`common.${language}`)}`}
    />
  );
};

// Schermata delle Impostazioni con tema gestito dal contesto
export const SettingsScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { t } = useTranslation();
  const { spacing } = useTheme();

  // Prendo tema e updater dal context (NON locale)
  const { colorScheme, updatePreference } = usePreferencesContext();

  const handleThemeSelect = (selectedId: string) => {
    // Aggiorno la preferenza globale
    updatePreference('colorScheme', selectedId as 'light' | 'dark');
  };

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
      headerLeft: () => (
        <IconButton
          icon={faArrowLeft}
          size={22}
          onPress={() => navigation.goBack()}
        />
      ),
    });
  }, [navigation, t]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <SectionHeader title={t('common.theme')} />
        <SectionList>
          <Select
            label={t('common.theme')}
            value={colorScheme} // usa tema da context
            onSelectOption={handleThemeSelect}
            options={[
              { id: 'light', title: t('theme.light') },
              { id: 'dark', title: t('theme.dark') },
              { id: 'system', title: t('theme.system') }, // opzionale: se vuoi aggiungere tema system
            ]}
          />
        </SectionList>
        <View style={{ paddingBottom: spacing[5] }} />

        <SectionHeader title={t('common.language')} />
        <SectionList>
          <LanguageSelect />
        </SectionList>
        <View style={{ paddingBottom: spacing[5] }} />

        <SectionHeader title={t('common.accessibility')} />
        <SectionList>
          <ListItem
            isAction
            title={t('accessibilitySettingsScreen.fontSettingsTitle')}
            leadingItem={<Icon icon={faFont} size={20} />}
            onPress={() => {
              navigation.navigate('AccessibilitySettings');
            }}
          />
        </SectionList>
        <View style={{ paddingBottom: spacing[5] }} />

        <SectionHeader title={t('common.cache')} />
        <SectionList>
          <ListItem
            title={t('common.cleanCourseFiles')}
            onPress={() => {
              /* logica cache */
            }}
          />
        </SectionList>
        <View style={{ paddingBottom: spacing[5] }} />
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
    paddingTop: 10,
  },
});
