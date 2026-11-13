import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, StyleSheet } from 'react-native';

import {
  faBell,
  faCircleInfo,
  faGear,
  faPersonThroughWindow,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { useOfflineDisabled, usePreferencesContext } from '@polito/lib/core';
import { useLogout } from '@polito/lib/features/auth';
import {
  Icon,
  ListItem,
  OverviewList,
  RefreshControl,
  Section,
  SectionHeader,
  Text,
  Theme,
  useBottomBarAwareStyles,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Logo } from '../../core/components/Logo';
import { useMfaChallengeHandler } from '../../core/hooks/useMfaChallengeHandler';
import { ProfileStackParamList } from './ProfileNavigator';

export const ProfileScreen = () => {
  const { t } = useTranslation();
  const { fontSizes, palettes } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const styles = useStylesheet(createStyles);
  const { username } = usePreferencesContext();
  const { mutate: handleLogout } = useLogout();
  const isOffline = useOfflineDisabled();
  const mfaChallengeQuery = useMfaChallengeHandler();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t('other.profile'),
      headerLeft: () => <Logo />,
      headerRight: () =>
        username ? (
          <Text
            variant="link"
            accessibilityLabel={`${t('common.username')}: ${username}`}
          >
            {username}
          </Text>
        ) : null,
    });
  }, [navigation, t, username]);

  const menuItems = [
    { title: t('other.personalInfo'), icon: faUser, screen: 'PersonalInfo' },
    { title: t('other.settings'), icon: faGear, screen: 'Settings' },
    { title: t('appInfoScreen.title'), icon: faCircleInfo, screen: 'AppInfo' },
    {
      title: t('common.notifications'),
      icon: faBell,
      screen: 'Notifications',
    },
  ] as const;

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={bottomBarAwareStyles}
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={<RefreshControl manual queries={[mfaChallengeQuery]} />}
    >
      <Image
        source={require('../../core/contexts/smartcard.png')}
        style={styles.smartcardImage}
        resizeMode="contain"
      />
      <Section>
        <SectionHeader title={t('other.general')} />
        <OverviewList indented>
          {menuItems.map(item => (
            <ListItem
              key={item.screen}
              isAction
              title={item.title}
              leadingItem={<Icon icon={item.icon} size={fontSizes.xl} />}
              onPress={() => navigation.navigate(item.screen)}
            />
          ))}
        </OverviewList>
      </Section>

      <Section>
        <OverviewList indented>
          <ListItem
            title={t('common.logout')}
            leadingItem={
              <Icon
                icon={faPersonThroughWindow}
                size={fontSizes.xl}
                color={palettes.danger[700]}
              />
            }
            titleStyle={{ color: palettes.danger[700] }}
            onPress={() => handleLogout()}
            disabled={isOffline}
          />
        </OverviewList>
      </Section>
    </ScrollView>
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    smartcardImage: {
      width: '100%',
      height: 207,
      marginTop: spacing[5],
      marginBottom: spacing[5],
      alignSelf: 'center',
    },
  });
