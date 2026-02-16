import { StyleSheet } from 'react-native';

import { useSafeAreaSpacing } from '../../../src/core/hooks/useSafeAreaSpacing';
import { useStylesheet } from '../../ui/hooks/useStylesheet';
import { Theme } from '../../ui/types/Theme';
import { Row, RowProps } from './Row';

export type HeaderAccessoryProps = RowProps;

export const HeaderAccessory = ({
  children,
  style,
  ...props
}: HeaderAccessoryProps) => {
  const styles = useStylesheet(createStyles);
  const { paddingHorizontal } = useSafeAreaSpacing();

  return (
    <Row {...props} style={[styles.container, paddingHorizontal, style]}>
      {children}
    </Row>
  );
};

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surface,

      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor:
        typeof colors.divider === 'string' ? colors.divider : undefined,
      elevation: 0,
      zIndex: 1,
    },
  });
