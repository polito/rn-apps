import {
  IconName,
  IconPrefix,
  findIconDefinition,
} from '@fortawesome/fontawesome-svg-core';
import { Icon, Row, Text, useTheme } from '@polito/lib/ui';
import { Symbol } from '@polito/student-api-client';

import { useSymbolColor } from '../hooks/useSymbolColor.ts';

const resolveIcon = (value?: string) => {
  const [prefix, iconName] = value?.split('/') ?? [];
  if (!prefix || !iconName) return undefined;
  return findIconDefinition({
    prefix: prefix as IconPrefix,
    iconName: iconName as IconName,
  });
};

type Props = {
  status: Symbol;
};

export const CareerStatus = ({ status }: Props) => {
  const { fontSizes } = useTheme();
  const color = useSymbolColor(status);
  const icon = resolveIcon(status.icon);

  return (
    <Row align="center" gap={1.5}>
      {icon && <Icon icon={icon} size={fontSizes.md} color={color} />}
      <Text variant="secondaryText" style={{ color, fontSize: fontSizes.sm }}>
        {status.label}
      </Text>
    </Row>
  );
};
