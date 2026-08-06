import { useCourses } from '../../../core/contexts/CoursesContext';

export const useBookings = () => {
  const {
    bookings,
    addBooking,
    removeBooking,
    selectedBooking,
    setSelectedBooking,
  } = useCourses();

  return {
    bookings,
    addBooking,
    removeBooking,
    selectedBooking,
    setSelectedBooking,
  };
};
