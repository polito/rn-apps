import { PropsWithChildren, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableHighlight, ViewProps } from 'react-native';
import { isTablet as isTabletHelper } from 'react-native-device-info';

import {
  faClock,
  faLocationDot,
  faVideo,
} from '@fortawesome/free-solid-svg-icons';

import { usePreferencesContext } from '../../core/contexts/PreferencesContext';
import { useStylesheet } from '../hooks/useStylesheet';
import { useTheme } from '../hooks/useTheme';
import { Theme } from '../types/Theme';
import { AgendaIcon } from './AgendaIcon';
import { Card } from './Card';
import { Col } from './Col';
import { Icon } from './Icon';
import { LiveIndicator } from './LiveIndicator';
import { Row } from './Row';
import { Stack } from './Stack';
import { Text } from './Text';

export interface AgendaCardProps {
  /**
   * The event title
   */
  title: string;
  /**
   * The color of the event type
   */
  color?: string;
  /**
   * Extra information on this event
   */
  description?: string;
  /**
   * The icon of the event
   */
  icon?: string;
  /**
   * The color of the event icon
   */
  iconColor?: string;
  /**
   * Shows a live indicator
   */
  live?: boolean;
  /**
   * The room in which this event takes place
   */
  location?: string;
  /**
   * Event time information
   */
  time?: string;
  /**
   * A subtitle (ie event type)
   */
  type: string;
  /**
   * On card pressed handler
   */
  onPress?: () => void;
  /**
  /**
   * If true, the card will be compact
   */
  isCompact?: boolean;
  /**
   * If true, the card will be a next lecture card
   */
  nextLecture?: boolean;
  /**
   * The date of the next lecture
   */
  nextDate?: string;
  accessibilityLabel?: string;
  style?: ViewProps['style'];
}

/**
 * A card used to present an agenda item
 */
export const AgendaCard = ({
  title,
  children,
  color,
  isCompact = false,
  icon,
  iconColor,
  live = false,
  time,
  type,
  location,
  onPress,
  style,
  nextLecture = false,
  nextDate,
  accessibilityLabel,
}: PropsWithChildren<AgendaCardProps>) => {
  const styles = useStylesheet(createStyles);
  const { colors, dark, palettes, shapes, spacing, fontSizes } = useTheme();
  const { accessibility } = usePreferencesContext();
  const { t, i18n } = useTranslation();
  const isTablet = useMemo(() => isTabletHelper(), []);
  const showsIcon = useMemo(() => iconColor && icon, [icon, iconColor]);

  const secondaryIfLecture = useMemo(
    () => ({ color: colors.lectureCardSecondary }),
    [colors.lectureCardSecondary],
  );

  const computedAccessibilityLabel = useMemo(() => {
    const parts = [type, title];
    if (time) parts.push(time);
    if (location) parts.push(location);
    return parts.join(', ');
  }, [type, title, time, location]);

  return (
    <Card
      rounded
      spaced={false}
      style={[
        color
          ? {
              borderWidth: 2,
              borderColor: color,
            }
          : undefined,
        {
          marginVertical: isCompact ? undefined : spacing[2],
        },
        style,
        isCompact &&
          !isTablet && {
            borderRadius: shapes.md,
          },
      ]}
    >
      <TouchableHighlight
        underlayColor={colors.touchableHighlight}
        style={[
          styles.touchable,
          isCompact ? styles.compactTouchable : undefined,
          isCompact &&
            !isTablet && {
              paddingHorizontal: spacing[1],
              paddingVertical: spacing[1],
            },
        ]}
        onPress={onPress}
        accessible
        accessibilityRole={onPress ? 'button' : undefined}
        accessibilityLabel={accessibilityLabel ?? computedAccessibilityLabel}
        accessibilityHint={onPress ? t('common.tapToNavigate') : undefined}
        accessibilityLanguage={i18n.language}
        accessibilityState={{ disabled: !onPress }}
        disabled={!onPress}
      >
        <Col
          gap={isCompact ? 0.5 : 2}
          importantForAccessibility="no-hide-descendants"
          style={
            isCompact && { height: '100%', justifyContent: 'space-between' }
          }
        >
          {/* Time and event type are only shown if the card is not compact */}
          {!isCompact && !nextLecture && (
            <>
              <Row align="flex-end" flexGrow={1} gap={2}>
                <Row gap={2} flexShrink={0}>
                  <Text
                    style={[
                      styles.time,
                      secondaryIfLecture,
                      accessibility?.fontSize &&
                      Number(accessibility?.fontSize) >= 150
                        ? { marginTop: 30 }
                        : undefined,
                    ]}
                  >
                    {time && time}
                  </Text>
                  {!isCompact && live && <LiveIndicator showText />}
                </Row>
                {accessibility?.fontSize &&
                  Number(accessibility?.fontSize) < 150 && (
                    <Text
                      uppercase
                      variant="caption"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[secondaryIfLecture, styles.typeMeta]}
                    >
                      {type}
                    </Text>
                  )}
              </Row>
              <Row style={{ flex: 1 }}>
                {accessibility?.fontSize &&
                  Number(accessibility?.fontSize) >= 150 && (
                    <Text
                      uppercase
                      variant="caption"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[secondaryIfLecture, styles.typeMetaFullWidth]}
                    >
                      {type}
                    </Text>
                  )}
              </Row>
            </>
          )}
          {nextLecture && !isCompact && (
            <Col
              align="flex-start"
              justify="space-between"
              flexGrow={1}
              gap={2}
            >
              <Row gap={1} align="center" justify="space-between">
                <Text uppercase variant="caption" style={secondaryIfLecture}>
                  {type}
                </Text>
              </Row>
              {!isCompact && live && <LiveIndicator showText />}
              <Row gap={1} mt={1.5} align="center">
                <Icon
                  icon={faClock}
                  color={palettes.gray[dark ? 300 : 600]}
                  size={isCompact && !isTablet ? fontSizes.xs : undefined}
                />
                <Text style={[styles.time, secondaryIfLecture]}>
                  {' '}
                  {time && time}
                </Text>
              </Row>
            </Col>
          )}
          {nextLecture && isCompact && (
            <Col
              align="flex-start"
              justify="space-between"
              flexGrow={1}
              gap={2}
            >
              <Row gap={1} align="center" justify="space-between">
                <Text uppercase variant="caption" style={secondaryIfLecture}>
                  {type}
                </Text>
                {!isCompact && live && <LiveIndicator showText />}
              </Row>
              <Row gap={1} mt={1.5} align="center">
                <Icon
                  icon={faVideo}
                  color={palettes.gray[dark ? 300 : 600]}
                  size={isCompact && !isTablet ? fontSizes.xs : undefined}
                />
                <Text
                  variant="secondaryText"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ color: palettes.gray[dark ? 100 : 700] }}
                >
                  {nextDate}
                </Text>
              </Row>

              <Row gap={1} mt={1.5} align="center">
                <Icon
                  icon={faClock}
                  color={palettes.gray[dark ? 300 : 600]}
                  size={isCompact && !isTablet ? fontSizes.xs : undefined}
                />
                <Text style={[styles.time, secondaryIfLecture]}>
                  {time && time}
                </Text>
              </Row>
            </Col>
          )}
          {!nextLecture && (
            <Stack
              {...(isCompact
                ? {
                    direction: !isTablet ? 'column' : 'row',
                    flexGrow: 1,
                    gap: isTablet ? 2 : undefined,
                  }
                : { align: 'center', gap: 2 })}
            >
              {showsIcon && <AgendaIcon icon={icon} color={iconColor!} />}
              <Text
                style={[
                  styles.title,
                  isCompact
                    ? isTablet
                      ? styles.titleCompactTablet
                      : styles.titleCompact
                    : undefined,
                  accessibility?.fontSize &&
                  Number(accessibility?.fontSize) >= 150
                    ? { lineHeight: 30 }
                    : undefined,
                ]}
                numberOfLines={isCompact ? (isTablet ? 2 : 3) : undefined}
              >
                {title}
              </Text>
            </Stack>
          )}

          {/* Extra children are only shown if the card is not compact */}
          {!isCompact && children}

          {!isCompact && location && (
            <Row gap={1} mt={1.5} align="center">
              <Icon
                icon={faLocationDot}
                color={palettes.gray[dark ? 300 : 600]}
                size={isCompact && !isTablet ? fontSizes.xs : undefined}
              />
              <Text
                variant="secondaryText"
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ color: palettes.gray[dark ? 100 : 700] }}
              >
                {location}
              </Text>
            </Row>
          )}
          {isCompact && location && (
            <Row gap={1} mt={1.5} align="center">
              <Text
                variant="secondaryText"
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ color: palettes.gray[dark ? 100 : 700] }}
              >
                {location}
              </Text>
              <Icon
                icon={faLocationDot}
                color={palettes.gray[dark ? 300 : 600]}
                size={!isTablet ? fontSizes.xs : undefined}
              />
            </Row>
          )}
        </Col>
      </TouchableHighlight>
    </Card>
  );
};

const createStyles = ({
  colors,
  palettes,
  fontSizes,
  fontWeights,
  spacing,
  dark,
}: Theme) =>
  StyleSheet.create({
    title: {
      flex: 1,
      fontWeight: fontWeights.semibold,
      fontSize: fontSizes.md,
      lineHeight: fontSizes.md * 1.3,
    },
    titleCompact: {
      fontSize: fontSizes.xs,
      lineHeight: fontSizes.xs * 1.3,
    },
    titleCompactTablet: {
      fontSize: fontSizes.sm,
      lineHeight: fontSizes.xs * 1.3,
    },
    touchable: {
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[3],
    },
    compactTouchable: {
      paddingHorizontal: spacing[2],
      paddingVertical: spacing[2],
      height: '100%',
    },
    time: {
      color: colors.secondaryText,
      fontSize: fontSizes.sm,
    },
    typeMeta: {
      flexGrow: 1,
      flexShrink: 1,
      minWidth: 0,
      textAlign: 'right',
    },
    typeMetaFullWidth: {
      width: '100%',
    },
    type: {
      color: dark ? palettes.text[300] : palettes.text[400],
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      marginTop: spacing[1.5],
    },
  });
