import { ReactElement } from 'react';
import {
  StyleProp,
  StyleSheet,
  TextProps,
  TextStyle,
  TouchableHighlight,
  TouchableHighlightProps,
  View,
  ViewStyle,
} from 'react-native';

import { To, resolveLinkTo } from '@polito/lib/core';
import { GlobalStyles } from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { IS_IOS } from '../../core/constants';
import { usePreferencesContext } from '../../core/contexts/PreferencesContext';
import { useStylesheet } from '../hooks/useStylesheet';
import { useTheme } from '../hooks/useTheme';
import { Theme } from '../types/Theme';
import { Col } from './Col';
import { DisclosureIndicator } from './DisclosureIndicator';
import { Row } from './Row';
import { Text } from './Text';
import { UnreadBadge } from './UnreadBadge';

export interface ListItemProps extends TouchableHighlightProps {
  title: string | ReactElement;
  subtitle?: string | ReactElement;
  subtitleProps?: TextProps;
  leadingItem?: ReactElement;
  trailingItem?: ReactElement;
  linkTo?: To<any>;
  children?: any;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  isAction?: boolean;
  card?: boolean;
  inverted?: boolean;
  titleProps?: TextProps;
  multilineTitle?: boolean;
  unread?: boolean;
  isInVisibleRange?: boolean;
}

/**
 * A list item with support for a title, subtitle, leading and trailing
 * elements. If a linkTo is provided, a forward icon is automatically
 * displayed as a trailing element on iOS.
 */
export const ListItem = ({
  title,
  titleStyle,
  subtitle,
  subtitleStyle,
  subtitleProps,
  leadingItem,
  trailingItem,
  linkTo,
  containerStyle,
  onPress,
  isAction,
  disabled,
  style,
  card,
  children,
  inverted = false,
  multilineTitle = false,
  titleProps,
  unread = false,
  accessibilityLabel,
  accessibilityState,
  accessibilityRole,
  accessibilityHint,
  ...rest
}: ListItemProps) => {
  const { fontSizes, fontFamilies, fontWeights, colors, spacing } = useTheme();
  const styles = useStylesheet(createStyles);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { accessibility } = usePreferencesContext();
  const isDisabled = Boolean(disabled);
  const hasCompositeLabel =
    accessibilityLabel != null && accessibilityLabel !== '';
  const titleElement =
    typeof title === 'string' ? (
      <Row align="center" gap={2}>
        {unread && <UnreadBadge />}
        <Text
          variant="title"
          style={[
            GlobalStyles.grow,
            {
              fontSize: fontSizes.md,
              fontFamily: fontFamilies.title,
              lineHeight:
                accessibility?.fontSize && accessibility.fontSize <= 125
                  ? fontSizes.sm * 1.4
                  : fontSizes.sm * 2,
            },
            unread && {
              fontWeight: fontWeights.semibold,
            },
            titleStyle,
          ]}
          weight="medium"
          numberOfLines={
            multilineTitle
              ? undefined
              : (titleProps?.numberOfLines ?? (card ? 2 : 1))
          }
          ellipsizeMode={titleProps?.ellipsizeMode ?? 'tail'}
          {...titleProps}
        >
          {title}
        </Text>
      </Row>
    ) : (
      title
    );

  const subtitleElement = subtitle ? (
    typeof subtitle === 'string' ? (
      <Text
        variant="secondaryText"
        style={[
          {
            fontSize: fontSizes.sm,
            lineHeight:
              accessibility?.fontSize && accessibility.fontSize <= 125
                ? fontSizes.sm * 1.4
                : fontSizes.sm * 2.5,
          },
          subtitleStyle,
        ]}
        numberOfLines={2}
        ellipsizeMode="tail"
        {...subtitleProps}
      >
        {subtitle}
      </Text>
    ) : (
      subtitle
    )
  ) : null;

  return (
    <TouchableHighlight
      underlayColor={colors.touchableHighlight}
      onPress={
        linkTo
          ? () => {
              const resolved = resolveLinkTo(linkTo);
              navigation.navigate(resolved.name as any, resolved.params);
            }
          : onPress
      }
      style={[
        {
          opacity: isDisabled ? 0.5 : 1,
        },
        style,
      ]}
      disabled={isDisabled}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{
        disabled: isDisabled,
        ...accessibilityState,
      }}
      {...rest}
    >
      <View
        importantForAccessibility={
          hasCompositeLabel ? 'no-hide-descendants' : undefined
        }
        accessibilityElementsHidden={hasCompositeLabel ? IS_IOS : undefined}
        style={[
          {
            minHeight: 60,
            flexDirection: card ? 'column' : 'row',
            alignItems: 'center',
            paddingHorizontal: spacing[5],
            paddingVertical: spacing[2],
          },
          containerStyle,
        ]}
      >
        {children}
        {leadingItem && <View style={styles.leadingSlot}>{leadingItem}</View>}
        <Col flex={1} style={inverted && { flexDirection: 'column-reverse' }}>
          {titleElement}
          {subtitleElement}
        </Col>
        {!card &&
          (() => {
            const content =
              !trailingItem && (linkTo || isAction) ? (
                <DisclosureIndicator />
              ) : (
                trailingItem
              );

            return content ? (
              <View style={styles.trailingSlot}>{content}</View>
            ) : null;
          })()}
      </View>
    </TouchableHighlight>
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    leadingSlot: {
      width: 38,
      height: 38,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: -7,
      marginRight: spacing[2],
    },
    trailingSlot: {
      height: 38,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: spacing[2],
      marginRight: -7,
    },
  });
