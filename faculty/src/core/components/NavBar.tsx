import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, TouchableWithoutFeedback, View } from 'react-native';

import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import {
  faBookOpen,
  faCircleInfo,
  faCompass,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  AgendaNavigator,
  AgendaStackParamList,
} from '../../screens/Agenda/AgendaNavigator';
import {
  PlacesNavigator,
  PlacesStackParamList,
} from '../../screens/Places/components/PlacesNavigator';
import { ProfileNavigator } from '../../screens/Profile/ProfileNavigator';
import { ServiceNavigator } from '../../screens/Servizi/ServiceNavigator';
import {
  TeachingNavigator,
  TeachingStackParamList,
} from '../../screens/Teaching/TeachingNavigator';
import { Icon } from '../../ui/components/Icon';

export type RootParamList = {
  Didattica: NavigatorScreenParams<TeachingStackParamList>;
  Agenda: NavigatorScreenParams<AgendaStackParamList>;
  Places: NavigatorScreenParams<PlacesStackParamList>;
  Services: undefined;
  Profile: undefined;
};
const TabsNav = createBottomTabNavigator<RootParamList>();

export const NavBar = () => {
  const { t } = useTranslation();
  const tabBarStyle: any = {
    position: Platform.select({ ios: 'absolute' }),
  };
  if (Platform.OS === 'ios') {
    tabBarStyle.height = 84;
  }

  const [isDID, setIsDID] = useState(true);

  const teachingNavigation =
    useNavigation<NativeStackNavigationProp<TeachingStackParamList>>();
  const bottomNavigation =
    useNavigation<BottomTabNavigationProp<RootParamList>>();
  const placesNavigation = useNavigation<BottomTabNavigationProp<any>>();
  return (
    <TabsNav.Navigator backBehavior="history">
      {isDID ? (
        <TabsNav.Screen
          name="Didattica"
          component={TeachingNavigator}
          options={{
            headerShown: false,
            tabBarLabel: t('teachingScreen.title'),
            tabBarIcon: ({ color }) => (
              <Icon icon={faBookOpen} color={color} size={20} />
            ),
            tabBarButton: props => (
              <TouchableWithoutFeedback
                onPress={() => {
                  setIsDID(true);
                  teachingNavigation.navigate('Incarichi');
                  // You can navigate to a specific screen or perform any action here
                }}
              >
                <View {...props} />
              </TouchableWithoutFeedback>
            ),
          }}
        />
      ) : (
        <TabsNav.Screen
          name="Didattica"
          component={TeachingNavigator}
          options={{
            headerShown: false,
            tabBarLabel: t('teachingScreen.title'),
            tabBarIcon: ({ color }) => (
              <Icon icon={faBookOpen} color={color} size={20} />
            ),
            tabBarButton: props => (
              <TouchableWithoutFeedback
                onPress={() => {
                  // Prima esegui il setIsDID(false)
                  setIsDID(true);

                  // Poi procedi con la navigazione
                  bottomNavigation.navigate({
                    name: 'Didattica',
                    params: { screen: 'Incarichi' },
                    merge: true,
                  }); // Se desideri navigare in modo esplicito
                }}
              >
                <View {...props} />
              </TouchableWithoutFeedback>
            ),
          }}
        />
      )}

      <TabsNav.Screen
        name="Agenda"
        component={AgendaNavigator}
        options={{
          headerShown: false,
          tabBarLabel: t('agendaScreen.title'),
          tabBarIcon: ({ color }) => (
            <Icon icon={faCalendar} color={color} size={20} />
          ),
          tabBarButton: props => (
            <TouchableWithoutFeedback
              onPress={() => {
                // Prima esegui il setIsDID(false)
                setIsDID(false);

                // Poi procedi con la navigazione
                bottomNavigation.navigate('Agenda', { screen: 'Agenda2' }); // Se desideri navigare in modo esplicito
              }}
            >
              <View {...props} />
            </TouchableWithoutFeedback>
          ),
        }}
      />

      <TabsNav.Screen
        name="Places"
        component={PlacesNavigator}
        options={{
          headerShown: false,
          tabBarLabel: t('other.places'),
          tabBarIcon: ({ color }) => (
            <Icon icon={faCompass} color={color} size={20} />
          ),
          tabBarButton: props => (
            <TouchableWithoutFeedback
              onPress={() => {
                // Prima esegui il setIsDID(false)
                setIsDID(false);

                // Poi procedi con la navigazione
                placesNavigation.navigate({
                  name: 'Places',
                  params: { screen: 'Places1' },
                  merge: true,
                }); // Se desideri navigare in modo esplicito
              }}
            >
              <View {...props} />
            </TouchableWithoutFeedback>
          ),
        }}
      />
      <TabsNav.Screen
        name="Services"
        component={ServiceNavigator}
        options={{
          headerShown: false,
          tabBarLabel: t('other.services'),
          tabBarIcon: ({ color }) => (
            <Icon icon={faCircleInfo} color={color} size={20} />
          ),
          tabBarButton: props => (
            <TouchableWithoutFeedback
              onPress={() => {
                // Prima esegui il setIsDID(false)
                setIsDID(false);

                // Poi procedi con la navigazione
                bottomNavigation.navigate('Services'); // Se desideri navigare in modo esplicito
              }}
            >
              <View {...props} />
            </TouchableWithoutFeedback>
          ),
        }}
      />
      <TabsNav.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          headerShown: false,
          tabBarLabel: t('other.profile'),
          tabBarIcon: ({ color }) => (
            <Icon icon={faUser} color={color} size={20} />
          ),
          tabBarButton: props => (
            <TouchableWithoutFeedback
              onPress={() => {
                // Prima esegui il setIsDID(false)
                setIsDID(false);

                // Poi procedi con la navigazione
                bottomNavigation.navigate('Profile'); // Se desideri navigare in modo esplicito
              }}
            >
              <View {...props} />
            </TouchableWithoutFeedback>
          ),
        }}
      />
    </TabsNav.Navigator>
  );
};

export type TabsNavigatorParamList = {
  Teaching: undefined;
};
