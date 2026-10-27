import { useMemo } from 'react';

import { Badge, useTheme } from '@polito/lib/ui';

type Tone = 'success' | 'danger' | 'primary';

type Props = {
  text: string;
  tone: Tone;
};

const DARK_BACKGROUND_OPACITY = 'CC';

export const ExamStatusBadge = ({ text, tone }: Props) => {
  const { dark, palettes } = useTheme();

  const [backgroundColor, foregroundColor] = useMemo((): [string, string] => {
    const palette = palettes[tone];
    return dark
      ? [palette[800] + DARK_BACKGROUND_OPACITY, palette[200]]
      : [palette[100], palette[700]];
  }, [dark, palettes, tone]);

  return (
    <Badge
      text={text}
      backgroundColor={backgroundColor}
      foregroundColor={foregroundColor}
    />
  );
};
