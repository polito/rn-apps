import { useLayoutEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, SafeAreaView, ScrollView } from 'react-native';

import { MenuAction, MenuView } from '@react-native-menu/menu';
import { useNavigation } from '@react-navigation/native';

import { TFunction } from 'i18next';

import { usePreferencesContext } from '../../core/contexts/PreferencesContext';
import { Accessibility } from '../../core/types/Accessibility';
import { BottomBarSpacer } from './BottomBarSpacer';
import { Col } from './Col';
import { ListItem } from './ListItem';
import { OverviewList } from './OverviewList';
import { Section } from './Section';
import { SectionHeader } from './SectionHeader';
import { SwitchListItem } from './SwitchListItem';
import { Text } from './Text';

interface AccessibilityItemProps {
  t: TFunction;
  value?: string;
  onUpdate: (event: string) => void;
}

const FONT_SIZE_CHOICES = [100, 125, 150, 175, 200] as const;

const isFontSizeChoice = (
  n: number,
): n is NonNullable<Accessibility['fontSize']> =>
  FONT_SIZE_CHOICES.includes(n as NonNullable<Accessibility['fontSize']>);

export const AccessibilitySettingsScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { accessibility, updatePreference } = usePreferencesContext();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t('accessibilitySettingsScreen.fontSettingsTitle'),
      ...(Platform.OS === 'ios' && {
        headerBackButtonDisplayMode: 'minimal',
      }),
    });
  }, [navigation, t]);

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <SafeAreaView>
        <Col pv={5}>
          <Section>
            <SectionHeader
              title={t('accessibilitySettingsScreen.customFontSectionTitle')}
            />
            <OverviewList indented>
              <SwitchListItem
                title={t('accessibilitySettingsScreen.lineHeightTitle')}
                subtitle={t('accessibilitySettingsScreen.lineHeightSubtitle')}
                value={accessibility?.lineHeight ?? false}
                onChange={value => {
                  updatePreference('accessibility', {
                    ...accessibility,
                    lineHeight: value,
                  });
                }}
              />
              <SwitchListItem
                title={t('accessibilitySettingsScreen.paragraphSpacingTitle')}
                subtitle={t(
                  'accessibilitySettingsScreen.paragraphSpacingSubtitle',
                )}
                value={accessibility?.paragraphSpacing ?? false}
                onChange={value => {
                  updatePreference('accessibility', {
                    ...accessibility,
                    paragraphSpacing: value,
                  });
                }}
              />
              <SwitchListItem
                title={t('accessibilitySettingsScreen.wordSpacingTitle')}
                subtitle={t('accessibilitySettingsScreen.wordSpacingSubtitle')}
                value={accessibility?.wordSpacing ?? false}
                onChange={value => {
                  updatePreference('accessibility', {
                    ...accessibility,
                    wordSpacing: value,
                  });
                }}
              />
              <CustomFontSizeListItem
                t={t}
                value={accessibility?.fontSize?.toString() ?? '100'}
                onUpdate={event => {
                  const n = Number(event);
                  if (isFontSizeChoice(n)) {
                    updatePreference('accessibility', {
                      ...accessibility,
                      fontSize: n,
                    });
                  }
                }}
              />
            </OverviewList>
          </Section>
          <Section>
            <SectionHeader
              title={t('accessibilitySettingsScreen.exampleText')}
            />
            <Text
              variant="longProse"
              style={{ marginTop: 10, paddingHorizontal: 16 }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat
            </Text>
            <Text
              variant="longProse"
              style={{ marginTop: 10, paddingHorizontal: 16 }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat
            </Text>
          </Section>
        </Col>
        <BottomBarSpacer />
      </SafeAreaView>
    </ScrollView>
  );
};

const CustomFontSizeListItem = ({
  t,
  value,
  onUpdate,
}: AccessibilityItemProps) => {
  const choices = useMemo(() => {
    return [
      {
        label: '100%',
        value: 100,
      },
      {
        label: '125%',
        value: 125,
      },
      {
        label: '150%',
        value: 150,
      },
      {
        label: '175%',
        value: 175,
      },
      {
        label: '200%',
        value: 200,
      },
    ];
  }, []);

  const effectiveValue = useMemo(() => {
    return value || '100';
  }, [value]);

  const effectiveLabel = useMemo(() => {
    return effectiveValue + '%';
  }, [effectiveValue]);

  const actions: MenuAction[] = useMemo(() => {
    return choices.map(cc => {
      const actionValue = cc.value === 100 ? '100' : cc.value.toString();
      return {
        id: actionValue,
        title: cc.label,
        state: actionValue === effectiveValue ? 'on' : undefined,
      };
    });
  }, [effectiveValue, choices]);
  return (
    <MenuView
      title={t(`accessibilitySettingsScreen.customFontSizeTitle`)}
      actions={actions}
      onPressAction={({ nativeEvent: { event } }) => {
        onUpdate(event);
      }}
    >
      <ListItem
        isAction
        title={t(`accessibilitySettingsScreen.customFontSizeTitle`)}
        subtitle={effectiveLabel}
      />
    </MenuView>
  );
};
