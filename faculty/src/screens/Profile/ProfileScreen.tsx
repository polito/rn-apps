import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { Platform } from 'react-native';

import {
  faEnvelope,
  faFileAlt,
  faGear,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import { faBell, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Icon } from '../../../../lib/src/ui/components/Icon';
import { IconButton } from '../../../../lib/src/ui/components/IconButton';
import { ListItem } from '../../../../lib/src/ui/components/ListItem';
import { Row } from '../../../../lib/src/ui/components/Row';
import { SectionHeader } from '../../../../lib/src/ui/components/SectionHeader';
import { Text } from '../../../../lib/src/ui/components/Text';
import { useBottomBarAwareStyles } from '../../../../lib/src/ui/hooks/useBottomBarAwareStyles';
import { useStylesheet } from '../../../../lib/src/ui/hooks/useStylesheet';
import { useTheme } from '../../../../lib/src/ui/hooks/useTheme';
import { Theme } from '../../../../lib/src/ui/types/Theme';
import { Logo } from '../../core/components/Logo';
import { SectionList } from '../../core/components/SectionList';
import { useCourses } from '../../core/contexts/CoursesContext';
import { ProfileStackParamList } from './ProfileNavigator';

const MAX_PUBLICATIONS_PREVIEW = 3;

export const ProfileScreen = () => {
  const { t } = useTranslation();
  const { spacing, colors } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const styles = useStylesheet(createStyles);
  const { fontSizes } = useTheme();
  const { user } = useCourses();
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
      <Text variant="title" style={styles.heading}>
        {' '}
        {user.name}{' '}
      </Text>
      <View style={{ paddingBottom: spacing[5] }} />
      <SectionHeader title="Smartcard" />
      <Image
        source={require('../../core/contexts/smartcard.png')}
        style={styles.smartcardImage}
        resizeMode="contain"
      />
      <View style={{ paddingBottom: spacing[5] }} />
      <SectionHeader title={t('other.personalInfo')} />
      <SectionList>
        <ListItem
          title={t('other.personalInfo')}
          leadingItem={<Icon icon={faLock} size={fontSizes.xl} />}
          onPress={() => {
            navigation.navigate('PersonalInfo');
          }}
        />
        <ListItem
          title={t('contactsScreen.title')}
          leadingItem={<Icon icon={faEnvelope} size={fontSizes.xl} />}
          onPress={() => {
            navigation.navigate('Contacts');
          }}
        />
        <ListItem
          title={t('common.notifications')}
          leadingItem={<Icon icon={faBell} size={fontSizes.xl} />}
          onPress={() => {
            navigation.navigate('Notifications');
          }}
        />
      </SectionList>

      {publications.length > 0 && (
        <>
          <SectionHeader
            title={t('other.publications')}
            {...(publicationsMoreCount > 0
              ? {
                  linkTo: { screen: 'Publications' } as const,
                  linkToMoreCount: publicationsMoreCount,
                }
              : {})}
          />
          <SectionList>
            {visiblePublications.map((pub, index) => (
              <ListItem
                key={index}
                title={pub}
                leadingItem={<Icon icon={faFileAlt} size={fontSizes.xl} />}
                multilineTitle={true}
              />
            ))}
          </SectionList>
        </>
      )}
      <View style={{ paddingBottom: spacing[5] }} />

      <SectionHeader title={t('other.other')} />
      <SectionList>
        <ListItem
          title={t('other.settings')}
          leadingItem={<Icon icon={faGear} size={fontSizes.xl} />}
          onPress={() => {
            navigation.navigate('Settings');
          }}
        />
      </SectionList>
      <View style={{ paddingBottom: spacing[5] }} />
    </ScrollView>
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    heading: {
      paddingTop: spacing[5],
      paddingHorizontal: spacing[2],
    },
    smartcardImage: {
      width: '100%',
      height: 200,
      marginVertical: spacing[3],
      alignSelf: 'center',
    },
  });
