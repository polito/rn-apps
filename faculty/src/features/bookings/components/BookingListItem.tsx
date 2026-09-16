import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import {
  DisclosureIndicator,
  ListItem,
  ScreenDateTime,
  Theme,
  useStylesheet,
} from '@polito/lib/ui';

import { useBookings } from '../hooks/useBookings';
import { formatBookingTitle } from '../utils/bookingStatus';
import { BookingStatusBadge } from './BookingStatusBadge';

interface Props {
  booking: ReturnType<typeof useBookings>['bookings'][number];
  onPress: () => void;
  showDisclosure?: boolean;
}

export const BookingListItem = ({
  booking,
  onPress,
  showDisclosure = false,
}: Props) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);

  return (
    <ListItem
      title={formatBookingTitle(booking.title, t)}
      titleStyle={styles.listTitle}
      subtitle={
        <View style={styles.dateTime}>
          <ScreenDateTime date={booking.date} time={booking.time} inListItem />
        </View>
      }
      onPress={onPress}
      trailingItem={
        <View style={styles.trailing}>
          <BookingStatusBadge status={booking.status} />
          {showDisclosure && <DisclosureIndicator />}
        </View>
      }
    />
  );
};

const createStyles = ({
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
}: Theme) =>
  StyleSheet.create({
    listTitle: {
      overflow: 'hidden',
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      lineHeight: 20,
      color: colors.title,
      marginBottom: spacing[1],
    },
    trailing: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[1],
    },
    dateTime: {
      alignSelf: 'flex-start',
      transform: [{ scale: 0.85 }],
      transformOrigin: 'left center',
    },
  });
