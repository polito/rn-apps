import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { Platform } from 'react-native';

import {
  faBank,
  faBookOpen,
  faEnvelope,
  faFileAlt,
  faGear,
  faHome,
  faPhone,
} from '@fortawesome/free-solid-svg-icons';
import { faBell, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Logo } from '../../core/components/Logo';
import { useCourses } from '../../core/contexts/CoursesContext';
import { useBottomBarAwareStyles } from '../../core/hooks/useBottomBarAwareStyles';
import { Icon } from '../../ui/components/Icon';
import { IconButton } from '../../ui/components/IconButton';
import { ListItem } from '../../ui/components/ListItem';
import { Row } from '../../ui/components/Row';
import { SectionHeader } from '../../ui/components/SectionHeader';
import { SectionList } from '../../ui/components/SectionList';
import { Text } from '../../ui/components/Text';
import { useStylesheet } from '../../ui/hooks/useStylesheet';
import { useTheme } from '../../ui/hooks/useTheme';
import { Theme } from '../../ui/types/Theme';
import { ProfileStackParamList } from './ProfileNavigator';

export const ProfileScreen = () => {
  const { t } = useTranslation();
  const { spacing, colors } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const styles = useStylesheet(createStyles);
  const { fontSizes } = useTheme();
  const { user, fakeCourses, managedCourses } = useCourses();

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
            color={colors.primary[400]}
            size={fontSizes.lg}
            accessibilityLabel={t('common.preferences')}
            hitSlop={{ left: spacing[3], right: spacing[3] }}
            onPress={() => navigation.navigate('ProfileForm')}
          />

          <IconButton
            icon={faBell}
            color={colors.primary[400]}
            size={fontSizes.lg}
            accessibilityLabel={t('common.preferences')}
            hitSlop={{ left: spacing[3], right: spacing[3] }}
          />
        </Row>
      ),
    });
  }, [navigation, colors]);

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
      <View style={{ paddingBottom: spacing[5] }}></View>
      <SectionHeader title="Smartcard"></SectionHeader>
      <Image
        source={require('../../core/contexts/smartcard.png')}
        style={styles.smartcardImage}
        resizeMode="contain"
      ></Image>
      <View style={{ paddingBottom: spacing[5] }}></View>
      <SectionHeader title={t('other.personalInfo')}></SectionHeader>
      <SectionList>
        <ListItem
          title={t('other.residence')}
          subtitle={user.domicilie}
          leadingItem={<Icon icon={faHome} size={fontSizes.xl} />}
        ></ListItem>
        <ListItem
          title={t('other.fiscalResidence')}
          subtitle={user.taxDomicilie}
          leadingItem={<Icon icon={faHome} size={fontSizes.xl} />}
        ></ListItem>
        <ListItem
          title={t('IBAN')}
          subtitle={user.IBAN}
          leadingItem={<Icon icon={faBank} size={fontSizes.xl} />}
        ></ListItem>
      </SectionList>
      <View style={{ paddingBottom: spacing[5] }}></View>

      <SectionHeader title={t('contactsScreen.title')}></SectionHeader>
      <SectionList>
        <ListItem
          title={t('other.telephone')}
          subtitle={user.phone}
          leadingItem={<Icon icon={faPhone} size={fontSizes.xl} />}
        ></ListItem>
        <ListItem
          title="Email"
          subtitle={user.email}
          leadingItem={<Icon icon={faEnvelope} size={fontSizes.xl} />}
        ></ListItem>
        <ListItem
          title={t('other.privateMail')}
          subtitle={user.privateMail}
          leadingItem={<Icon icon={faEnvelope} size={fontSizes.xl} />}
        ></ListItem>
      </SectionList>

      <View style={{ paddingBottom: spacing[5] }}></View>

      <SectionHeader title={t('other.currentCourses')} />
      <SectionList>
        {fakeCourses.map((course, index) => (
          <ListItem
            key={index}
            title={course.title}
            leadingItem={<Icon icon={faBookOpen} size={fontSizes.xl} />}
            multilineTitle={true}
          />
        ))}
        {managedCourses.map((course, index) => (
          <ListItem
            key={index}
            title={course.title}
            leadingItem={<Icon icon={faBookOpen} size={fontSizes.xl} />}
            multilineTitle={true}
          />
        ))}
      </SectionList>
      <View style={{ paddingBottom: spacing[5] }}></View>

      {user.publications && user.publications.length > 0 && (
        <>
          <SectionHeader title={t('other.publications')} />
          <SectionList>
            {user.publications.map((pub, index) => (
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
      <View style={{ paddingBottom: spacing[5] }}></View>

      <SectionHeader title={t('other.other')}></SectionHeader>
      <SectionList>
        <ListItem
          title={t('other.settings')}
          leadingItem={<Icon icon={faGear} size={fontSizes.xl} />}
          onPress={() => {
            navigation.navigate('Impostazioni');
          }}
        />
      </SectionList>
      <View style={{ paddingBottom: spacing[5] }}></View>
    </ScrollView>
  );
};

const createStyles = ({ colors, spacing }: Theme) =>
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
