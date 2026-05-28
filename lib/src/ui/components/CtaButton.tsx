import { ReactNode, useMemo } from 'react';
import {
  StyleSheet,
  TextStyle,
  TouchableHighlight,
  TouchableHighlightProps,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TextWithLinks } from '@polito/lib/ui';
import { shadeColor } from '@polito/lib/ui';
import { Icon, Row, Text } from '@polito/lib/ui';
import { Theme, useStylesheet, useTheme } from '@polito/lib/ui';

import { useFeedbackContext } from '../../core/contexts/FeedbackContext';
import { ActivityIndicator } from '../../ui/components/ActivityIndicator';

interface Props extends TouchableHighlightProps {
  containerStyle?: ViewStyle;
  icon?: any;
  absolute?: boolean;
  title?: string;
  rightExtra?: ReactNode;
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
  rightExtra,
  hint,
  containerStyle,
  variant = 'filled',
  textStyle,
  ...rest
}: Props) => {
  const { palettes, colors, fontSizes, spacing, dark, fontWeights } =
    useTheme();
  const styles = useStylesheet(createStyles);
  const { left, right } = useSafeAreaInsets();
  const { isFeedbackVisible } = useFeedbackContext();
  const hasTitle = Boolean(title?.trim());

  const outlined = variant === 'outlined';

  const underlayColor = useMemo(() => {
    if (variant === 'outlined') {
      if (dark) return shadeColor(colors.background, 20);
      else if (destructive) return '#FFF1F2';
      else return shadeColor(colors.background, -10);
    } else {
      if (destructive) return palettes.danger[700];
      return palettes.primary[500];
    }
  }, [
    colors.background,
    dark,
    destructive,
    palettes.danger,
    palettes.primary,
    variant,
  ]);

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

  return (
    <View
      style={[
        styles.container,
        absolute && {
          position: 'absolute',
          left,
          right,
          bottom: isFeedbackVisible ? spacing[20] : 0,
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
          !hasTitle && styles.iconOnlyButton,
          variant === 'outlined' && {
            backgroundColor: underlayColor,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: color,
          },
          disabled &&
            variant === 'outlined' && {
              borderWidth: 0,
            },
          variant === 'filled' && {
            backgroundColor: color,
          },
          disabled && variant === 'filled' && styles.disabledButton,
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
          <Row style={{ opacity: loading ? 0 : 1 }}>
            {/* {!loading && ( */}
            {/*   <View style={{ marginHorizontal: spacing[1] }}>{icon}</View> */}
            {/* )} */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {icon && (
                <Icon
                  icon={icon}
                  size={fontSizes.md}
                  color={
                    variant === 'filled' ? (palettes.gray[50] as string) : color
                  }
                  style={{ marginRight: hasTitle ? spacing[2] : 0 }}
                />
              )}
              {hasTitle && (
                <TextWithLinks
                  isCta={true}
                  style={[
                    styles.textStyle,
                    variant === 'outlined' && {
                      borderColor: palettes.primary[400],
                    },
                    {
                      color: variant === 'filled' ? palettes.gray[50] : color,
                    },
                    disabled
                      ? {
                          color: success
                            ? color
                            : (colors.disableTitle as string),
                        }
                      : undefined,
                    textStyle,
                  ]}
                  baseStyle={{ fontWeight: fontWeights.medium }}
                >
                  {title}
                </TextWithLinks>
              )}
              {rightExtra && rightExtra}
            </View>
          </Row>
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

const createStyles = ({
  colors,
  shapes,
  spacing,
  fontSizes,
  fontWeights,
  palettes,
}: Theme) =>
  StyleSheet.create({
    container: {
      // padding: spacing[5],
    },
    button: {
      paddingHorizontal: spacing[5] + 3,
      paddingVertical: spacing[3],
      borderRadius: shapes.lg,
      alignItems: 'center',
    },
    iconOnlyButton: {
      paddingHorizontal: 21,
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
      fontWeight: fontWeights.semibold,
      textAlign: 'center',
      color: palettes.gray[50],
      fontFamily: 'Montserrat-SemiBold',
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
