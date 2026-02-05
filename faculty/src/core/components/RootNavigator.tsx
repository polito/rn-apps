import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import {
  faBookOpen,
  faCircleInfo,
  faCompass,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { usePreferencesContext, useSplashContext } from '@polito/lib/core';
import {
  PlacesNavigator,
  PlacesStackParamList,
  useGetCurrentCampus,
  useGetSites,
} from '@polito/lib/features/places';
import {
  Icon,
  Theme,
  TranslucentView,
  tabBarStyle,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
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
import { ProfileNavigator } from '../../screens/Profile/ProfileNavigator';
import { ServiceNavigator } from '../../screens/Servizi/ServiceNavigator';
import {
  TeachingNavigator,
  TeachingStackParamList,
} from '../../screens/Teaching/TeachingNavigator';
import { AppPreferences } from '../types/preferences';

export type RootParamList = {
  Didattica: NavigatorScreenParams<TeachingStackParamList>;
  Agenda: NavigatorScreenParams<AgendaStackParamList>;
  Places: NavigatorScreenParams<PlacesStackParamList>;
  Services: undefined;
  Profile: undefined;
};
const TabNavigator = createBottomTabNavigator<RootParamList>();
const androidTabBarHeight = 60;

export const RootNavigator = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { bottom } = useSafeAreaInsets();
  const styles = useStylesheet(createStyles);
  const { updatePreference } = usePreferencesContext<AppPreferences>();
  const campus = useGetCurrentCampus();
  const { data: sites } = useGetSites();
  const splashContext = useSplashContext();

  // TODO: move this step to ApiProvider when it will be created
  useEffect(() => {
    splashContext.setIsAppLoaded(true);
  }, [splashContext]);

  useEffect(() => {
    //TODO: check if user is logged (see reference in RootNavigator of students app)
    if (!campus && sites?.data?.length) {
      updatePreference('campusId', sites?.data[0].id);
    }
  }, [campus, sites?.data, updatePreference]);

  const [isDID, setIsDID] = useState(true);

  const teachingNavigation =
    useNavigation<NativeStackNavigationProp<TeachingStackParamList>>();
  const bottomNavigation =
    useNavigation<BottomTabNavigationProp<RootParamList>>();
  const placesNavigation = useNavigation<BottomTabNavigationProp<any>>();
  const androidTabBarBottom = useMemo(
    () =>
      Platform.select({ android: { height: androidTabBarHeight + bottom } }),
    [bottom],
  );
  return (
    <TabNavigator.Navigator
      backBehavior="history"
      screenOptions={{
        tabBarShowLabel: true,
        headerShown: false,
        tabBarHideOnKeyboard: true,
        // tabBarVisibilityAnimationConfig: {
        //   show: instantAnimation,
        //   hide: instantAnimation,
        // },
        tabBarStyle: [styles.tabBarStyle, androidTabBarBottom],
        tabBarBackground: () => <TranslucentView fallbackOpacity={1} />,
        tabBarItemStyle: styles.tabBarItemStyle,
        tabBarLabelStyle: [styles.tabBarLabelStyle],
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarBadgeStyle: styles.tabBarBadgeStyle,
      }}
    >
      {isDID ? (
        <TabNavigator.Screen
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
                <View style={props.style} testID={props.testID}>
                  {props.children}
                </View>
              </TouchableWithoutFeedback>
            ),
          }}
        />
      ) : (
        <TabNavigator.Screen
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
                <View style={props.style} testID={props.testID}>
                  {props.children}
                </View>
              </TouchableWithoutFeedback>
            ),
          }}
        />
      )}
      <TabNavigator.Screen
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
              <View style={props.style} testID={props.testID}>
                {props.children}
              </View>
            </TouchableWithoutFeedback>
          ),
        }}
      />

      <TabNavigator.Screen
        name="Places"
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
              <View style={props.style} testID={props.testID}>
                {props.children}
              </View>
            </TouchableWithoutFeedback>
          ),
        }}
      >
        {() => <PlacesNavigator unreadMessagesModal={View} />}
      </TabNavigator.Screen>
      <TabNavigator.Screen
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
              <View style={props.style} testID={props.testID}>
                {props.children}
              </View>
            </TouchableWithoutFeedback>
          ),
        }}
      />
      <TabNavigator.Screen
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
              <View style={props.style} testID={props.testID}>
                {props.children}
              </View>
            </TouchableWithoutFeedback>
          ),
        }}
      />
    </TabNavigator.Navigator>
  );
};

const createStyles = ({
  colors,
  palettes,
  fontFamilies,
  fontWeights,
  fontSizes,
}: Theme) =>
  StyleSheet.create({
    tabBarStyle: {
      ...tabBarStyle,
      position: 'absolute',
      borderTopColor: colors.divider,
    },
    tabBarItemStyle: {
      paddingVertical: 3,
    },
    // Theme-independent hardcoded color
    // eslint-disable-next-line react-native/no-color-literals
    tabBarBadgeStyle: {
      backgroundColor: palettes.rose[600],
      color: 'white',
      top: -2,
      fontFamily: fontFamilies.body,
      fontWeight: fontWeights.semibold,
      fontSize: fontSizes.sm,
    },
    tabBarLabelStyle: {
      width: 'auto',
    },
  });
