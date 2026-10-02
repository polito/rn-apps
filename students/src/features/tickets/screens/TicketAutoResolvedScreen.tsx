import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ServiceStackParamList } from '../../services/components/ServicesNavigator';
import { TicketAutoResolved } from '../components/TicketAutoResolved';
import { exitToTicketsList } from '../utils/exitToTicketsList';

type Props = NativeStackScreenProps<
  ServiceStackParamList,
  'TicketAutoResolved'
>;

export const TicketAutoResolvedScreen = ({ navigation }: Props) => (
  <TicketAutoResolved onClose={() => exitToTicketsList(navigation)} />
);
