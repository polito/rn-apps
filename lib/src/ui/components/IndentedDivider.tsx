import { Divider, DividerProps } from './Divider';

interface IndentedDividerProps extends DividerProps {
  indent?: number;
}

/**
 * A divider element to separate list items with indentation
 */
export const IndentedDivider = ({ style, ...props }: IndentedDividerProps) => {
  return <Divider {...props} style={[{ height: 1 }, style]} />;
};
