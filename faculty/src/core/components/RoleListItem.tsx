import { JSX } from 'react';
import {
  StyleProp,
  TextProps,
  TextStyle,
  TouchableHighlight,
  TouchableHighlightProps,
  View,
  ViewStyle,
} from 'react-native';

import {
  Col,
  DisclosureIndicator,
  GlobalStyles,
  IS_IOS,
  Row,
  Text,
  UnreadBadge,
  useTheme,
} from '@polito/lib';
import { useNavigation } from '@react-navigation/native';

interface ListItemProps extends TouchableHighlightProps {
  title?: string | JSX.Element;
  subtitle?: string | JSX.Element;
  subtitleProps?: TextProps;
  leadingItem?: JSX.Element;
  trailingItem?: JSX.Element;
  linkTo?: string;
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
export const RoleListItem = ({
  title,
  titleStyle,
  subtitleStyle,
  subtitleProps,
  subtitle,
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
  titleProps,
  unread = false,
  ...rest
}: TouchableHighlightProps & ListItemProps) => {
  const { fontSizes, colors, spacing, fontWeights } = useTheme();
  const navigation = useNavigation<any>();

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
              lineHeight: fontSizes.md * 1.4,
              flexWrap: 'wrap',
              flexShrink: 1,
            },
            unread && {
              fontWeight: fontWeights.semibold,
            },
            titleStyle,
          ]}
          weight="medium"
          numberOfLines={undefined}
          ellipsizeMode={undefined}
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
            lineHeight: fontSizes.sm * 1.4,
            flexWrap: 'wrap',
            flexShrink: 1,
          },
          subtitleStyle,
        ]}
        numberOfLines={undefined} // oppure rimuovi completamente
        ellipsizeMode={undefined}
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
              navigation.navigate(linkTo);
            }
          : onPress
      }
      style={[
        {
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      disabled={disabled}
      {...rest}
    >
      <View
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
        {leadingItem && (
          <View
            style={{
              width: 38,
              height: 38,
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: card ? undefined : -7,
              marginRight: card ? undefined : spacing[2],
            }}
          >
            {leadingItem}
          </View>
        )}
        <Col flex={1} style={inverted && { flexDirection: 'column-reverse' }}>
          {titleElement}
          {subtitleElement}
        </Col>
        {!card &&
          (!trailingItem && (linkTo || isAction) && IS_IOS ? (
            <DisclosureIndicator />
          ) : (
            trailingItem
          ))}
      </View>
    </TouchableHighlight>
  );
};
