import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView } from 'react-native';

import { usePreferencesContext } from '@polito/lib/core';
import {
  BottomBarSpacer,
  Col,
  ListItem,
  OverviewList,
  Section,
  SectionHeader,
  SwitchListItem,
  Text,
} from '@polito/lib/ui';
import { MenuAction, MenuView } from '@react-native-menu/menu';

import { AppPreferences } from '~/core/types/preferences';

import { TFunction } from 'i18next';

interface AccessibilityItemProps {
  t: TFunction;
  value?: string;
  onUpdate: (event: any) => void;
}

export const AccessibilitySettingsScreen = () => {
  const { t } = useTranslation();
  const { accessibility, updatePreference } =
    usePreferencesContext<AppPreferences>();

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
                onUpdate={e => {
                  if (
                    Number(e) === 100 ||
                    Number(e) === 125 ||
                    Number(e) === 150 ||
                    Number(e) === 175 ||
                    Number(e) === 200
                  )
                    return updatePreference('accessibility', {
                      ...accessibility,
                      fontSize: e,
                    });
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
        accessibilityLabel={`${t('accessibilitySettingsScreen.customFontSizeTitle')}: ${effectiveLabel}`}
      />
    </MenuView>
  );
};
