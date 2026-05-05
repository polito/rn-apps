import { ReactNode, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

import { Theme, useStylesheet } from '@polito/lib/ui';

type DashedOutlineProps = {
  children: ReactNode;
  color: string;
  radius: number;
};

export const DashedOutline = ({
  children,
  color,
  radius,
}: DashedOutlineProps) => {
  const styles = useStylesheet(createStyles);
  const [size, setSize] = useState({ width: 0, height: 0 });

  return (
    <View
      style={[styles.container, { borderRadius: radius }]}
      onLayout={event => {
        const { width, height } = event.nativeEvent.layout;
        setSize(prev =>
          prev.width === width && prev.height === height
            ? prev
            : { width, height },
        );
      }}
    >
      {children}
      {size.width > 0 && size.height > 0 ? (
        <Svg
          pointerEvents="none"
          style={[StyleSheet.absoluteFillObject, styles.overlay]}
          width={size.width}
          height={size.height}
        >
          <Rect
            x={0.5}
            y={0.5}
            width={size.width - 1}
            height={size.height - 1}
            rx={radius}
            ry={radius}
            fill="none"
            stroke={color}
            strokeWidth={1}
            strokeDasharray={[18, 18]}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      ) : null}
    </View>
  );
};

const createStyles = (_: Theme) =>
  StyleSheet.create({
    container: {
      position: 'relative',
    },
    overlay: {
      zIndex: 1,
    },
  });
