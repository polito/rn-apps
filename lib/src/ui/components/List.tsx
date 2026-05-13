import { Children, PropsWithChildren, isValidElement } from 'react';
import { Platform } from 'react-native';

import { useTheme } from '../hooks/useTheme';
import { Divider } from './Divider';
import { IndentedDivider } from './IndentedDivider';

interface Props {
  dividers?: boolean;
  indented?: boolean;
  dividerSize?: number;
}

/**
 * Renders a list of items with automatic dividers based
 * on the platform
 */
export const List = ({
  dividers = Platform.select({ ios: true, android: false }),
  indented = false,
  dividerSize,
  children,
}: PropsWithChildren<Props>) => {
  const { spacing } = useTheme();
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {dividers
        ? Children.map(children, (c, i) => {
            if (!isValidElement(c)) {
              return null;
            }
            const props = c.props as any;
            const hasLeadingItem =
              !!props?.leadingItem ||
              !!props?.course ||
              !!props?.exam ||
              !!props?.person ||
              props?.ticket;
            const indent = spacing[5] + (hasLeadingItem ? 31 + spacing[2] : 0);

            return (
              <>
                {c}
                {i < Children.count(children) - 1 &&
                  (indented ? (
                    <IndentedDivider
                      key={`div-${i}`}
                      indent={indent}
                      {...(dividerSize != null ? { size: dividerSize } : {})}
                    />
                  ) : (
                    <Divider
                      key={`div-${i}`}
                      {...(dividerSize != null ? { size: dividerSize } : {})}
                      style={{
                        marginStart: spacing[5],
                      }}
                    />
                  ))}
              </>
            );
          })
        : children}
    </>
  );
};
