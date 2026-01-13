import { useEffect, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet } from 'react-native';
import { Platform } from 'react-native';

import { faArrowLeft, faPhone } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useCourses } from '../../core/contexts/CoursesContext';
import { useBottomBarAwareStyles } from '../../core/hooks/useBottomBarAwareStyles';
import { CtaButton } from '../../ui/components/CtaButton';
import { Grid } from '../../ui/components/Grid';
import { IconButton } from '../../ui/components/IconButton';
import { Text } from '../../ui/components/Text';
import { useStylesheet } from '../../ui/hooks/useStylesheet';
import { useTheme } from '../../ui/hooks/useTheme';
import { Theme } from '../../ui/types/Theme';
import { EmergencyCard } from './EmergencyCard';
import { ServiceCard } from './ServiceCard';
import { ProfileStackParamList } from './ServiceNavigator';

export const EmergencyScreen = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const styles = useStylesheet(createStyles);
  const { emergencies, setSelectedEmergency } = useCourses();

  const getTranslatedEmergencyName = (name: string) => {
    switch (name.toLowerCase()) {
      case 'incendio':
        return t('other.fire');
      case 'evacuazione':
        return t('other.evacuation');
      case 'terremoto':
        return t('other.earthquake');
      case 'rapina/assault':
        return t('other.robbery');
      case 'sostanze pericolose':
        return t('other.dangerousSubstances');
      case 'infortunio':
        return t('other.injury');
      default:
        return name;
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      e.preventDefault();
      navigation.navigate('Servizi');
    });

    return unsubscribe;
  }, [navigation]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <IconButton
          icon={faArrowLeft}
          size={22}
          onPress={() => navigation.navigate('Servizi')}
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
          {t('other.emergencies')}
        </Text>
      ),
    });
  }, [navigation, colors, t]);

  return (
    <>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={bottomBarAwareStyles}
        contentInsetAdjustmentBehavior="automatic"
        bounces={false}
      >
        <Grid
          numColumns={2}
          minColumnWidth={ServiceCard.minWidth}
          maxColumnWidth={ServiceCard.maxWidth}
          gap={4}
          style={styles.grid}
        >
          {emergencies.map(emergency => (
            <EmergencyCard
              key={emergency.id}
              name={getTranslatedEmergencyName(emergency?.name || '')}
              icon={emergency.icon}
              onPress={() => {
                setSelectedEmergency(emergency);
                navigation.navigate('EmergencyDetails');
              }}
            />
          ))}
        </Grid>
      </ScrollView>
      <CtaButton
        title={t('other.callCentral')}
        action={() => {}}
        absolute={false}
        variant="outlined"
        icon={faPhone}
        style={{ marginBottom: -14 }}
      />
      <CtaButton
        title={t('other.call112')}
        action={() => {}}
        absolute={false}
        variant="filled"
        icon={faPhone}
      />
    </>
  );
};

const createStyles = ({ spacing }: Theme) =>
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
  });
