import { ViewProps } from 'react-native';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

import { hideFromScreenReader } from '../../core/accessibility/hideFromScreenReader';
import { usePreferencesContext } from '../../core/contexts/PreferencesContext';
import { useTheme } from '../hooks/useTheme';
import { Icon } from './Icon';
import { Row } from './Row';
import { Text } from './Text';

type Props = ViewProps & {
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
  style,
  accessible,
  ...rest
}: Props) => {
  const { spacing, shapes, fontSizes, fontFamilies } = useTheme();
  const { accessibility } = usePreferencesContext();

  return (
    <Row
      {...(accessible === true ? {} : hideFromScreenReader)}
      accessible={accessible}
      gap={2}
      style={[
        {
          backgroundColor: backgroundColor,
          paddingLeft: spacing[1.5],
          paddingRight: spacing[2],
          paddingVertical: spacing[1],
          borderRadius: shapes.xl,
        },
        accessibility?.fontSize &&
          accessibility.fontSize >= 150 && {
            alignSelf: 'flex-start',
          },
        !icon && {
          paddingRight: spacing[1.5],
        },
        style,
      ]}
      {...rest}
    >
      {icon && <Icon icon={icon} size={fontSizes.md} color={foregroundColor} />}
      <Text
        style={{
          color: foregroundColor,
          fontSize: fontSizes.xs,
          fontFamily: fontFamilies.title,
        }}
        weight="medium"
      >
        {text}
      </Text>
    </Row>
  );
};
