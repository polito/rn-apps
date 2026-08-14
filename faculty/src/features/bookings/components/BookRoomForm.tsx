import { useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import {
  faChevronDown,
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
  StatefulMenuView,
  Switch,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ProfileStackParamList } from '../../../screens/Servizi/ServiceNavigator';

const DETAILS_MAX_LENGTH = 30;
const NO_PREFERENCE = '__none__';

const CAPACITY_OPTIONS = ['10', '20', '30', '50', '100'];
const CAMPUS_OPTIONS = ['Valentino', 'Centrale'];

type MenuOption = { id: string; title: string };

export const BookRoomForm = () => {
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
  const [isDetailsFocused, setIsDetailsFocused] = useState(false);

  const noPreferences = t('other.noPreferences');
  const iconColor = dark ? colors.secondaryText : TEXT_HEADING;

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
        backgroundColor: dark ? colors.background : HEADER_GRAY,
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

  const renderSelectField = ({
    icon,
    title,
    value,
    placeholder,
    options,
    onSelect,
  }: {
    icon: typeof faPeopleLine;
    title: string;
    value: string;
    placeholder: string;
    options: MenuOption[];
    onSelect: (id: string) => void;
  }) => (
    <StatefulMenuView
      style={styles.menuFill}
      title={title}
      actions={[
        { id: NO_PREFERENCE, title: noPreferences },
        ...options.map(option => ({
          id: option.id,
          title: option.title,
          state: (value === option.id ? 'on' : 'off') as 'on' | 'off',
        })),
      ]}
      onPressAction={({ nativeEvent: { event } }) =>
        onSelect(event === NO_PREFERENCE ? '' : event)
      }
    >
      <ListItem
        isAction
        leadingItem={
          <Icon icon={icon} size={fontSizes['2xl']} color={iconColor} />
        }
        title={title}
        titleStyle={styles.listTitle}
        subtitle={value || placeholder}
        subtitleStyle={styles.listSubtitle}
        containerStyle={styles.listItem}
      />
    </StatefulMenuView>
  );

  const remainingChars = DETAILS_MAX_LENGTH - details.length;

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.datetimeRow}>
          <Pressable
            accessibilityRole="button"
            onPress={showComingSoon}
            style={styles.datetimeCard}
          >
            <Icon icon={faCalendar} size={fontSizes['2xl']} color={iconColor} />
            <View style={styles.fieldTextBlock}>
              <Text style={styles.fieldLabel}>{t('other.date')}</Text>
              <View style={styles.fieldValueRow}>
                <Text style={styles.fieldValue} numberOfLines={1}>
                  {t('other.selectDate')}
                </Text>
                <Icon
                  icon={faChevronDown}
                  size={fontSizes.sm}
                  color={dark ? colors.prose : TEXT_SUBTITLE}
                />
              </View>
            </View>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={showComingSoon}
            style={styles.datetimeCard}
          >
            <Icon icon={faCalendar} size={fontSizes['2xl']} color={iconColor} />
            <View style={styles.fieldTextBlock}>
              <Text style={styles.fieldLabel} numberOfLines={1}>
                {t('other.timeShift')}
              </Text>
              <View style={styles.fieldValueRow}>
                <Text style={styles.fieldValue} numberOfLines={1}>
                  {t('other.selectTime')}
                </Text>
                <Icon
                  icon={faChevronDown}
                  size={fontSizes.sm}
                  color={dark ? colors.prose : TEXT_SUBTITLE}
                />
              </View>
            </View>
          </Pressable>
        </View>

        <Section style={styles.section}>
          <SectionHeader
            title={t('other.characteristics')}
            titleStyle={styles.sectionTitle}
            ellipsizeTitle={false}
            separator={false}
          />
          <OverviewList indented>
            {renderSelectField({
              icon: faPeopleLine,
              title: t('other.capacity'),
              value: capacity
                ? t('other.peopleCount', { count: Number(capacity) })
                : '',
              placeholder: noPreferences,
              options: CAPACITY_OPTIONS.map(option => ({
                id: option,
                title: t('other.peopleCount', { count: Number(option) }),
              })),
              onSelect: setCapacity,
            })}
            {renderSelectField({
              icon: faDesktop,
              title: t('other.deskType'),
              value: deskType,
              placeholder: noPreferences,
              options: deskTypes.map(type => ({ id: type, title: type })),
              onSelect: setDeskType,
            })}
            {renderSelectField({
              icon: faLocationDot,
              title: t('common.campus'),
              value: campus,
              placeholder: noPreferences,
              options: CAMPUS_OPTIONS.map(option => ({
                id: option,
                title: option,
              })),
              onSelect: setCampus,
            })}
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
                    true: IOS_SWITCH_ON,
                    false: IOS_SWITCH_OFF,
                  }}
                />
              }
            />
          </OverviewList>
        </Section>

        <View
          style={[
            styles.detailsCard,
            isDetailsFocused && styles.detailsCardFocused,
          ]}
        >
          <View style={styles.detailsHeader}>
            <Text
              style={[
                styles.detailsLabel,
                !isDetailsFocused && styles.detailsLabelIdle,
              ]}
            >
              {t('other.details')}
            </Text>
            <Text
              style={[
                styles.detailsCounter,
                !isDetailsFocused && styles.detailsLabelIdle,
              ]}
            >
              {remainingChars}
            </Text>
          </View>
          <TextInput
            value={details}
            onChangeText={text => setDetails(text.slice(0, DETAILS_MAX_LENGTH))}
            onFocus={() => setIsDetailsFocused(true)}
            onBlur={() => setIsDetailsFocused(false)}
            placeholder={t('other.writeSomething')}
            placeholderTextColor={dark ? colors.secondaryText : PLACEHOLDER}
            selectionColor={CURSOR_ORANGE}
            multiline
            textAlignVertical="top"
            maxLength={DETAILS_MAX_LENGTH}
            style={styles.detailsInput}
          />
        </View>
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
            color={ON_SEND_BUTTON}
          />
          <Text style={styles.sendButtonText}>{t('other.send')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const HEADER_GRAY = '#EDEEF0';
const CARD_SURFACE = '#FFFFFF';
const TEXT_HEADING = '#45556C';
const TEXT_PRIMARY = '#262626';
const TEXT_SUBTITLE = '#314158';
const PLACEHOLDER = '#90A1B9';
const IOS_SWITCH_ON = '#34C759';
const IOS_SWITCH_OFF = '#E9E9EA';
const DETAILS_FOCUS_BORDER = '#7EB8D9';
const CURSOR_ORANGE = '#FF9500';
const SEND_BUTTON = '#90A1B9';
const ON_SEND_BUTTON = '#FFFFFF';

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
      color: dark ? colors.secondaryText : PLACEHOLDER,
    },
    datetimeRow: {
      flexDirection: 'row',
      alignItems: 'stretch',
      gap: spacing[3],
      paddingHorizontal: spacing[4],
    },
    menuFill: {
      flex: 1,
      width: '100%',
    },
    datetimeCard: {
      flex: 1,
      height: 80,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[2.5],
      backgroundColor: dark ? colors.surfaceDark : CARD_SURFACE,
      borderRadius: shapes.lg,
      paddingVertical: spacing[3],
      paddingHorizontal: spacing[3],
      overflow: 'hidden',
    },
    datetimeCardContent: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[2.5],
    },
    fieldTextBlock: {
      flex: 1,
      gap: spacing[0.5],
      minWidth: 0,
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
      backgroundColor: SEND_BUTTON,
      paddingHorizontal: 20,
      paddingVertical: spacing[3],
    },
    sendButtonDisabled: {
      opacity: 0.55,
    },
    sendButtonText: {
      fontFamily: fontFamilies.heading,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      lineHeight: 20,
      color: ON_SEND_BUTTON,
    },
    fieldLabel: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.normal,
      lineHeight: 16,
      color: dark ? colors.secondaryText : TEXT_HEADING,
    },
    fieldValueRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[1],
    },
    fieldValue: {
      flexShrink: 1,
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      lineHeight: 20,
      color: dark ? colors.prose : TEXT_SUBTITLE,
    },
    section: {
      marginBottom: 0,
    },
    sectionTitle: {
      fontFamily: fontFamilies.heading,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.bold,
      lineHeight: 20,
      color: dark ? colors.heading : TEXT_HEADING,
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
      color: dark ? colors.title : TEXT_PRIMARY,
    },
    listSubtitle: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.normal,
      lineHeight: 16,
      color: dark ? colors.prose : TEXT_SUBTITLE,
    },
    detailsCard: {
      marginHorizontal: spacing[4],
      backgroundColor: dark ? colors.surfaceDark : CARD_SURFACE,
      borderRadius: shapes.lg,
      paddingHorizontal: spacing[4],
      paddingTop: spacing[3],
      paddingBottom: spacing[3],
      borderWidth: 1,
      borderColor: 'transparent',
    },
    detailsCardFocused: {
      borderColor: DETAILS_FOCUS_BORDER,
    },
    detailsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    detailsLabel: {
      fontFamily: fontFamilies.heading,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      lineHeight: 20,
      color: dark ? colors.heading : TEXT_HEADING,
    },
    detailsLabelIdle: {
      color: dark ? colors.secondaryText : PLACEHOLDER,
      fontFamily: fontFamilies.body,
      fontWeight: fontWeights.normal,
    },
    detailsCounter: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.medium,
      lineHeight: 16,
      color: dark ? colors.secondaryText : PLACEHOLDER,
    },
    detailsInput: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.normal,
      lineHeight: 16,
      color: dark ? colors.prose : TEXT_SUBTITLE,
      padding: 0,
      marginTop: spacing[1],
      minHeight: 16,
    },
  });
