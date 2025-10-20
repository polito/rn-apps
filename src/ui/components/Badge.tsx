import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

import { useTheme } from '../../ui/hooks/useTheme';
import { Icon } from './Icon';
import { Row } from './Row';
import { Text } from './Text';

type Props = {
  text: string;
  icon?: IconDefinition;
  backgroundColor: string;
  foregroundColor: string;
};

export const Badge = ({
  text,
  icon,
  backgroundColor,
  foregroundColor,
}: Props) => {
  const { spacing, shapes, fontSizes } = useTheme();

  return (
    <Row
      gap={2}
      style={[
        {
          backgroundColor: backgroundColor,
          paddingLeft: spacing[1.5],
          paddingRight: spacing[2],
          paddingVertical: spacing[1],
          borderRadius: shapes.lg,
        },
        !icon && {
          paddingRight: spacing[1.5],
        },
      ]}
    >
      {icon && <Icon icon={icon} size={fontSizes.md} color={foregroundColor} />}
      <Text
        style={{ color: foregroundColor, fontSize: fontSizes.xs }}
        weight="medium"
      >
        {text}
      </Text>
    </Row>
  );
};
