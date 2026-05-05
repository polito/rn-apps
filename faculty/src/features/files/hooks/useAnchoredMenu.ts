import { RefObject, useCallback, useRef, useState } from 'react';
import { View } from 'react-native';

type AnchorPosition = {
  top: number;
  left: number;
};

type AnchorStrategy =
  | {
      align: 'left';
      left?: number;
    }
  | {
      align: 'right';
      minLeft?: number;
      menuWidth: number;
    };

type OpenMenuOptions = {
  verticalOffset?: number;
  strategy: AnchorStrategy;
};

const DEFAULT_ANCHOR_POSITION: AnchorPosition = { top: 170, left: 18 };

export const useAnchoredMenu = (initialPosition = DEFAULT_ANCHOR_POSITION) => {
  const buttonRef: RefObject<View> = useRef<View>(null);
  const [visible, setVisible] = useState(false);
  const [anchorPosition, setAnchorPosition] =
    useState<AnchorPosition>(initialPosition);

  const openFromRef = useCallback(
    ({ verticalOffset = 6, strategy }: OpenMenuOptions) => {
      const node = buttonRef.current;
      if (node?.measureInWindow) {
        node.measureInWindow((x: number, y: number, w: number, h: number) => {
          const top = y + h + verticalOffset;
          const left =
            strategy.align === 'right'
              ? Math.max(strategy.minLeft ?? 18, x + w - strategy.menuWidth)
              : (strategy.left ?? 18);

          setAnchorPosition({ top, left });
          setVisible(true);
        });
        return;
      }

      setVisible(true);
    },
    [],
  );

  const close = useCallback(() => {
    setVisible(false);
  }, []);

  return {
    buttonRef,
    visible,
    setVisible,
    anchorPosition,
    openFromRef,
    close,
  };
};
