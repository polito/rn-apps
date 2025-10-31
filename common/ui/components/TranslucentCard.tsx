import { StyleSheet } from 'react-native';

import { Row, RowProps } from '@lib/ui/components/Row';
import { TranslucentView } from '@lib/ui/components/TranslucentView';
import { useStylesheet } from '@lib/ui/hooks/useStylesheet';
import { Theme } from '@lib/ui/types/Theme';

export const TranslucentCard = ({ children, ...props }: RowProps) => {
  const styles = useStylesheet(createStyles);

  return (
    <Row style={styles.container} {...props}>
      <TranslucentView fallbackOpacity={1} />
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
