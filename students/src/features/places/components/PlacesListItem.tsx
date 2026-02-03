import { useTranslation } from 'react-i18next';

import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { PlaceRef } from '@polito/api-client';
import { notNullish } from '@polito/lib';
import { Icon } from '@polito/lib';
import { ListItem } from '@polito/lib';
import { useTheme } from '@polito/lib';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AgendaNavigatorID } from '~/features/agenda/components/AgendaNavigator';
import { TeachingNavigatorID } from '~/features/teaching/components/TeachingNavigator';

type Props = {
  eventName: string;
  places: PlaceRef[] | undefined;
};
export const PlacesListItem = ({ places, eventName }: Props) => {
  const { fontSizes } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const { t } = useTranslation();

  if (places === undefined) {
    return null;
  }

  const placeIds = places
    ?.map(p => {
      return p.buildingId && p.floorId && p.roomId
        ? [p.buildingId, p.floorId, p.roomId].join('-')
        : null;
    })
    .filter(notNullish) as string[] | null;

  return (
    <ListItem
      leadingItem={<Icon icon={faLocationDot} size={fontSizes['2xl']} />}
      title={
        places.length > 0
          ? places.map(p => p.name).join(', ')
          : t('examScreen.noLocation')
      }
      subtitle={t('examScreen.location')}
      isAction={!!placeIds?.length}
      onPress={
        placeIds?.length
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
