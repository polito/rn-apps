import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { faChevronDown, faSchool } from '@fortawesome/free-solid-svg-icons';
import { MenuComponentRef } from '@react-native-menu/menu';

import { hideFromScreenReader } from '../../../core/accessibility/hideFromScreenReader';
import { usePreferencesContext } from '../../../core/contexts/PreferencesContext';
import { Icon, Row, StatefulMenuView, Text } from '../../../ui/components';
import { useTheme } from '../../../ui/hooks/useTheme';
import { useGetSite, useGetSites } from '../queries/placesHooks';

export const CampusSelector = () => {
  const { t } = useTranslation();
  const { spacing, colors, fontSizes } = useTheme();
  const { data: sites } = useGetSites();
  const { campusId, updatePreference } = usePreferencesContext();
  const campus = useGetSite(campusId);
  const menuRef = useRef<MenuComponentRef>(null);

  return (
    <StatefulMenuView
      ref={menuRef}
      accessible
      accessibilityRole="button"
      accessibilityLabel={[t('common.campus'), campus?.name]
        .filter(Boolean)
        .join(', ')}
      accessibilityActions={[{ name: 'activate' }]}
      onAccessibilityAction={() => menuRef.current?.show()}
      title={t('common.campus')}
      onPressAction={({ nativeEvent: { event: newCampusId } }) => {
        updatePreference(
          'campusId',
          sites?.data?.find(s => s.id === newCampusId)?.id,
        );
      }}
      actions={
        sites?.data?.map(site => ({
          id: site.id,
          title: site.name,
          state: campusId === site.id ? 'on' : undefined,
        })) ?? []
      }
    >
      <Row
        align="center"
        mr={2}
        gap={0.5}
        style={{ maxWidth: '73%' }}
        {...hideFromScreenReader}
      >
        <Icon icon={faSchool} color={colors.link} />
        <Text
          variant="link"
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{ flexGrow: 1, flexShrink: 1, marginLeft: spacing[1] }}
        >
          {campus?.name ?? t('common.campus')}
        </Text>
        <Icon icon={faChevronDown} color={colors.link} size={fontSizes.xs} />
      </Row>
    </StatefulMenuView>
  );
};
