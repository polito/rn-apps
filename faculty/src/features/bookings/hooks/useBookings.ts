import { useCourses } from '../../../core/contexts/CoursesContext';

type Booking = ReturnType<typeof useCourses>['bookings'][number];

export const useBookings = () => {
  const {
    bookings,
    addBooking,
    updateBooking,
    removeBooking,
    selectedBooking,
    setSelectedBooking,
    user,
  } = useCourses();

  const isOwnBooking = (booking: Booking) =>
    !booking.ownerName || booking.ownerName === user.name;

  return {
    bookings,
    addBooking,
    updateBooking,
    removeBooking,
    selectedBooking,
    setSelectedBooking,
    user,
    isOwnBooking,
  };
};
