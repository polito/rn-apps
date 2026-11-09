import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import {
  faCircleExclamation,
  faPhone,
} from '@fortawesome/free-solid-svg-icons';
import { EmergencyCta, EmergencyCtaType } from '@polito/student-api-client';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ActivityIndicator } from '../../../ui/components/ActivityIndicator';
import { BottomModal } from '../../../ui/components/BottomModal';
import { CtaButton, CtaButtonSpacer } from '../../../ui/components/CtaButton';
import { CtaButtonContainer } from '../../../ui/components/CtaButtonContainer';
import { EmptyState } from '../../../ui/components/EmptyState';
import { Grid } from '../../../ui/components/Grid';
import { Icon } from '../../../ui/components/Icon';
import { Text } from '../../../ui/components/Text';
import { useBottomBarAwareStyles } from '../../../ui/hooks/useBottomBarAwareStyles';
import { useStylesheet } from '../../../ui/hooks/useStylesheet';
import { Theme } from '../../../ui/types/Theme';
import { EmergencyCard } from '../components/EmergencyCard';
import { useEmergencyCta } from '../hooks/useEmergencyCta';
import { useGetEmergencies } from '../queries/emergenciesHooks';
import { EmergenciesStackParamList } from '../types';
import { getEmergencyIcon } from '../utils/emergencyIcons';

export const EmergencyScreen = () => {
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<EmergenciesStackParamList>>();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const styles = useStylesheet(createStyles);
  const { data, isLoading } = useGetEmergencies();
  const { onCtaPress, modal } = useEmergencyCta(data?.sites);

  // 112 must stay reachable when the server content is unavailable
  const ctas = useMemo<EmergencyCta[]>(
    () =>
      data?.cta ?? [
        {
          text: t('emergenciesScreen.call112'),
          type: EmergencyCtaType.Call,
          phoneNumber: '112',
          primary: false,
        },
      ],
    [data?.cta, t],
  );
  const secondaryCtas = ctas.filter(cta => !cta.primary);

  return (
    <>
      <BottomModal dismissable {...modal} />
      <ScrollView
        style={styles.screen}
        contentContainerStyle={bottomBarAwareStyles}
        contentInsetAdjustmentBehavior="automatic"
      >
        {isLoading && <ActivityIndicator style={styles.loader} />}
        {!isLoading && !data && (
          <EmptyState
            icon={faCircleExclamation}
            message={t('common.somethingWentWrong')}
          />
        )}
        {data && (
          <>
            <Text variant="heading" style={styles.heading}>
              {t('emergenciesScreen.howToBehave')}
            </Text>
            <Grid
              numColumns={3}
              minColumnWidth={EmergencyCard.minWidth}
              maxColumnWidth={EmergencyCard.maxWidth}
              gap={4}
              style={styles.grid}
            >
              {data.emergencies.map(emergency => (
                <EmergencyCard
                  key={emergency.id}
                  name={emergency.name}
                  icon={getEmergencyIcon(emergency.icon)}
                  onPress={() =>
                    navigation.navigate('EmergencyDetails', {
                      id: emergency.id,
                    })
                  }
                />
              ))}
            </Grid>
          </>
        )}
        {ctas
          .filter(cta => cta.primary)
          .map(cta => (
            <View key={cta.text} style={styles.primaryCtaContainer}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={cta.text}
                style={styles.primaryCta}
                onPress={() => onCtaPress(cta)}
              >
                <Icon icon={faPhone} color="white" size={24} />
                <Text variant="heading" style={styles.primaryCtaText}>
                  {cta.text}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        {secondaryCtas.map(cta => (
          <CtaButtonSpacer key={cta.text} />
        ))}
      </ScrollView>
      <CtaButtonContainer absolute>
        {secondaryCtas.map(cta => (
          <CtaButton
            key={cta.text}
            title={cta.text}
            action={() => onCtaPress(cta)}
            absolute={false}
            variant="outlined"
            destructive
            icon={faPhone}
          />
        ))}
      </CtaButtonContainer>
    </>
  );
};

const PRIMARY_CTA_SIZE = 176;

const createStyles = ({ colors, fontSizes, palettes, spacing }: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
    },
    loader: {
      marginTop: spacing[8],
    },
    heading: {
      fontSize: fontSizes.xl,
      textAlign: 'center',
      marginTop: spacing[6],
    },
    grid: {
      margin: spacing[5],
    },
    primaryCtaContainer: {
      alignItems: 'center',
      marginVertical: spacing[8],
    },
    primaryCta: {
      width: PRIMARY_CTA_SIZE,
      height: PRIMARY_CTA_SIZE,
      borderRadius: PRIMARY_CTA_SIZE / 2,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing[2],
      padding: spacing[4],
      backgroundColor: palettes.danger[600],
    },
    primaryCtaText: {
      color: colors.white,
      textAlign: 'center',
      fontSize: fontSizes['2xl'],
    },
  });
