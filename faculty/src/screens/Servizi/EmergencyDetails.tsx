import { useCallback, useLayoutEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Platform } from 'react-native';

import {
  faArrowLeft,
  faCrosshairs,
  faPhone,
} from '@fortawesome/free-solid-svg-icons';
import {
  CtaButton,
  IconButton,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useCourses } from '../../core/contexts/CoursesContext';
import { useBottomBarAwareStyles } from '../../core/hooks/useBottomBarAwareStyles';
import { ProfileStackParamList } from './ServiceNavigator';

export const EmergencyDetails = () => {
  const { t, i18n } = useTranslation();
  const { spacing } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const styles = useStylesheet(createStyles);
  const { selectedEmergency } = useCourses();

  const getTranslatedEmergencyName = useCallback(
    (name: string) => {
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
    },
    [t],
  );

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
          }}
        >
          {getTranslatedEmergencyName(selectedEmergency?.name || '')}
        </Text>
      ),
    });
  }, [navigation, getTranslatedEmergencyName, selectedEmergency]);

  return (
    <>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={bottomBarAwareStyles}
        contentInsetAdjustmentBehavior="automatic"
        bounces={false}
      >
        <Text
          variant="heading"
          style={{ marginLeft: spacing[4], marginTop: spacing[4] }}
        >
          {t('other.whatToDoInCaseOf')}
          {getTranslatedEmergencyName(selectedEmergency?.name || '')}
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
        style={{ marginBottom: -14 }}
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

const createStyles = ({ colors, spacing }: Theme) =>
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
      backgroundColor: colors.white,
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
