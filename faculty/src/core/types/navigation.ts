import { NavigatorScreenParams } from '@react-navigation/native';

import { type AgendaStackParamList } from '../../screens/Agenda/AgendaNavigator';
import { type ProfileStackParamList } from '../../screens/Profile/ProfileNavigator';
import { type ProfileStackParamList as ServiceStackParamList } from '../../screens/Servizi/ServiceNavigator';
import { type TeachingStackParamList } from '../../screens/Teaching/TeachingNavigator';

export type RootParamList = {
  TeachingTab: NavigatorScreenParams<TeachingStackParamList>;
  AgendaTab: NavigatorScreenParams<AgendaStackParamList>;
  PlacesTab: NavigatorScreenParams<never>;
  ServicesTab: NavigatorScreenParams<ServiceStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};
