import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import {
  faArrowUpRightFromSquare,
  faCircleExclamation,
  faPhone,
} from '@fortawesome/free-solid-svg-icons';
import { EmergencyCtaType } from '@polito/student-api-client';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ActivityIndicator } from '../../../ui/components/ActivityIndicator';
import { BottomModal } from '../../../ui/components/BottomModal';
import { CtaButton, CtaButtonSpacer } from '../../../ui/components/CtaButton';
import { CtaButtonContainer } from '../../../ui/components/CtaButtonContainer';
import { EmptyState } from '../../../ui/components/EmptyState';
import { HtmlView } from '../../../ui/components/HtmlView';
import { Icon } from '../../../ui/components/Icon';
import { Text } from '../../../ui/components/Text';
import { useBottomBarAwareStyles } from '../../../ui/hooks/useBottomBarAwareStyles';
import { useStylesheet } from '../../../ui/hooks/useStylesheet';
import { useTheme } from '../../../ui/hooks/useTheme';
import { Theme } from '../../../ui/types/Theme';
import { useEmergencyCta } from '../hooks/useEmergencyCta';
import { useGetEmergencies } from '../queries/emergenciesHooks';
import { EmergenciesStackParamList } from '../types';

export const EmergencyDetails = () => {
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<EmergenciesStackParamList>>();
  const route =
    useRoute<RouteProp<EmergenciesStackParamList, 'EmergencyDetails'>>();
  const { palettes } = useTheme();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const styles = useStylesheet(createStyles);
  const { data, isLoading } = useGetEmergencies();
  const { onCtaPress, modal } = useEmergencyCta(data?.sites);
  const emergency = data?.emergencies.find(e => e.id === route.params.id);

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: emergency?.name ?? '' });
  }, [emergency?.name, navigation]);

  return (
    <>
      <BottomModal dismissable {...modal} />
      <ScrollView
        style={styles.screen}
        contentContainerStyle={bottomBarAwareStyles}
        contentInsetAdjustmentBehavior="automatic"
      >
        {isLoading && <ActivityIndicator style={styles.loader} />}
        {!isLoading && !emergency && (
          <EmptyState
            icon={faCircleExclamation}
            message={t('common.somethingWentWrong')}
          />
        )}
        {emergency && (
          <>
            <View style={styles.accent} />
            <Text variant="heading" style={styles.heading}>
              {emergency.title}
            </Text>
            {emergency.content.map((card, index) => (
              <View key={card.title ?? index} style={styles.card}>
                {card.title && <Text variant="title">{card.title}</Text>}
                <HtmlView
                  variant="compact"
                  props={{
                    source: { html: card.htmlContent },
                    baseStyle: styles.html,
                    tagsStyles: { ul: styles.list, li: styles.listItem },
                  }}
                />
                {card.cta.map(cta => (
                  <TouchableOpacity
                    key={cta.text}
                    accessibilityRole="button"
                    style={styles.cardCta}
                    onPress={() => onCtaPress(cta)}
                  >
                    <Text style={styles.cardCtaText}>{cta.text}</Text>
                    <Icon
                      icon={
                        cta.type === EmergencyCtaType.Link
                          ? faArrowUpRightFromSquare
                          : faPhone
                      }
                      color={palettes.danger[600]}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </>
        )}
        {emergency?.cta.map(cta => (
          <CtaButtonSpacer key={cta.text} />
        ))}
      </ScrollView>
      <CtaButtonContainer absolute>
        {emergency?.cta.map(cta => (
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

const createStyles = ({
  colors,
  fontSizes,
  fontWeights,
  palettes,
  shapes,
  spacing,
}: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
    },
    loader: {
      marginTop: spacing[8],
    },
    accent: {
      width: 28,
      height: 3,
      marginTop: spacing[5],
      marginLeft: spacing[4],
      backgroundColor: palettes.secondary[600],
    },
    heading: {
      fontSize: fontSizes.xl,
      marginHorizontal: spacing[4],
      marginTop: spacing[2],
    },
    card: {
      gap: spacing[2],
      marginHorizontal: spacing[4],
      marginTop: spacing[4],
      padding: spacing[4],
      borderRadius: shapes.lg,
      backgroundColor: colors.surface,
    },
    html: {
      padding: 0,
      fontSize: fontSizes.sm,
    },
    // Figma: one blank line between bullets, none after the last one
    list: {
      marginTop: 0,
      marginBottom: -spacing[3],
    },
    listItem: {
      marginBottom: spacing[3],
    },
    cardCta: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: spacing[2],
    },
    cardCtaText: {
      color: palettes.danger[600],
      fontWeight: fontWeights.semibold,
    },
  });
