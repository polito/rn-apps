import { CommonActions } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ServiceStackParamList } from '../../services/components/ServicesNavigator';

export const exitToTicketsList = (
  navigation: NativeStackNavigationProp<ServiceStackParamList>,
) => {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'Tickets' }],
    }),
  );
};
