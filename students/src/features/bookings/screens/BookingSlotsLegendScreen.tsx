import { ScrollView } from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ServiceStackParamList } from '../../services/components/ServicesNavigator';
import { BookingSlotsLegendContent } from '../components/BookingSlotsLegendContent';

type Props = NativeStackScreenProps<
  ServiceStackParamList,
  'BookingSlotsLegend'
>;

export const BookingSlotsLegendScreen = (_: Props) => {
  return (
    <ScrollView>
      <BookingSlotsLegendContent />
    </ScrollView>
  );
};
