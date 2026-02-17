import { Text as RNText, StyleSheet, TextProps } from 'react-native';
import { Platform } from 'react-native';

import { useStylesheet } from '../hooks/useStylesheet';
import { useTheme } from '../hooks/useTheme';
import { Theme } from '../types/Theme';

const getFontFamily = (
  baseFontFamily: string,
  weight: keyof Theme['fontWeights'],
) => {
  if (Platform.OS === 'android') {
    switch (weight) {
      case 'semibold':
        return `${baseFontFamily}-SemiBold`;
      case 'bold':
        return `${baseFontFamily}-Bold`;
      case 'extrabold':
        return `${baseFontFamily}-ExtraBold`;
      case 'medium':
        return `${baseFontFamily}-Medium`;
      case 'normal':
      default:
        return `${baseFontFamily}-Regular`;
    }
  }

  return baseFontFamily;
};

export interface Props extends TextProps {
  variant?:
    | 'heading'
    | 'subHeading'
    | 'title'
    | 'prose'
    | 'longProse'
    | 'secondaryText'
    | 'caption'
    | 'link';
  weight?: keyof Theme['fontWeights'];
  italic?: boolean;
  capitalize?: boolean;
  uppercase?: boolean;
}

const defaultWeights: { [key: string]: keyof Theme['fontWeights'] } = {
  heading: 'semibold',
  subHeading: 'semibold',
  title: 'semibold',
  headline: 'normal',
  caption: 'bold',
  link: 'normal',
  prose: 'normal',
  longProse: 'normal',
  secondaryText: 'normal',
};

export const Text = ({
  variant = 'prose',
  weight,
  italic = false,
  style,
  capitalize,
  uppercase,
  children,
  ...rest
}: Props) => {
  const { colors, fontFamilies, fontWeights } = useTheme();
  const styles = useStylesheet(createStyles);
  const fontFamilyName = getFontFamily(
    variant === 'heading' ? fontFamilies.heading : fontFamilies.body,
    weight ?? defaultWeights[variant],
  );
  const textWeight = fontWeights[weight ?? defaultWeights[variant]];
  const textColor =
    typeof colors[variant] === 'string' ? colors[variant] : undefined;
  const isAndroid = Platform.OS === 'android';

  return (
    <RNText
      style={[
        {
          fontFamily: fontFamilyName,
          ...(isAndroid ? {} : { fontWeight: textWeight }),
          color: textColor,
        },
        italic && {
          fontStyle: 'italic',
        },
        styles[variant],
        capitalize && { textTransform: 'capitalize' },
        uppercase && { textTransform: 'uppercase' },
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
};

const createStyles = ({ fontSizes }: Theme) =>
  StyleSheet.create({
    heading: {
      fontSize: fontSizes.md,
      lineHeight: fontSizes.md * 1.25,
    },
    subHeading: {
      fontSize: fontSizes.md,
      textTransform: 'uppercase',
    },
    title: {
      fontSize: fontSizes.xl,
      lineHeight: fontSizes.xl * 1.25,
    },
    headline: {
      fontSize: fontSizes.md,
    },
    caption: {
      fontSize: fontSizes.sm,
      textTransform: 'uppercase',
      lineHeight: fontSizes.sm * 1.25,
    },
    prose: {
      fontSize: fontSizes.md,
      lineHeight: fontSizes.md * 1.5,
    },
    longProse: {
      fontSize: fontSizes.md,
      lineHeight: fontSizes.md * 1.5,
    },
    secondaryText: {},
    link: {},
  });
