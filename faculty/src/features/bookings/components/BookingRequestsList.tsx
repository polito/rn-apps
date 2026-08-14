import { FlatList, StyleSheet } from 'react-native';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  BottomBarSpacer,
  CtaButton,
  IndentedDivider,
  useBottomBarAwareStyles,
  useSafeAreaSpacing,
} from '@polito/lib/ui';

import { useBookings } from '../hooks/useBookings';
import { BookingListItem } from './BookingListItem';

interface Props {
  bookings: ReturnType<typeof useBookings>['bookings'];
  onItemPress: (booking: ReturnType<typeof useBookings>['bookings'][number]) => void;
  ctaTitle: string;
  onCtaPress: () => void;
}

export const BookingRequestsList = ({
  bookings,
  onItemPress,
  ctaTitle,
  onCtaPress,
}: Props) => {
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const { paddingHorizontal } = useSafeAreaSpacing();

  return (
    <>
      <FlatList
        data={bookings}
        style={styles.list}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={[bottomBarAwareStyles, paddingHorizontal]}
        contentInsetAdjustmentBehavior="automatic"
        ItemSeparatorComponent={IndentedDivider}
        renderItem={({ item }) => (
          <BookingListItem
            booking={item}
            onPress={() => onItemPress(item)}
          />
        )}
        ListFooterComponent={BottomBarSpacer}
      />

      <CtaButton
        title={ctaTitle}
        action={onCtaPress}
        absolute={false}
        variant="filled"
        icon={faPlus}
      />
    </>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
});
