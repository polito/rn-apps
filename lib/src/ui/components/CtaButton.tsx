import { ReactElement, useMemo } from 'react';
import {
  Platform,
  StyleSheet,
  TextStyle,
  TouchableHighlight,
  TouchableHighlightProps,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useFeedbackContext } from '../../core/contexts/FeedbackContext';
import { usePreferencesContext } from '../../core/contexts/PreferencesContext';
import { useSafeBottomBarHeight } from '../hooks/useSafeBottomBarHeight';
import { useStylesheet } from '../hooks/useStylesheet';
import { useTheme } from '../hooks/useTheme';
import { Theme } from '../types/Theme';
import { shadeColor } from '../utils/colors';
import { ActivityIndicator } from './ActivityIndicator';
import { Icon } from './Icon';
import { IconWithProgress } from './IconWithProgress';
import { Text } from './Text';
import { TextWithLinks } from './TextWithLinks';

interface Props extends TouchableHighlightProps {
  containerStyle?: ViewStyle;
  icon?: any;
  absolute?: boolean;
  title?: string;
  leftExtra?: ReactElement;
  rightExtra?: ReactElement;
  loading?: boolean;
  action: () => unknown | Promise<unknown>;
  variant?: 'filled' | 'outlined';
  destructive?: boolean;
  success?: boolean;
  hint?: string;
  textStyle?: TextStyle;
  progress?: number;
}

/**
 * A call-to-action button with in-place loading indicator.
 */
export const CtaButton = ({
  style,
  absolute = true,
  title,
  loading,
  disabled,
  destructive = false,
  success = false,
  action,
  icon,
  leftExtra,
  rightExtra,
  hint,
  containerStyle,
  variant = 'filled',
  textStyle,
  progress,
  ...rest
}: Props) => {
  const { palettes, colors, fontSizes, spacing, dark, fontWeights } =
    useTheme();
  const styles = useStylesheet(createStyles);
  const { left, right } = useSafeAreaInsets();
  const bottomBarHeight = useSafeBottomBarHeight();
  const { isFeedbackVisible } = useFeedbackContext();
  const { accessibility } = usePreferencesContext();

  const outlined = variant === 'outlined';

  const color = useMemo(() => {
    if (success) {
      return dark ? palettes.success[400] : palettes.success[700];
    }
    if (destructive) return palettes.danger[600];
    return palettes.primary[500];
  }, [
    dark,
    destructive,
    palettes.danger,
    palettes.primary,
    palettes.success,
    success,
  ]);

  const outlinedColors = useMemo(
    () => ({
      border: dark ? palettes.primary[400] : palettes.primary[500],
      background: dark
        ? 'rgba(0, 109, 185, 0.22)'
        : `${palettes.lightBlue[50]}80`,
      text: dark ? palettes.primary[200] : palettes.primary[500],
    }),
    [dark, palettes.lightBlue, palettes.primary],
  );

  const disabledForegroundColor = useMemo(
    () =>
      dark && variant === 'filled' ? palettes.gray[700] : colors.disableTitle,
    [colors.disableTitle, dark, palettes.gray, variant],
  );

  const underlayColor = useMemo(() => {
    if (variant === 'outlined') {
      if (dark) return shadeColor(colors.background, 20);
      return shadeColor(colors.background, -10);
    }
    if (destructive) return palettes.danger[700];
    return palettes.primary[600];
  }, [
    colors.background,
    dark,
    destructive,
    palettes.danger,
    palettes.primary,
    variant,
  ]);

  return (
    <View
      style={[
        styles.container,
        absolute && {
          position: 'absolute',
          left: Platform.select({ ios: left }),
          right,
          bottom: bottomBarHeight + (isFeedbackVisible ? spacing[20] : 0),
        },
        !!hint && { paddingTop: spacing[3] },
        containerStyle,
      ]}
    >
      {hint && (
        <View
          importantForAccessibility="no-hide-descendants"
          accessibilityElementsHidden={true}
        >
          <Text style={styles.hint}>{hint}</Text>
        </View>
      )}
      <TouchableHighlight
        accessibilityRole="button"
        underlayColor={underlayColor}
        disabled={disabled || loading}
        style={[
          styles.button,
          variant === 'outlined' && {
            borderColor: outlinedColors.border,
            borderWidth: 1,
            backgroundColor: outlinedColors.background,
          },
          variant === 'filled' && {
            borderColor: color,
            borderWidth: 1,
            backgroundColor: color,
          },
          disabled && styles.disabledButton,
          style,
        ]}
        accessibilityLabel={title}
        onPress={action}
        {...rest}
      >
        <View>
          <View style={styles.stack}>
            {loading && (
              <ActivityIndicator
                color={
                  outlined
                    ? destructive
                      ? palettes.danger[600]
                      : palettes.primary[500]
                    : 'white'
                }
              />
            )}
          </View>
          {/* {!loading && ( */}
          {/*   <View style={{ marginHorizontal: spacing[1] }}>{icon}</View> */}
          {/* )} */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: title ? undefined : 'center',
            }}
          >
            {icon &&
              Number(accessibility?.fontSize) < 150 &&
              (progress !== undefined ? (
                <View
                  style={{
                    marginRight: title ? spacing[2] : 0,
                    paddingHorizontal: spacing[1],
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconWithProgress
                    icon={icon}
                    size={fontSizes.md}
                    color={
                      disabled
                        ? disabledForegroundColor
                        : variant === 'filled'
                          ? colors.white
                          : outlinedColors.text
                    }
                    progress={progress}
                    progressColor={
                      disabled
                        ? disabledForegroundColor
                        : variant === 'filled'
                          ? colors.white
                          : outlinedColors.text
                    }
                  />
                </View>
              ) : (
                <Icon
                  icon={icon}
                  size={fontSizes.md}
                  color={
                    disabled
                      ? disabledForegroundColor
                      : variant === 'filled'
                        ? colors.white
                        : outlinedColors.text
                  }
                  style={{
                    marginRight: title ? spacing[2] : 0,
                    paddingHorizontal: spacing[1],
                  }}
                />
              ))}
            {title ? leftExtra : null}
            {title ? (
              <TextWithLinks
                style={[
                  styles.textStyle,
                  variant === 'outlined' && {
                    borderColor: palettes.primary[400],
                  },
                  {
                    color:
                      variant === 'filled' ? colors.white : outlinedColors.text,
                  },
                  disabled
                    ? { color: success ? color : disabledForegroundColor }
                    : undefined,
                  textStyle,
                ]}
                baseStyle={{
                  fontWeight: fontWeights.semibold,
                  color:
                    variant === 'filled' ? colors.white : outlinedColors.text,
                  ...(disabled && {
                    color: success ? color : disabledForegroundColor,
                  }),
                }}
                isCta={true}
              >
                {title}
              </TextWithLinks>
            ) : null}
            {rightExtra && rightExtra}
          </View>
        </View>
      </TouchableHighlight>
    </View>
  );
};

/**
 * A spacer to be added at the bottom of the underlying scrolling container
 * to ensure that the CtaButton won't cover the last elements
 */
export const CtaButtonSpacer = () => {
  const { spacing } = useTheme();
  return <View style={{ height: spacing[20] }} />;
};

const createStyles = ({ colors, shapes, spacing, fontSizes }: Theme) =>
  StyleSheet.create({
    container: {
      padding: spacing[4],
    },
    button: {
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[3],
      borderRadius: shapes.lg,
      alignItems: 'center',
    },
    disabledButton: {
      backgroundColor: colors.secondaryText,
      borderColor: colors.secondaryText,
    },
    stack: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textStyle: {
      fontSize: fontSizes.sm,
      fontWeight: '600',
      lineHeight: 21,
      textAlign: 'center',
      color: colors.white,
    },
    icon: {
      marginVertical: -2,
      marginRight: spacing[2],
    },
    subtitle: {
      marginTop: spacing[2],
    },
    hint: {
      color: colors.caption,
      fontSize: fontSizes.xs,
      textAlign: 'center',
      paddingBottom: spacing[2],
    },
  });
