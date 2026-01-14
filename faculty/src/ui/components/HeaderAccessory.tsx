import { Platform, StyleSheet } from 'react-native';

import { useSafeAreaSpacing } from '../../core/hooks/useSafeAreaSpacing';
import { useStylesheet } from '../hooks/useStylesheet';
import { Theme } from '../types/Theme';
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
      backgroundColor: Platform.select({
        ios:
          typeof colors.headersBackground === 'string'
            ? colors.headersBackground
            : undefined,
        android:
          typeof colors.surface === 'string' ? colors.surface : undefined,
      }),
      borderBottomWidth: Platform.select({
        ios: StyleSheet.hairlineWidth,
      }),
      borderBottomColor:
        typeof colors.divider === 'string' ? colors.divider : undefined,
      elevation: 3,
      zIndex: 1,
    },
  });
