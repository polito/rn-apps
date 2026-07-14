import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Badge, Palette, useTheme } from '@polito/lib/ui';
import { TicketStatus } from '@polito/student-api-client';

import {
  type TicketStatusGroup,
  getTicketStatusGroup,
} from '~/core/queries/ticketHooks';

interface TicketStatusBadgeProps {
  status: TicketStatus | string;
}

const DARK_BACKGROUND_OPACITY = 'CC';

export const TicketStatusBadge = ({ status }: TicketStatusBadgeProps) => {
  const { t } = useTranslation();
  const { dark, palettes } = useTheme();

  const statusGroup = getTicketStatusGroup(status);

  const [backgroundColor, foregroundColor] = useMemo((): [string, string] => {
    const groupStyles: Record<
      TicketStatusGroup,
      { palette: Palette; light: keyof Palette; dark: keyof Palette }
    > = {
      open: { palette: palettes.primary, light: 100, dark: 600 },
      resolved: { palette: palettes.success, light: 200, dark: 800 },
      duplicate: { palette: palettes.purple, light: 200, dark: 800 },
      waitingUser: { palette: palettes.warning, light: 200, dark: 800 },
    };
    const { palette, light, dark: darkShade } = groupStyles[statusGroup];

    return dark
      ? [palette[darkShade] + DARK_BACKGROUND_OPACITY, palette[light]]
      : [palette[light], palette[darkShade]];
  }, [statusGroup, dark, palettes]);

  return (
    <Badge
      text={t(`tickets.status.${statusGroup}`)}
      backgroundColor={backgroundColor}
      foregroundColor={foregroundColor}
    />
  );
};
