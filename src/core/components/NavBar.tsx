import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { EmptyScreen } from '../../screens/EmptyScreen';
import { Animated, Platform, StyleProp, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import { getHeaderTitle } from '@react-navigation/elements';
 import { useTheme } from '../../ui/hooks/useTheme';
 import { Header } from './Header';
 import { TranslucentView } from './TranslucentView';
 import { Tab } from '../../ui/components/Tab';
 import { Tabs } from '../../ui/components/Tabs';
import { TeachingScreen } from '../../screens/Teaching/TeachingScreen';
import { TeachingNavigator, TeachingStackParamList } from '../../screens/Teaching/TeachingNavigator';
import { AgendaNavigator } from '../../screens/Agenda/AgendaNavigator';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import {
  faBookOpen,
  faCircleInfo,
  faCompass,
  faPerson,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { Icon } from '../../ui/components/Icon';
import { CommonActions, NavigatorScreenParams, useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { ProfileNavigator } from '../../screens/Profile/ProfileNavigator';
import { ServiceNavigator } from '../../screens/Servizi/ServiceNavigator';
import { PlacesNavigator } from '../../screens/Places/components/PlacesNavigator';
import { useTranslation } from 'react-i18next';



export type RootParamList = {
  Didattica: NavigatorScreenParams<TeachingStackParamList>;
  Agenda : undefined,
  Places : undefined,
  Services : undefined,
  Profile : undefined,
}
const TabsNav = createBottomTabNavigator<RootParamList>(); 


export const NavBar = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const tabBarStyle: any = {
    position: Platform.select({ ios: 'absolute' }),
  };
  if (Platform.OS === 'ios') {
    tabBarStyle.height = 84;
  }

  const [isDID,setIsDID] = useState(true)

  
 const navigation = useNavigation()
  return (


     <TabsNav.Navigator
     backBehavior='history'
     
     >
      {isDID ?  (<TabsNav.Screen
        name="Didattica"
        component={TeachingNavigator}
        options={{
          headerShown : false,
          tabBarLabel:t('teachingScreen.title'),
          tabBarIcon: ({ color, size }) => (
            <Icon icon={faBookOpen} color={color} size={20} />
          ),
          tabBarButton: (props) => (
            <TouchableWithoutFeedback
              onPress={() => {
                setIsDID(true)
                console.log("didattica button pressed")
               navigation.navigate('Incarichi')
                // You can navigate to a specific screen or perform any action here
              }}
            >
              <View {...props} />
            </TouchableWithoutFeedback>
          ),
        }}/>) :(
          <TabsNav.Screen
        name="Didattica"
        component={TeachingNavigator}
        options={{
          headerShown : false,
          tabBarLabel: t('teachingScreen.title'),
          tabBarIcon: ({ color, size }) => (
            <Icon icon={faBookOpen} color={color} size={20} />
          ),
          tabBarButton: (props) => (
            <TouchableWithoutFeedback
              onPress={() => {
                // Prima esegui il setIsDID(false)
                setIsDID(true);
      
                // Poi procedi con la navigazione
                navigation.navigate('Didattica');  // Se desideri navigare in modo esplicito
              }}
            >
              <View {...props} />
            </TouchableWithoutFeedback>
          ),
        }}/>
        )}
     
     <TabsNav.Screen
  name="Agenda"
  component={AgendaNavigator}
  options={{
    headerShown: false,
    tabBarLabel: t('agendaScreen.title'),
    tabBarIcon: ({ color, size }) => (
      <Icon icon={faCalendar} color={color} size={20} />
    ),
    tabBarButton: (props) => (
      <TouchableWithoutFeedback
        onPress={() => {
          // Prima esegui il setIsDID(false)
          setIsDID(false);

          // Poi procedi con la navigazione
          navigation.navigate('Agenda');  // Se desideri navigare in modo esplicito
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
          headerShown : false,
          tabBarLabel: t('other.places'),
          tabBarIcon: ({ color, size }) => (
            <Icon icon={faCompass} color={color} size={20} />
          ),
          tabBarButton: (props) => (
            <TouchableWithoutFeedback
              onPress={() => {
                // Prima esegui il setIsDID(false)
                setIsDID(false);
      
                // Poi procedi con la navigazione
                navigation.navigate({
  name: 'Places',
  params: {
    screen: 'Places1',
  },
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
        headerShown : false,
        tabBarLabel: t('other.services'),
        tabBarIcon: ({ color, size }) => (
          <Icon icon={faCircleInfo} color={color} size={20} />
        ),
        tabBarButton: (props) => (
          <TouchableWithoutFeedback
            onPress={() => {
              // Prima esegui il setIsDID(false)
              setIsDID(false);
    
              // Poi procedi con la navigazione
              navigation.navigate('Services');  // Se desideri navigare in modo esplicito
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
          headerShown : false,
          tabBarLabel: t('other.profile'),
          tabBarIcon: ({ color, size }) => (
            <Icon icon={faUser} color={color} size={20} />
          ),
          tabBarButton: (props) => (
            <TouchableWithoutFeedback
              onPress={() => {
                // Prima esegui il setIsDID(false)
                setIsDID(false);
      
                // Poi procedi con la navigazione
                navigation.navigate('Profile');  // Se desideri navigare in modo esplicito
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