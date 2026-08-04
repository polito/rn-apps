import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as faStarFilled } from '@fortawesome/free-solid-svg-icons';
import { To, resolveLinkTo, usePreferencesContext } from '@polito/lib/core';
import {
  Icon,
  IconButton,
  Row,
  Text,
  Theme,
  TouchableCard,
  type TouchableCardProps,
  UnreadBadge,
  uniformInsets,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppPreferences } from '~/core/types/preferences';

interface Props extends PropsWithChildren<TouchableCardProps> {
  name: string;
  icon: IconDefinition;
  iconColor?: string;
  favorite?: boolean;
  onFavoriteChange: (favorite: boolean) => void;
  linkTo?: To<any>;
  onPress?: () => void;
  unReadCount?: number | string;
  accessibilityLabel?: string;
}

export const ServiceCard = ({
  name,
  icon,
  iconColor,
  favorite,
  onFavoriteChange,
  disabled,
  linkTo,
  onPress,
  children,
  unReadCount = 0,
  accessibilityLabel = '',
  ...props
}: Props) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { dark, colors, palettes } = useTheme();
  const { t } = useTranslation();
  const { accessibility } = usePreferencesContext<AppPreferences>();
  const isLargeFont = Number(accessibility?.fontSize) >= 125;

  const styles = useStylesheet(theme => createStyles(theme, isLargeFont));
  return (
    <TouchableCard
      accessibilityRole="button"
      onPress={
        linkTo
          ? () => {
              const resolved = resolveLinkTo(linkTo);
              navigation.navigate(resolved.name as any, resolved.params);
            }
          : onPress
      }
      {...props}
      disabled={disabled}
      style={[styles.touchable, props.style]}
      cardStyle={[styles.card, props.cardStyle]}
      accessibilityLabel={accessibilityLabel}
    >
      <Row accessibilityRole="button" justify="space-between" align="center">
        <Icon
          icon={icon}
          size={28}
          color={iconColor ?? palettes.primary[dark ? 400 : 500]}
        />
        <IconButton
          accessibilityLabel={
            favorite
              ? t('servicesScreen.favoriteActive')
              : t('servicesScreen.favoriteInactive')
          }
          icon={favorite ? faStarFilled : faStar}
          color={favorite ? palettes.orange[400] : colors.secondaryText}
          onPress={() => onFavoriteChange(!favorite)}
          style={styles.favButton}
          disabled={disabled}
          hitSlop={uniformInsets(16)}
        />
      </Row>
      <Row justify="space-between" align="flex-end">
        <Text variant="title" style={styles.title}>
          {name}
        </Text>
        {typeof unReadCount === 'number' && unReadCount > 0 && !disabled && (
          <UnreadBadge text={unReadCount} />
        )}
        {typeof unReadCount === 'string' && !disabled && (
          <UnreadBadge text={unReadCount} isNumeric={true} />
        )}
      </Row>
      {children}
    </TouchableCard>
  );
};

ServiceCard.minWidth = 110;
ServiceCard.maxWidth = 384;

const createStyles = ({ spacing, fontSizes }: Theme, isLargeFont: boolean) =>
  StyleSheet.create({
    touchable: {
      flex: 1,
      width: '100%',
      height: ServiceCard.minWidth,
      ...(isLargeFont
        ? {}
        : {
            minWidth: ServiceCard.minWidth,
            maxWidth: ServiceCard.maxWidth,
          }),
    },
    card: {
      flex: 1,
      padding: spacing[3],
      justifyContent: 'space-between',
      overflow: 'visible',
    },
    title: {
      fontSize: fontSizes.md,
      flexShrink: 1,
    },
    favButton: {
      padding: spacing[2],
    },
  });
