import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { faCircle, faCircleDot } from '@fortawesome/free-regular-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Text, Theme, useStylesheet, useTheme } from '@polito/lib/ui';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { SCREEN_HORIZONTAL_PADDING } from '../constants';
import { StudentsStackParamList } from '../types/navigation';

type ContactMethod = 'email' | 'notify';

const BACKDROP_COLOR = 'rgba(0, 0, 0, 0.4)';

export const SelectContactMethodScreen = () => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { palettes, dark } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<StudentsStackParamList>>();
  const route =
    useRoute<RouteProp<StudentsStackParamList, 'SelectContactMethod'>>();
  const { selectedIds } = route.params;
  const [selectedMethod, setSelectedMethod] = useState<ContactMethod | null>(
    null,
  );

  const handleBack = () => navigation.goBack();
  const handleContinue = () => {
    if (selectedMethod === 'email') {
      navigation.replace('EmailCompose', { selectedIds });
      return;
    }
    if (selectedMethod === 'notify') {
      navigation.replace('NotifyCompose', { selectedIds });
    }
  };

  const studentCount = selectedIds.length;
  const studentsLabel = t('other.students', {
    defaultValue: 'students',
  }).toLowerCase();

  return (
    <View style={styles.overlay}>
      <TouchableWithoutFeedback onPress={handleBack}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>
      <View style={[styles.card, { paddingBottom: insets.bottom }]}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, dark && styles.headerTitleDark]}>
            {t('other.contactSelected', { defaultValue: 'Contact selected' })}
          </Text>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel={t('common.close', { defaultValue: 'Close' })}
          >
            <FontAwesomeIcon
              icon={faXmark}
              size={16}
              color={palettes.primary[500]}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.items}>
            <View style={styles.introRow}>
              <Text style={[styles.introText, dark && styles.introTextDark]}>
                <Text
                  style={[styles.introCount, dark && styles.introCountDark]}
                >
                  {studentCount} {studentsLabel}
                </Text>
                {` ${t('other.willBeContactedBy', { defaultValue: 'will be contacted by:' })}`}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.listItem, dark && styles.listItemDark]}
              onPress={() => setSelectedMethod('email')}
              activeOpacity={0.7}
              accessibilityRole="radio"
              accessibilityState={{ checked: selectedMethod === 'email' }}
            >
              <View style={styles.listItemContent}>
                <Text
                  style={[
                    styles.listItemTitle,
                    dark && styles.listItemTitleDark,
                  ]}
                  numberOfLines={1}
                >
                  {t('other.email', { defaultValue: 'Email' })}
                </Text>
              </View>
              <View style={styles.radioContainer}>
                <FontAwesomeIcon
                  icon={selectedMethod === 'email' ? faCircleDot : faCircle}
                  size={16}
                  color={palettes.primary[500]}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.listItem, dark && styles.listItemDark]}
              onPress={() => setSelectedMethod('notify')}
              activeOpacity={0.7}
              accessibilityRole="radio"
              accessibilityState={{ checked: selectedMethod === 'notify' }}
            >
              <View style={styles.listItemContent}>
                <Text
                  style={[
                    styles.listItemTitle,
                    dark && styles.listItemTitleDark,
                  ]}
                  numberOfLines={1}
                >
                  {t('other.notify', { defaultValue: 'Notify' })}
                </Text>
                <Text style={styles.listItemSubtitle} numberOfLines={2}>
                  {t('other.notifySubtitle', {
                    defaultValue:
                      'If the student has not installed the app, they will be sent an SMS',
                  })}
                </Text>
              </View>
              <View style={styles.radioContainer}>
                <FontAwesomeIcon
                  icon={selectedMethod === 'notify' ? faCircleDot : faCircle}
                  size={16}
                  color={palettes.primary[500]}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                selectedMethod === null && styles.continueButtonDisabled,
              ]}
              onPress={handleContinue}
              disabled={selectedMethod === null}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityState={{ disabled: selectedMethod === null }}
            >
              <Text
                style={[
                  styles.continueButtonText,
                  selectedMethod === null && styles.continueButtonTextDisabled,
                ]}
              >
                {t('other.continue', { defaultValue: 'Continue' })}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const createStyles = ({
  spacing,
  palettes,
  colors,
  shapes,
  fontFamilies,
  fontSizes,
  fontWeights,
}: Theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
    },
    backdrop: {
      flex: 1,
      backgroundColor: BACKDROP_COLOR,
    },
    card: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 57,
      paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
      gap: spacing[2.5],
      backgroundColor: colors.background,
      overflow: 'hidden',
    },
    headerButton: {
      width: 20,
      height: 16,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    headerTitle: {
      flex: 1,
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.medium,
      color: palettes.primary[700],
      textAlign: 'center',
    },
    headerTitleDark: {
      color: palettes.gray[50],
    },
    content: {
      paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
    },
    items: {
      paddingVertical: spacing[3],
      gap: spacing[3],
    },
    introRow: {
      paddingLeft: spacing[3],
    },
    introText: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.normal,
      color: palettes.gray[800],
      lineHeight: 24,
    },
    introTextDark: {
      color: palettes.gray[50],
    },
    introCount: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.semibold,
      color: palettes.gray[800],
      lineHeight: 24,
    },
    introCountDark: {
      color: palettes.gray[50],
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: shapes.lg,
      paddingLeft: spacing[4],
      paddingRight: spacing[2],
    },
    listItemDark: {
      backgroundColor: colors.background,
    },
    listItemContent: {
      flex: 1,
      justifyContent: 'center',
      paddingVertical: 18,
      gap: 2,
    },
    listItemTitle: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.medium,
      color: palettes.text[800],
      lineHeight: 24,
    },
    listItemTitleDark: {
      color: palettes.gray[50],
    },
    listItemSubtitle: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.normal,
      color: palettes.gray[500],
      lineHeight: 21,
    },
    radioContainer: {
      width: 24,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    buttonRow: {
      paddingTop: spacing[3],
      paddingBottom: spacing[1],
    },
    continueButton: {
      backgroundColor: palettes.primary[500],
      borderColor: palettes.primary[500],
      borderWidth: 1,
      borderRadius: shapes.lg,
      paddingHorizontal: 21,
      paddingVertical: spacing[3],
      alignItems: 'center',
      justifyContent: 'center',
    },
    continueButtonDisabled: {
      backgroundColor: colors.secondaryText,
      borderColor: colors.secondaryText,
    },
    continueButtonText: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      color: palettes.gray[50],
      textAlign: 'center',
      lineHeight: 21,
    },
    continueButtonTextDisabled: {
      color: colors.disableTitle,
    },
  });
