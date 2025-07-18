import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Icon } from '../../ui/components/Icon';
import { Row } from '../../ui/components/Row';
import { Text } from '../../ui/components/Text';
import {
  TouchableCard,
  TouchableCardProps,
} from '../../ui/components/TouchableCard';
import { UnreadBadge } from '../../ui/components/UnreadBadge';
import { useStylesheet } from '../../ui/hooks/useStylesheet';
import { useTheme } from '../../ui/hooks/useTheme';
import { Theme } from '../../ui/types/Theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface Props extends PropsWithChildren<TouchableCardProps> {
  name: string;
  icon: IconDefinition;
  iconColor?: string;
  linkTo?: string;
  onPress?: () => void;
  unReadCount?: number | string;
  accessibilityLabel?: string;
}

export const EmergencyCard = ({
  name,
  icon,
  iconColor,
  disabled,
  linkTo,
  onPress,
  children,
  unReadCount = 0,
  accessibilityLabel = '',
  ...props
}: Props) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const styles = useStylesheet(createStyles);
  const { dark, colors, palettes } = useTheme();
  const { t } = useTranslation();

  return (
    <TouchableCard
      accessibilityRole="button"
      onPress={linkTo ? () => navigation.navigate(linkTo) : onPress}
      {...props}
      disabled={disabled}
      style={[styles.touchable, props.style]}
      cardStyle={[styles.card, props.cardStyle]}
      accessibilityLabel={accessibilityLabel}
    >
      <Row accessibilityRole="button" justify="center" align="center">
        <Icon
          icon={icon}
          size={40}
          color={iconColor ?? palettes.primary[dark ? 400 : 500]}
        />
      </Row>
      <Row justify="center" align="baseline">
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

EmergencyCard.minWidth = 110;
EmergencyCard.maxWidth = 184;

const createStyles = ({ spacing, fontSizes }: Theme) =>
  StyleSheet.create({
    touchable: {
      flex: 1,
      height: EmergencyCard.minWidth,
      minWidth: EmergencyCard.minWidth,
      maxWidth: EmergencyCard.maxWidth,
    },
    card: {
      flex: 1,
      padding: spacing[3],
      justifyContent: 'space-between',
      overflow: 'visible',
    },
    title: {
      fontSize: fontSizes.xs,
      flexShrink: 1,
    },
  });
