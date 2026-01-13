import { useTheme } from '../hooks/useTheme';
import { Divider } from './Divider';

/**
 * A divider element to separate list items with indentation
 */
export const IndentedDivider = () => {
  const { spacing } = useTheme();
  return <Divider style={{ marginStart: spacing[5] }} />;
};
