import { StyleSheet } from 'react-native';

import { faCalendar, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import {
  ActivityIndicator,
  Icon,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';

import { DateTime } from 'luxon';

interface EventInfoProps {
  item: {
    type: 'single' | 'recurrence';
    day: string | number;
    room?: string;
  };
  place?: { room: { name: string } };
  placeLoading?: boolean;
}

export const EventInfo = ({ item, place, placeLoading }: EventInfoProps) => {
  const styles = useStylesheet(createStyles);
  const { colors, fontSizes } = useTheme();

  if (placeLoading) {
    return <ActivityIndicator size="small" />;
  }

  if (!item.room || !place) {
    return null;
  }

  return (
    <Text style={styles.label} numberOfLines={1} ellipsizeMode="tail">
      {item.type === 'single' && (
        <>
          <Icon
            icon={faCalendar}
            color={colors.secondaryText}
            size={fontSizes.sm}
          />{' '}
          {DateTime.fromISO(item.day as string)
            .setZone('local')
            .toFormat('dd/MM/yyyy')}
          {'  '}
        </>
      )}
      <Icon
        icon={faLocationDot}
        color={colors.secondaryText}
        size={fontSizes.sm}
      />{' '}
      {place.room.name}
    </Text>
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    label: {
      marginTop: spacing[1.5],
    },
  });
