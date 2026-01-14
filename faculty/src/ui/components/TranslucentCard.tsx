import { StyleSheet } from 'react-native';

import { TranslucentView } from '../../core/components/TranslucentView';
import { useStylesheet } from '../hooks/useStylesheet';
import { Theme } from '../types/Theme';
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
