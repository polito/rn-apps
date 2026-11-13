import { ScrollView } from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { BookingSlotsLegendContent } from '../components/BookingSlotsLegendContent';
import { BookingsStackParamList } from '../types';

type Props = NativeStackScreenProps<
  BookingsStackParamList,
  'BookingSlotsLegend'
>;

export const BookingSlotsLegendScreen = (_: Props) => {
  return (
    <ScrollView>
      <BookingSlotsLegendContent />
    </ScrollView>
  );
};
