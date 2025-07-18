import {useEffect, useLayoutEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {ListItem} from '../../ui/components/ListItem';
import {MetricCard} from '../../ui/components/MetricCard';
import {Section} from '../../ui/components/Section';
import {SectionHeader} from '../../ui/components/SectionHeader';
import {SectionList} from '../../ui/components/SectionList';
import {useTheme} from '../../ui/hooks/useTheme';
import {useCourses} from '../../core/contexts/CoursesContext';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useBottomBarAwareStyles} from '../../core/hooks/useBottomBarAwareStyles';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useStylesheet} from '../../ui/hooks/useStylesheet';
import {Theme} from '../../ui/types/Theme';
import {Text} from '../../ui/components/Text';
import {Icon} from '../../ui/components/Icon';
import {Logo} from '../../core/components/Logo';
import {Row} from '../../ui/components/Row';
import {IconButton} from '../../ui/components/IconButton';
import {
  faArrowLeft,
  faBullhorn,
  faCircleExclamation,
  faCircleRadiation,
  faComments,
  faCrosshairs,
  faEnvelope,
  faFileSignature,
  faHouseCrack,
  faHouseFire,
  faIdCard,
  faInbox,
  faPeopleRobbery,
  faPerson,
  faPersonCirclePlus,
  faPersonWalkingArrowRight,
  faPhone,
  faSearch,
  faTruckMedical,
  faVideo,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {GlobalStyles} from '../../core/components/GlobalStyles';
import {BottomBarSpacer} from '../../core/components/BottomBarSpacer';
import {IndentedDivider} from '../../ui/components/IndentedDivider';
import {EmptyState} from '../../ui/components/EmptyState';
import {useSafeAreaSpacing} from '../../core/hooks/useSafeAreaSpacing';
import {CtaButton} from '../../ui/components/CtaButton';
import {Grid} from '../../ui/components/Grid';
import {ServiceCard} from './ServiceCard';
import {EmergencyCard} from './EmergencyCard';
import {Platform} from 'react-native';



export const EmergencyDetails = () => {
  const {t} = useTranslation();
  const {spacing, colors} = useTheme();
  const navigation = useNavigation();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const styles = useStylesheet(createStyles);
  const {setOptions} = useNavigation();
  const {fontSizes} = useTheme();
  const {user, setSelectedProfile} = useCourses();
  const [searchText, setSearchText] = useState('');
  const {selectedEmergency} = useCourses();
  const {paddingHorizontal} = useSafeAreaSpacing();

const getTranslatedEmergencyName = (name: string) => {
  switch (name.toLowerCase()) {
    case 'incendio':
      return t('other.fire');
    case 'evacuazione':
      return t('other.evacuation');
    case 'terremoto':
      return t('other.earthquake');
    case 'rapina/aggressione':
      return t('other.robbery/assault');
    case 'sostanze pericolose':
      return t('other.dangerousSubstances');
    case 'infortunio':
      return t('other.injury');
    default:
      return name;
  }
};


const {i18n} = useTranslation();

const visibleRules = useMemo(() => {
  if (!selectedEmergency?.rules) return [];
  return i18n.language === 'it'
    ? selectedEmergency.rules.slice(0, 4)
    : selectedEmergency.rules.slice(4, 8);
}, [selectedEmergency, i18n.language]);


  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <IconButton
          icon={faArrowLeft}
          size={22}
          onPress={() => navigation.navigate('Emergency')}
        />
      ),
      headerTitle: () => (
        <Text
          variant="heading"
          style={{
            textAlign: 'center',
            width: '100%',
            marginLeft: Platform.OS === 'android' ? -25 : -55,
          }}>
          {getTranslatedEmergencyName(selectedEmergency?.name || '')}
        </Text>
      ),
    });
  }, [navigation, colors]);

  return (
    <>
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={bottomBarAwareStyles}
        contentInsetAdjustmentBehavior="automatic"
        bounces={false}>
          <Text
            variant="heading"
            style={{marginLeft: spacing[4], marginTop: spacing[4]}}>
            {t('other.whatToDoInCaseOf')}{getTranslatedEmergencyName(selectedEmergency?.name || '')}
          </Text>
          {visibleRules.length > 0 && (
  <View style={styles.rulesContainer}>
    {visibleRules.map((rule, index) => (
      <View key={index} style={styles.ruleItem}>
        <Text style={styles.bulletPoint}>{'\u2022'}</Text>
        <Text>{rule}</Text>
      </View>
    ))}
  </View>
)}
      </ScrollView>
      <CtaButton
        title={t('other.callEmergencyService')}
        action={() => {}}
        absolute={false}
        variant="filled"
        icon={faPhone}
        disabled
        style={{marginBottom: -14}}
      />
      <CtaButton
        title={t('other.call112')}
        action={() => {}}
        absolute={false}
        variant="filled"
        icon={faCrosshairs}
      />
    </>
  );
};

const createStyles = ({colors, spacing}: Theme) =>
  StyleSheet.create({
    centeredContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
    },

    buttonSpacing: {
      width: '100%',
    },
    grid: {
      margin: spacing[5],
    },
    rulesContainer: {
      backgroundColor: 'white',
      borderRadius: 12,
      padding: spacing[4],
      margin: spacing[4],
      gap: spacing[2],
    },
    ruleItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: spacing[2],
    },
    bulletPoint: {
      fontSize: 16,
      marginRight: spacing[2],
      lineHeight: 20,
    },
  });
