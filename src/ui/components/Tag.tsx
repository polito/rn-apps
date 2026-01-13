import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

import { useTheme } from '../../ui/hooks/useTheme';
import { Row } from './Row';
import { Text } from './Text';

type Props = {
  text: string;
  icon?: IconDefinition;
  backgroundColor: string;
  foregroundColor: string;
};

export const Tag = ({ text, backgroundColor, foregroundColor }: Props) => {
  const { fontSizes, spacing } = useTheme();

  return (
    <Row
      style={{
        backgroundColor: backgroundColor,
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
