import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { PlaceRef } from '@polito/student-api-client';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  AgendaNavigatorID,
  TeachingNavigatorID,
} from '../../../core/constants';
import { notNullish } from '../../../core/utils/predicates';
import { Icon, ListItem } from '../../../ui/components';
import { useTheme } from '../../../ui/hooks/useTheme';

type Props = {
  eventName: string;
  places: PlaceRef[] | undefined;
};

export const PlacesListItem = ({ places, eventName }: Props) => {
  const { fontSizes } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { t } = useTranslation();

  const placeIds = useMemo(
    () =>
      places
        ?.map(p =>
          p.buildingId && p.floorId && p.roomId
            ? [p.buildingId, p.floorId, p.roomId].join('-')
            : null,
        )
        .filter(notNullish) as string[] | undefined,
    [places],
  );

  const locationTitle = useMemo(
    () =>
      places && places.length > 0
        ? places.map(p => p.name).join(', ')
        : t('examScreen.noLocation'),
    [places, t],
  );

  const isNavigable = Boolean(placeIds?.length);

  const accessibilityLabel = useMemo(
    () => [t('examScreen.location'), locationTitle].join(', '),
    [locationTitle, t],
  );

  if (places === undefined) {
    return null;
  }

  return (
    <ListItem
      leadingItem={<Icon icon={faLocationDot} size={fontSizes['2xl']} />}
      title={locationTitle}
      subtitle={t('examScreen.location')}
      accessibilityRole={isNavigable ? 'button' : 'none'}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={isNavigable ? t('common.locationHint') : undefined}
      accessibilityState={{ disabled: !isNavigable }}
      isAction={isNavigable}
      onPress={
        isNavigable
          ? () => {
              if (navigation.getId() === AgendaNavigatorID) {
                navigation.navigate('PlacesAgendaStack', {
                  screen: 'EventPlaces',
                  params: {
                    placeIds,
                    eventName,
                    isCrossNavigation: true,
                  },
                });
              } else if (navigation.getId() === TeachingNavigatorID) {
                navigation.navigate('PlacesTeachingStack', {
                  screen: 'EventPlaces',
                  params: {
                    placeIds,
                    eventName,
                    isCrossNavigation: true,
                  },
                });
              }
            }
          : undefined
      }
    />
  );
};
