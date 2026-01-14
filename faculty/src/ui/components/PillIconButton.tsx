import { StyleSheet } from 'react-native';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

import { useStylesheet } from '../hooks/useStylesheet';
import { Theme } from '../types/Theme';
import { Icon } from './Icon';
import { PillButton, PillButtonProps } from './PillButton';
import { Row } from './Row';
import { Text } from './Text';

export interface PillIconButtonProps extends PillButtonProps {
  icon: IconDefinition;
}

export const PillIconButton = ({
  children,
  icon,
  ...props
}: PillIconButtonProps) => {
  const styles = useStylesheet(createStyles);

  return (
    <PillButton {...props}>
      <Row align="center" gap={1.5}>
        <Icon icon={icon} color="white" />
        <Text
          style={[
            styles.text,
            props.variant === 'neutral'
              ? styles.textNeutral
              : styles.textPrimary,
          ]}
        >
          {children}
        </Text>
      </Row>
    </PillButton>
  );
};

const createStyles = ({ fontWeights }: Theme) =>
  StyleSheet.create({
    text: {
      fontWeight: fontWeights.medium,
    },
    textNeutral: {},
    // eslint-disable-next-line react-native/no-color-literals
    textPrimary: {
      color: 'white',
    },
  });
