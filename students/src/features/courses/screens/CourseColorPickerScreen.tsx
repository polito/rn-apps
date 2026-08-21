import {
  GestureHandlerRootView,
  ScrollView,
} from 'react-native-gesture-handler';

import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, SafeAreaView, StyleSheet, View } from 'react-native';
import { runOnJS } from 'react-native-reanimated';

import { usePreferencesContext } from '@polito/lib/core';
import { courseColors } from '@polito/lib/features/courses';
import {
  BottomBarSpacer,
  CtaButton,
  OverviewList,
  Section,
  SectionHeader,
  useBottomBarAwareStyles,
  useTheme,
} from '@polito/lib/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppPreferences } from '~/core/types/preferences';

import ColorPicker, {
  HueSlider,
  InputWidget,
  Panel1,
} from 'reanimated-color-picker';

import { TeachingStackParamList } from '../../teaching/components/TeachingNavigator';
import CustomAlert from '../components/CourseColorWarningModal';

type Props = NativeStackScreenProps<
  TeachingStackParamList,
  'CourseColorPicker'
>;

export const CourseColorPickerScreen = ({ route, navigation }: Props) => {
  const { t } = useTranslation();
  const { spacing, colors } = useTheme();
  const bottomBarStyles = useBottomBarAwareStyles(true);
  const styles = createStyles({ spacing, colors, bottomBarStyles });
  const {
    courses: coursesPrefs,
    updatePreference,
    showColorWarning,
  } = usePreferencesContext<AppPreferences>();

  const [isSafeColor, setIsSafeColor] = useState(true);
  const [focusedColor, setFocusedColor] = useState<string | undefined>();
  const [temporaryColor, setTemporaryColor] = useState(
    coursesPrefs[route.params.uniqueShortcode]?.color ?? courseColors[0].color,
  );
  const [showModal, setShowModal] = useState(false);

  const originalColor =
    coursesPrefs[route.params.uniqueShortcode]?.color ?? courseColors[0].color;
  const hasChanged = temporaryColor !== originalColor;
  const isUnsafeChange = hasChanged && !isSafeColor;
  const shouldWarn = isUnsafeChange && showColorWarning !== false;

  const saveColor = useCallback(() => {
    updatePreference('courses', {
      ...coursesPrefs,
      [route.params.uniqueShortcode]: {
        ...coursesPrefs[route.params.uniqueShortcode],
        color: temporaryColor.slice(0, 7),
      },
    });
  }, [
    coursesPrefs,
    route.params.uniqueShortcode,
    temporaryColor,
    updatePreference,
  ]);

  const handleConfirm = useCallback(
    (dontShowAgain: boolean) => {
      setShowModal(false);
      if (dontShowAgain) {
        updatePreference('showColorWarning', false);
      }
      saveColor();
      navigation.goBack();
    },
    [saveColor, updatePreference, navigation],
  );

  const handleCancel = useCallback(() => {
    setShowModal(false);
    setTemporaryColor(originalColor);
  }, [originalColor]);

  const handleConfirmColor = useCallback(() => {
    if (shouldWarn) {
      setShowModal(true);
    } else {
      saveColor();
      navigation.goBack();
    }
  }, [shouldWarn, saveColor, navigation]);

  const onCustomColorChange = (color: { hex: string }) => {
    'worklet';
    runOnJS(setIsSafeColor)(false);
    runOnJS(setTemporaryColor)(color.hex);
  };

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          decelerationRate="fast"
          style={{ marginBottom: spacing[4] }}
        >
          <SafeAreaView>
            <View style={{ paddingVertical: spacing[5] }}>
              <Section>
                <SectionHeader
                  title={t('courseColorPickerScreen.accessibleColor')}
                />
                <OverviewList indented>
                  <View style={[styles.picker, styles.swatchesContainer]}>
                    {courseColors.map(({ name, color }) => {
                      const selected =
                        temporaryColor.slice(0, 7).toUpperCase() ===
                        color.toUpperCase();
                      return (
                        <Pressable
                          key={color}
                          accessibilityRole="button"
                          accessibilityLabel={t(name)}
                          accessibilityState={{ selected }}
                          onPress={() => {
                            setIsSafeColor(true);
                            setTemporaryColor(color);
                          }}
                          onFocus={() => setFocusedColor(color)}
                          onBlur={() => setFocusedColor(undefined)}
                          style={[
                            styles.swatchItem,
                            { backgroundColor: color },
                            selected && styles.swatchItemSelected,
                            focusedColor === color && styles.swatchItemFocused,
                          ]}
                        />
                      );
                    })}
                  </View>
                </OverviewList>
              </Section>
              <Section>
                <SectionHeader
                  title={t('courseColorPickerScreen.customColorTitle')}
                />
                <OverviewList indented>
                  <ColorPicker
                    value={temporaryColor}
                    onComplete={onCustomColorChange}
                  >
                    <Panel1 style={styles.panel} />
                    <HueSlider style={styles.slider} />
                    <View style={styles.widget}>
                      <InputWidget
                        defaultFormat="HEX"
                        formats={['HEX']}
                        disableAlphaChannel={true}
                        containerStyle={{
                          padding: spacing[3],
                        }}
                        inputStyle={{
                          color: colors.prose,
                          fontFamily: 'Montserrat',
                        }}
                        inputTitleStyle={{
                          color: colors.title,
                          fontSize: 14,
                          fontFamily: 'Montserrat',
                        }}
                        iconColor={colors.link}
                        inputProps={{
                          placeholderTextColor: colors.secondaryText,
                        }}
                      />
                    </View>
                  </ColorPicker>
                </OverviewList>
              </Section>
            </View>
            <BottomBarSpacer />
          </SafeAreaView>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <CtaButton
            title={t('common.confirm')}
            action={handleConfirmColor}
            disabled={!hasChanged}
            accessibilityState={{ disabled: !hasChanged }}
            accessibilityHint={
              !hasChanged
                ? t('courseColorPickerScreen.confirmDisabledHint')
                : undefined
            }
            absolute={false}
            containerStyle={styles.buttonWrapper}
          />
        </View>
      </GestureHandlerRootView>
      <CustomAlert
        visible={showModal}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        footer={t('courseColorPickerScreen.areYouSureTitle')}
        message={t('courseColorPickerScreen.areYouSureMessage')}
        dontShowAgainLabel={t('courseColorPickerScreen.dontShowAgain')}
      />
    </>
  );
};

const createStyles = ({
  spacing,
  colors,
  bottomBarStyles,
}: {
  spacing: any;
  colors: any;
  bottomBarStyles: any;
}) =>
  StyleSheet.create({
    picker: {
      marginTop: 10,
      marginBottom: 10,
      width: '95%',
      alignSelf: 'center',
    },
    panel: {
      marginTop: 10,
      marginBottom: 10,
      height: 200,
      borderRadius: 8,
      width: '90%',
      alignSelf: 'center',
    },
    slider: {
      marginTop: 10,
      marginBottom: 10,
      height: 30,
      borderRadius: 8,
      width: '90%',
      alignSelf: 'center',
    },
    swatchesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: spacing[3],
      padding: spacing[3],
    },
    swatchItem: {
      width: 44,
      height: 44,
      borderRadius: 22,
    },
    swatchItemSelected: {
      borderWidth: 3,
      borderColor: colors.heading,
    },
    swatchItemFocused: {
      borderWidth: 3,
      borderColor: colors.heading,
      outlineWidth: 2,
      outlineColor: colors.background,
      outlineStyle: 'solid',
    },
    widget: {
      marginTop: 10,
      marginBottom: 10,
      width: '95%',
      alignSelf: 'center',
    },
    buttonContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: spacing[4],
      paddingBottom: bottomBarStyles.paddingBottom,
      backgroundColor: colors.background,
      zIndex: 10,
    },
    buttonWrapper: {
      padding: 0,
      elevation: 0,
    },
  });
