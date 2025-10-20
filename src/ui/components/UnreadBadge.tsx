import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TextProps } from 'react-native';

import { isNumber } from 'lodash';

import { useStylesheet } from '../../ui/hooks/useStylesheet';
import { useTheme } from '../../ui/hooks/useTheme';
import { Theme } from '../../ui/types/Theme';
import { Row } from './Row';
import { Text } from './Text';
import { VisuallyHidden } from './VisuallyHidden';

interface Props {
  text?: string | number;
  style?: TextProps['style'];
  variant?: 'outlined' | 'filled';
  isNumeric?: boolean;
}

export const UnreadBadge = ({
  text,
  style,
  variant = 'filled',
  isNumeric = false,
}: Props) => {
  const { t } = useTranslation();
  const { colors, palettes } = useTheme();
  const styles = useStylesheet(createStyles);
  const isOutlined = useMemo(() => variant === 'outlined', [variant]);
  const isDigit = isNumber(text);

  return (
    <Row
      ph={1}
      align="center"
      justify="center"
      flexShrink={0}
      style={[
        styles.badge,
        {
          backgroundColor:
            isDigit || isNumeric ? palettes.rose[600] : palettes.orange[600],
        },
        !text && styles.dotBadge,
        isOutlined && {
          backgroundColor: colors.surface,
          borderColor:
            isDigit || isNumeric ? palettes.rose[600] : palettes.orange[600],

          borderWidth: 2,
        },
        style,
      ]}
    >
      {text && (
        <Text
          style={[
            styles.badgeText,
            isOutlined && { color: palettes.orange[600] },
          ]}
        >
          {text}
          {isDigit && (
            <VisuallyHidden>
              {t('common.newItems', { count: Number(text) })}
            </VisuallyHidden>
          )}
        </Text>
      )}
    </Row>
  );
};

const createStyles = ({ fontSizes, fontWeights, shapes, palettes }: Theme) =>
  StyleSheet.create({
    badge: {
      borderRadius: shapes.xl,
      minWidth: 19,
      minHeight: 19,
    },
    dotBadge: {
      minWidth: 12,
      minHeight: 12,
      backgroundColor: palettes.rose[600],
    },
    badgeNumber: {
      backgroundColor: palettes.rose[600],
    },
    // Theme-independent hardcoded color
    // eslint-disable-next-line react-native/no-color-literals
    badgeText: {
      color: 'white',
      fontWeight: fontWeights.semibold,
      fontSize: fontSizes.sm,
      textTransform: 'uppercase',
    },
  });
