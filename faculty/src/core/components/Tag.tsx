import { useMemo } from 'react';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Row, Text, useTheme } from '@polito/lib/ui';

import color from 'color';

type Props = {
  text: string;
  icon?: IconDefinition;
};

export const Tag = ({ text }: Props) => {
  const { dark, palettes, fontSizes, spacing } = useTheme();

  const backgroundColor = useMemo(
    () =>
      color(palettes.primary[dark ? 600 : 50])
        .alpha(0.4)
        .toString(),
    [dark, palettes],
  );

  const foregroundColor = dark ? palettes.primary[400] : palettes.primary[500];

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
