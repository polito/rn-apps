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
import { bookingsColors } from '../utils/bookingsTheme';
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
        <ScreenDateTime date={booking.date} time={booking.time} inListItem />
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
  dark,
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
      color: dark ? colors.title : bookingsColors.textPrimary,
      marginBottom: spacing[1],
    },
    trailing: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[1],
    },
  });
