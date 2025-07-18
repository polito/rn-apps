import { Platform, StyleSheet } from 'react-native';

import { Row, RowProps } from './Row';
import { useStylesheet } from '../../ui/hooks/useStylesheet';
import { Theme } from '../../ui/types/Theme';

import { useSafeAreaSpacing } from '../../../src/core/hooks/useSafeAreaSpacing';
import React from 'react';

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
          ios: typeof colors.headersBackground === 'string' ? colors.headersBackground : undefined,
          android: typeof colors.surface === 'string' ? colors.surface : undefined,
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
  