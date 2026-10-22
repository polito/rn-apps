import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { Platform } from 'react-native';

import {
  faEnvelope,
  faGear,
  faLock,
  faPersonThroughWindow,
} from '@fortawesome/free-solid-svg-icons';
import { faBell, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { useOfflineDisabled } from '@polito/lib/core';
import { useLogout } from '@polito/lib/features/auth';
import {
  Icon,
  IconButton,
  ListItem,
  OverviewList,
  Row,
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
import { useCourses } from '../../core/contexts/CoursesContext';
import { ProfileStackParamList } from './ProfileNavigator';
import { PublicationListItem } from './PublicationsScreen';

const MAX_PUBLICATIONS_PREVIEW = 3;

export const ProfileScreen = () => {
  const { t } = useTranslation();
  const { spacing, colors, fontSizes, palettes } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const styles = useStylesheet(createStyles);
  const { user } = useCourses();
  const { mutate: handleLogout } = useLogout();
  const isOffline = useOfflineDisabled();
  const publications = user.publications ?? [];
  const visiblePublications = publications.slice(0, MAX_PUBLICATIONS_PREVIEW);
  const publicationsMoreCount = Math.max(
    0,
    publications.length - MAX_PUBLICATIONS_PREVIEW,
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <Logo />,
      headerTitle: () => (
        <Text
          variant="heading"
          style={{
            textAlign: 'center',
            width: '100%',
            marginLeft: Platform.OS === 'android' ? 25 : 55,
          }}
        >
          {t('other.profile')}
        </Text>
      ),
      headerRight: () => (
        <Row>
          <View style={{ width: fontSizes.lg + spacing[6] }} />

          <IconButton
            icon={faPenToSquare}
            color={colors.link}
            size={fontSizes.lg}
            accessibilityLabel={t('common.preferences')}
            hitSlop={{ left: spacing[3], right: spacing[3] }}
            onPress={() => navigation.navigate('ProfileForm')}
          />

          <IconButton
            icon={faBell}
            color={colors.link}
            size={fontSizes.lg}
            accessibilityLabel={t('common.preferences')}
            hitSlop={{ left: spacing[3], right: spacing[3] }}
          />
        </Row>
      ),
    });
  }, [navigation, t, colors, fontSizes, spacing]);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={bottomBarAwareStyles}
      contentInsetAdjustmentBehavior="automatic"
      bounces={false}
    >
      <Image
        source={require('../../core/contexts/smartcard.png')}
        style={styles.smartcardImage}
        resizeMode="contain"
      />
      <Section>
        <SectionHeader title={t('other.general')} />
        <OverviewList indented>
          <ListItem
            isAction
            title={t('other.personalInfo')}
            leadingItem={<Icon icon={faLock} size={fontSizes.xl} />}
            onPress={() => {
              navigation.navigate('PersonalInfo');
            }}
          />
          <ListItem
            isAction
            title={t('contactsScreen.title')}
            leadingItem={<Icon icon={faEnvelope} size={fontSizes.xl} />}
            onPress={() => {
              navigation.navigate('Contacts');
            }}
          />
          <ListItem
            isAction
            title={t('other.settings')}
            leadingItem={<Icon icon={faGear} size={fontSizes.xl} />}
            onPress={() => {
              navigation.navigate('Settings');
            }}
          />
          <ListItem
            isAction
            title={t('common.notifications')}
            leadingItem={<Icon icon={faBell} size={fontSizes.xl} />}
            onPress={() => {
              navigation.navigate('Notifications');
            }}
          />
        </OverviewList>
      </Section>

      {publications.length > 0 && (
        <Section>
          <SectionHeader
            title={t('other.publications')}
            {...(publicationsMoreCount > 0
              ? {
                  linkTo: { screen: 'Publications' } as const,
                  linkToMoreCount: publicationsMoreCount,
                }
              : {})}
          />
          <OverviewList indented>
            {visiblePublications.map((pub, index) => (
              <PublicationListItem key={index} title={pub} />
            ))}
          </OverviewList>
        </Section>
      )}

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
