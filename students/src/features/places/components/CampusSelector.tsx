import { useTranslation } from 'react-i18next';

import { faChevronDown, faSchool } from '@fortawesome/free-solid-svg-icons';
import { usePreferencesContext } from '@polito/lib';
import { Icon } from '@polito/lib';
import { Row } from '@polito/lib';
import { StatefulMenuView } from '@polito/lib';
import { Text } from '@polito/lib';
import { useTheme } from '@polito/lib';

import { AppPreferences } from '~/core/types/preferences';

import { useGetSite, useGetSites } from '../../../core/queries/placesHooks';

export const CampusSelector = () => {
  const { t } = useTranslation();
  const { spacing, colors, fontSizes } = useTheme();
  const { data: sites } = useGetSites();
  const { campusId, updatePreference } =
    usePreferencesContext<AppPreferences>();
  const campus = useGetSite(campusId);

  return (
    <StatefulMenuView
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
      <Row align="center" mr={2} gap={0.5} style={{ maxWidth: '73%' }}>
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
