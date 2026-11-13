import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, View } from 'react-native';

import { faLocation } from '@fortawesome/free-solid-svg-icons';
import {
  useConfirmationDialog,
  useFeedbackContext,
  useOfflineDisabled,
  useOpenInAppLink,
} from '@polito/lib/core';
import {
  BookingDateTime,
  canBeCancelled,
  useDeleteBooking,
  useGetBookings,
} from '@polito/lib/features/bookings';
import {
  BottomBarSpacer,
  CtaButton,
  CtaButtonContainer,
  Icon,
  ListItem,
  OverviewList,
  RefreshControl,
  ScreenTitle,
  Text,
  faSeat,
  useTheme,
} from '@polito/lib/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ProfileStackParamList } from './ServiceNavigator';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Booking'>;

export const BookingDetailScreen = ({ navigation, route }: Props) => {
  const { id } = route.params;
  const { t } = useTranslation();
  const { colors, spacing } = useTheme();
  const { setFeedback } = useFeedbackContext();
  const isDisabled = useOfflineDisabled();
  const openInAppLink = useOpenInAppLink();
  const bookingsQuery = useGetBookings();
  const deleteBookingMutation = useDeleteBooking(id);
  const confirmCancel = useConfirmationDialog({
    title: t('bookingScreen.cancelBooking'),
    message: t('bookingScreen.cancelBookingText'),
  });
  const booking = bookingsQuery.data?.find(b => b.id === id);
  const location = booking?.location;
  const seat = booking?.seat;
  const seatId = seat?.id;
  const seatLabel = seat ? `${seat.row}${seat.column}` : '';

  const onPressDelete = async () => {
    if (await confirmCancel()) {
      return deleteBookingMutation
        .mutateAsync()
        .then(() => navigation.goBack())
        .then(() => setFeedback({ text: t('bookingScreen.cancelFeedback') }));
    }
  };

  return (
    <>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={<RefreshControl manual queries={[bookingsQuery]} />}
      >
        <SafeAreaView>
          <View style={{ padding: spacing[5] }} accessible>
            <ScreenTitle
              style={{ marginBottom: spacing[2] }}
              title={booking?.description || booking?.topic.title || ''}
            />
            {!!booking?.subtopic?.title && (
              <Text variant="caption" style={{ marginBottom: spacing[1] }}>
                {booking.subtopic.title}
              </Text>
            )}
            <BookingDateTime accessible={true} booking={booking} />
          </View>
          <OverviewList>
            {!!location?.name && (
              <ListItem
                isAction={location.type === 'virtualPlace'}
                accessibilityRole={
                  location.type === 'virtualPlace' ? 'link' : 'text'
                }
                accessibilityLabel={[
                  t(`bookingScreen.locationType.${location.type}`),
                  location.name,
                ].join(', ')}
                leadingItem={
                  <Icon
                    icon={faLocation}
                    size={20}
                    color={colors.secondaryText}
                    style={{ marginRight: spacing[2] }}
                  />
                }
                title={location.name}
                subtitle={t(`bookingScreen.locationType.${location.type}`)}
                onPress={
                  location.type === 'virtualPlace'
                    ? () => openInAppLink(location.url)
                    : undefined
                }
              />
            )}
            {!!booking && !!seatId && (
              <ListItem
                isAction
                accessibilityRole="button"
                accessibilityLabel={[t('common.seat'), seatLabel].join(', ')}
                leadingItem={
                  <Icon
                    icon={faSeat}
                    size={20}
                    color={colors.secondaryText}
                    style={{ marginRight: spacing[2] }}
                  />
                }
                title={seatLabel}
                subtitle={t('common.seat')}
                onPress={() =>
                  navigation.navigate('BookingSeat', {
                    bookingId: booking.id,
                    slotId: String(booking.id),
                    seatId,
                    topicId: booking.subtopic?.id || booking.topic.id,
                  })
                }
              />
            )}
          </OverviewList>
        </SafeAreaView>
      </ScrollView>
      {canBeCancelled(booking) && (
        <>
          <CtaButtonContainer absolute={false}>
            <CtaButton
              title={t('bookingScreen.cancelBooking')}
              action={onPressDelete}
              loading={deleteBookingMutation.isPending}
              absolute={false}
              disabled={isDisabled || deleteBookingMutation.isPending}
              destructive={true}
              containerStyle={{ paddingVertical: 0 }}
            />
          </CtaButtonContainer>
          <BottomBarSpacer />
        </>
      )}
    </>
  );
};
