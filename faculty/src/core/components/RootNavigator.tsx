import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  BottomTabBarButtonProps,
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
  NavigatorScreenParams,
  getFocusedRouteNameFromRoute,
  useNavigation,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ProfileNavigator } from '../../screens/Profile/ProfileNavigator';
import { ServiceNavigator } from '../../screens/Servizi/ServiceNavigator';
import {
  TeachingNavigator,
  TeachingStackParamList,
} from '../../screens/Teaching/TeachingNavigator';
import { AppPreferences } from '../types/preferences';

export type RootParamList = {
  Didattica: NavigatorScreenParams<TeachingStackParamList>;
  Places: NavigatorScreenParams<PlacesStackParamList>;
  Services: undefined;
  Profile: undefined;
};
const TabNavigator = createBottomTabNavigator<RootParamList>();
const androidTabBarHeight = 60;

const HIDDEN_TAB_BAR_ROUTES = new Set([
  'CalendarioSpaziStrutture',
  'VistaCalendarioSpazio',
]);

const TabBarButton = ({
  children,
  style,
  testID,
  onPress,
}: BottomTabBarButtonProps & { onPress: () => void }) => (
  <Pressable onPress={onPress} style={[style, { flex: 1 }]} testID={testID}>
    {children}
  </Pressable>
);

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
              <TabBarButton
                {...props}
                onPress={() => {
                  setIsDID(true);
                  teachingNavigation.navigate('Roles');
                }}
              />
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
              <TabBarButton
                {...props}
                onPress={() => {
                  setIsDID(true);
                  bottomNavigation.navigate({
                    name: 'Didattica',
                    params: { screen: 'Roles' },
                    merge: true,
                  });
                }}
              />
            ),
          }}
        />
      )}
      <TabNavigator.Screen
        name="Places"
        options={{
          headerShown: false,
          tabBarLabel: t('other.places'),
          tabBarIcon: ({ color }) => (
            <Icon icon={faCompass} color={color} size={20} />
          ),
          tabBarButton: props => (
            <TabBarButton
              {...props}
              onPress={() => {
                setIsDID(false);
                placesNavigation.navigate({
                  name: 'Places',
                  params: { screen: 'Places1' },
                  merge: true,
                });
              }}
            />
          ),
        }}
      >
        {() => <PlacesNavigator unreadMessagesModal={View} />}
      </TabNavigator.Screen>
      <TabNavigator.Screen
        name="Services"
        component={ServiceNavigator}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'Servizi';
          const hideTabBar = HIDDEN_TAB_BAR_ROUTES.has(routeName);

          return {
            headerShown: false,
            tabBarLabel: t('other.services'),
            tabBarIcon: ({ color }) => (
              <Icon icon={faCircleInfo} color={color} size={20} />
            ),
            tabBarStyle: hideTabBar
              ? { display: 'none' }
              : [styles.tabBarStyle, androidTabBarBottom],
            tabBarButton: props => (
              <TabBarButton
                {...props}
                onPress={() => {
                  setIsDID(false);
                  bottomNavigation.navigate('Services');
                }}
              />
            ),
          };
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
            <TabBarButton
              {...props}
              onPress={() => {
                setIsDID(false);
                bottomNavigation.navigate('Profile');
              }}
            />
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
      justifyContent: 'space-around',
    },
    tabBarItemStyle: {
      flex: 1,
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
      textAlign: 'center',
    },
  });
