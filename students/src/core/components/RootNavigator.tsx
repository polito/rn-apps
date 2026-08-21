import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PixelRatio, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import {
  faBookOpen,
  faCircleInfo,
  faCompass,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { hideFromScreenReader, usePreferencesContext } from '@polito/lib/core';
import {
  PlacesNavigator,
  useGetCurrentCampus,
  useGetSites,
} from '@polito/lib/features/places';
import {
  HeaderLogo,
  Icon,
  Theme,
  TranslucentView,
  tabBarStyle,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { UnreadMessagesModal } from '~/features/user/screens/UnreadMessagesModal';

import { filterUnread } from '../../../src/utils/messages';
import { AgendaNavigator } from '../../features/agenda/components/AgendaNavigator';
import { ServicesNavigator } from '../../features/services/components/ServicesNavigator';
import { TeachingNavigator } from '../../features/teaching/components/TeachingNavigator';
import { UserNavigator } from '../../features/user/components/UserNavigator';
import { useApiContext } from '../contexts/ApiContext';
import { useDownloadsContext } from '../contexts/DownloadsContext';
import { useInitFirebaseMessaging } from '../hooks/messaging';
import { useAccessibility } from '../hooks/useAccessibilty';
import { useModalManager } from '../hooks/useModalManager';
import { useNotifications } from '../hooks/useNotifications';
import { useGetMessages, useGetStudent } from '../queries/studentHooks';
import { OnboardingModal } from '../screens/OnboardingModal';
import { RootParamList } from '../types/navigation';
import { AppPreferences } from '../types/preferences';
import { TabBarButton } from './TabBarButton';

const TabNavigator = createBottomTabNavigator<RootParamList>();
const androidTabBarHeight = 60;

export const RootNavigator = ({
  versionModalIsOpen,
}: {
  versionModalIsOpen?: boolean;
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { bottom } = useSafeAreaInsets();
  const styles = useStylesheet(createStyles);
  const { username } = useApiContext();
  const { syncLocalFilesToDb } = useDownloadsContext();
  const { data: student } = useGetStudent();
  const { updatePreference, accessibility } =
    usePreferencesContext<AppPreferences>();
  const { getUnreadsCount } = useNotifications();
  const { getBadgeAccessibilityLabel } = useAccessibility();
  const hasSyncedFiles = useRef(false);
  const campus = useGetCurrentCampus();
  const { data: sites } = useGetSites();
  const [tabBarIconSize, setTabBarIconSize] = useState(20);
  const { isOnboardingVisible, closeOnboarding } =
    useModalManager(versionModalIsOpen);
  const profileMessages = useGetMessages();

  useInitFirebaseMessaging();

  useEffect(() => {
    if (username && !hasSyncedFiles.current) {
      hasSyncedFiles.current = true;
      syncLocalFilesToDb().catch(() => {});
    }
  }, [username, syncLocalFilesToDb]);

  useEffect(() => {
    if (student && !campus && sites?.data?.length) {
      updatePreference('campusId', sites?.data[0].id);
    }
  }, [campus, sites?.data, student, updatePreference]);

  useEffect(() => {
    if (accessibility?.fontSize && accessibility.fontSize > 125) {
      setTabBarIconSize(accessibility.fontSize === 150 ? 30 : 40);
    } else {
      setTabBarIconSize(20);
    }
  }, [accessibility?.fontSize]);

  const instantAnimation = {
    animation: 'timing' as const,
    config: { duration: 0 },
  };

  const androidTabBarBottom = useMemo(
    () =>
      Platform.select({ android: { height: androidTabBarHeight + bottom } }),
    [bottom],
  );

  const teachingLabel = t('teachingScreen.title');
  const agendaLabel = t('agendaScreen.title');
  const placesLabel = t('placesScreen.title');
  const servicesLabel = t('common.services');
  const profileLabel = t('profileScreen.title');

  const teachingUnreadCount = getUnreadsCount(['teaching']) ?? 0;
  const servicesUnreadCount = getUnreadsCount(['services']) ?? 0;
  const profileUnreadCount = filterUnread(profileMessages.data || []).length;

  const renderTabIcon = (icon: typeof faBookOpen, color: string) => (
    <View {...hideFromScreenReader}>
      <Icon icon={icon} color={color} size={tabBarIconSize} />
    </View>
  );

  return (
    <>
      <TabNavigator.Navigator
        backBehavior="history"
        screenOptions={{
          tabBarShowLabel: !(
            (accessibility?.fontSize && accessibility.fontSize > 125) ||
            PixelRatio.getFontScale() >= 1.3
          ),
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarVisibilityAnimationConfig: {
            show: instantAnimation,
            hide: instantAnimation,
          },
          tabBarStyle: [styles.tabBarStyle, androidTabBarBottom],
          tabBarBackground: () => <TranslucentView fallbackOpacity={1} />,
          tabBarItemStyle: styles.tabBarItemStyle,
          tabBarLabelStyle: [styles.tabBarLabelStyle],
          tabBarInactiveTintColor: colors.tabBarInactive,
          tabBarBadgeStyle: styles.tabBarBadgeStyle,
          tabBarButton: props => <TabBarButton {...props} />,
        }}
      >
        <TabNavigator.Screen
          name="TeachingTab"
          component={TeachingNavigator}
          options={{
            tabBarLabel: teachingLabel,
            tabBarAccessibilityLabel: getBadgeAccessibilityLabel(
              teachingUnreadCount,
              teachingLabel,
            ),
            tabBarIcon: ({ color }) => renderTabIcon(faBookOpen, color),
            tabBarBadge: teachingUnreadCount || undefined,
          }}
        />
        <TabNavigator.Screen
          name="AgendaTab"
          component={AgendaNavigator}
          options={{
            tabBarLabel: agendaLabel,
            tabBarAccessibilityLabel: agendaLabel,
            tabBarIcon: ({ color }) => renderTabIcon(faCalendar, color),
          }}
        />
        <TabNavigator.Screen
          name="PlacesTab"
          options={{
            tabBarLabel: placesLabel,
            tabBarAccessibilityLabel: placesLabel,
            tabBarIcon: ({ color }) => renderTabIcon(faCompass, color),
          }}
        >
          {() => <PlacesNavigator unreadMessagesModal={UnreadMessagesModal} />}
        </TabNavigator.Screen>
        <TabNavigator.Screen
          name="ServicesTab"
          component={ServicesNavigator}
          options={{
            headerLeft: () => <HeaderLogo />,
            tabBarLabel: servicesLabel,
            tabBarAccessibilityLabel: getBadgeAccessibilityLabel(
              servicesUnreadCount,
              servicesLabel,
            ),
            tabBarIcon: ({ color }) => renderTabIcon(faCircleInfo, color),
            tabBarBadge: servicesUnreadCount || undefined,
          }}
        />
        <TabNavigator.Screen
          name="ProfileTab"
          component={UserNavigator}
          options={{
            tabBarLabel: profileLabel,
            tabBarAccessibilityLabel: getBadgeAccessibilityLabel(
              profileUnreadCount,
              profileLabel,
            ),
            tabBarIcon: ({ color }) => renderTabIcon(faUser, color),
            tabBarBadge: profileUnreadCount || undefined,
          }}
        />
      </TabNavigator.Navigator>
      <OnboardingModal
        visible={isOnboardingVisible}
        onClose={closeOnboarding}
      />
    </>
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
