import { useCallback, useState } from 'react';

import { BottomModalProps } from '../../ui/components/BottomModal';

type OpenBottomModalOptions = Omit<
  Partial<BottomModalProps>,
  'children' | 'visible' | 'onClose'
>;

export const useBottomModal = () => {
  const [modal, setModal] = useState<BottomModalProps>({
    visible: false,
  });

  const close = useCallback(() => {
    setModal({
      visible: false,
    });
  }, []);

  const open = useCallback(
    (
      children: BottomModalProps['children'],
      options?: OpenBottomModalOptions,
    ) => {
      setModal({
        visible: true,
        onClose: close,
        children,
        ...options,
      });
    },
    [close],
  );

  return {
    close,
    open,
    modal,
  };
};
