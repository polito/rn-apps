import { StyleSheet } from 'react-native';

import { TranslucentView } from '../../../src/core/components/TranslucentView';
import { useStylesheet } from '../../ui/hooks/useStylesheet';
import { Theme } from '../../ui/types/Theme';
import { Row, RowProps } from './Row';

export const TranslucentCard = ({ children, ...props }: RowProps) => {
  const styles = useStylesheet(createStyles);

  return (
    <Row style={styles.container} {...props}>
      <TranslucentView /* ATTENZIONE fallbackOpacity={1} */ />
      {children}
    </Row>
  );
};

const createStyles = ({ shapes }: Theme) =>
  StyleSheet.create({
    container: {
      borderRadius: shapes.lg,
      overflow: 'hidden',
      elevation: 12,
    },
  });
