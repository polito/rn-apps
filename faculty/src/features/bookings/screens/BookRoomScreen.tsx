import { useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import {
  faDesktop,
  faLocationDot,
  faPaperPlane,
  faPeopleLine,
  faPlug,
} from '@fortawesome/free-solid-svg-icons';
import {
  Icon,
  ListItem,
  OverviewList,
  Section,
  SectionHeader,
  Switch,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ProfileStackParamList } from '../../../screens/Servizi/ServiceNavigator';
import { DateTimeFieldRow } from '../components/DateTimeFieldRow';
import { LimitedTextArea } from '../components/LimitedTextArea';
import { SelectMenuField } from '../components/SelectMenuField';
import { bookingsColors } from '../utils/bookingsTheme';

const DETAILS_MAX_LENGTH = 30;

const CAPACITY_OPTIONS = ['10', '20', '30', '50', '100'];
const CAMPUS_OPTIONS = ['Valentino', 'Centrale'];

export const BookRoomScreen = () => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { dark, colors, fontSizes } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();

  const [capacity, setCapacity] = useState('');
  const [deskType, setDeskType] = useState('');
  const [campus, setCampus] = useState('');
  const [hasOutlets, setHasOutlets] = useState(false);
  const [details, setDetails] = useState('');

  const noPreferences = t('other.noPreferences');
  const iconColor = dark ? colors.secondaryText : bookingsColors.textHeading;

  const deskTypes = useMemo(
    () => [
      t('other.desk1'),
      t('other.desk2'),
      t('other.desk3'),
      t('other.desk4'),
    ],
    [t],
  );

  const showComingSoon = () => {
    Alert.alert(
      t('common.comingSoon'),
      t('bookingsScreen.bookEventComingSoon'),
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerBackTitle: '',
      headerBackVisible: false,
      headerShadowVisible: true,
      headerTransparent: false,
      headerStyle: {
        backgroundColor: dark ? colors.background : bookingsColors.headerGray,
      },
      contentStyle: {
        backgroundColor: colors.background,
      },
      headerLeft: () => (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={t('common.close')}
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
        >
          <Text style={styles.closeText}>{t('common.close')}</Text>
        </TouchableOpacity>
      ),
    });
  }, [
    navigation,
    t,
    dark,
    colors.background,
    styles.closeButton,
    styles.closeText,
  ]);

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <DateTimeFieldRow
          iconSize={fontSizes['2xl']}
          chevronSize={fontSizes.sm}
          cardHeight={80}
          fields={[
            {
              icon: faCalendar,
              label: t('other.date'),
              value: t('other.selectDate'),
              onPress: showComingSoon,
            },
            {
              icon: faCalendar,
              label: t('other.timeShift'),
              value: t('other.selectTime'),
              onPress: showComingSoon,
            },
          ]}
        />

        <Section style={styles.section}>
          <SectionHeader
            title={t('other.characteristics')}
            titleStyle={styles.sectionTitle}
            ellipsizeTitle={false}
            separator={false}
          />
          <OverviewList indented>
            <SelectMenuField
              icon={faPeopleLine}
              title={t('other.capacity')}
              value={capacity}
              placeholder={noPreferences}
              options={CAPACITY_OPTIONS.map(option => ({
                id: option,
                title: t('other.peopleCount', { count: Number(option) }),
              }))}
              onSelect={setCapacity}
              allowNoPreference
              noPreferenceLabel={noPreferences}
            />
            <SelectMenuField
              icon={faDesktop}
              title={t('other.deskType')}
              value={deskType}
              placeholder={noPreferences}
              options={deskTypes.map(type => ({ id: type, title: type }))}
              onSelect={setDeskType}
              allowNoPreference
              noPreferenceLabel={noPreferences}
            />
            <SelectMenuField
              icon={faLocationDot}
              title={t('common.campus')}
              value={campus}
              placeholder={noPreferences}
              options={CAMPUS_OPTIONS.map(option => ({
                id: option,
                title: option,
              }))}
              onSelect={setCampus}
              allowNoPreference
              noPreferenceLabel={noPreferences}
            />
            <ListItem
              leadingItem={
                <Icon icon={faPlug} size={fontSizes['2xl']} color={iconColor} />
              }
              title={t('other.outlets')}
              titleStyle={styles.listTitle}
              containerStyle={styles.listItem}
              onPress={() => setHasOutlets(prev => !prev)}
              trailingItem={
                <Switch
                  value={hasOutlets}
                  onChange={() => setHasOutlets(prev => !prev)}
                  trackColor={{
                    true: bookingsColors.iosSwitchOn,
                    false: bookingsColors.iosSwitchOff,
                  }}
                />
              }
            />
          </OverviewList>
        </Section>

        <LimitedTextArea
          label={t('other.details')}
          value={details}
          onChange={setDetails}
          maxLength={DETAILS_MAX_LENGTH}
          placeholder={t('other.writeSomething')}
        />
      </ScrollView>

      <View style={styles.ctaContainer}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={t('other.send')}
          onPress={showComingSoon}
          style={styles.sendButton}
        >
          <Icon
            icon={faPaperPlane}
            size={fontSizes.sm}
            color={bookingsColors.onSendButton}
          />
          <Text style={styles.sendButtonText}>{t('other.send')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = ({
  dark,
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  shapes,
  spacing,
}: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingTop: spacing[3],
      paddingBottom: spacing[6],
      gap: spacing[4],
    },
    closeButton: {
      marginLeft: -spacing[2],
      paddingHorizontal: spacing[2],
      paddingVertical: spacing[1],
    },
    closeText: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.normal,
      color: dark ? colors.secondaryText : bookingsColors.placeholder,
    },
    ctaContainer: {
      paddingHorizontal: spacing[4],
      paddingTop: spacing[2],
      paddingBottom: spacing[12],
    },
    sendButton: {
      height: 45,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing[2],
      borderRadius: shapes.lg,
      backgroundColor: bookingsColors.sendButton,
      paddingHorizontal: 20,
      paddingVertical: spacing[3],
    },
    sendButtonText: {
      fontFamily: fontFamilies.heading,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      lineHeight: 20,
      color: bookingsColors.onSendButton,
    },
    section: {
      marginBottom: 0,
    },
    sectionTitle: {
      fontFamily: fontFamilies.heading,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.bold,
      lineHeight: 20,
      color: dark ? colors.heading : bookingsColors.textHeading,
    },
    listItem: {
      minHeight: 52,
      paddingVertical: spacing[1],
    },
    listTitle: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      lineHeight: 20,
      color: dark ? colors.title : bookingsColors.textPrimary,
    },
  });
