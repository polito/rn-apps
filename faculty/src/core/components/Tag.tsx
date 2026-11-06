import { useMemo } from 'react';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Row, Text, useTheme } from '@polito/lib/ui';

import color from 'color';

export type TagColor = 'primary' | 'success' | 'gray';

type Props = {
  text: string;
  icon?: IconDefinition;
  color?: TagColor;
};

export const Tag = ({ text, color: tagColor = 'primary' }: Props) => {
  const { dark, palettes, fontSizes, spacing } = useTheme();

  const backgroundColor = useMemo(
    () =>
      color(palettes[tagColor][dark ? 600 : 50])
        .alpha(0.4)
        .toString(),
    [dark, palettes, tagColor],
  );

  const foregroundColor = dark
    ? palettes[tagColor][400]
    : palettes[tagColor][tagColor === 'primary' ? 500 : 700];

  return (
    <Row
      style={{
        backgroundColor,
        paddingLeft: spacing[1.5],
        paddingRight: spacing[1.5],
        borderRadius: spacing[1.5],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start',
      }}
    >
      <Text
        style={{ color: foregroundColor, fontSize: fontSizes.sm }}
        weight="medium"
      >
        {text}
      </Text>
    </Row>
  );
};
