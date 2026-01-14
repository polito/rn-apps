import { PropsWithChildren, useCallback } from 'react';
import { Dimensions, View } from 'react-native';
import Modal from 'react-native-modal';

export type BottomModalProps = PropsWithChildren<{
  visible: boolean;
  onClose?: () => void;
  dismissable?: boolean;
  scrollOffset?: number;
  scrollViewRef?: any;
  onModalHide?: () => void;
}>;

export const BottomModal = ({
  children,
  visible,
  onClose,
  dismissable,
  scrollOffset,
  scrollViewRef,
  onModalHide,
}: BottomModalProps) => {
  const { height, width } = Dimensions.get('screen');
  const handleCloseModal = () => {
    dismissable && onClose?.();
  };

  const handleScrollTo = useCallback(
    (p: any) => {
      if (scrollViewRef && scrollViewRef.current) {
        scrollViewRef.current.scrollTo(p);
      }
    },
    [scrollViewRef],
  );

  return (
    <Modal
      {...Modal.defaultProps}
      onModalHide={onModalHide}
      onBackButtonPress={handleCloseModal}
      style={{ margin: 0, justifyContent: 'flex-end' }}
      animationOutTiming={400}
      animationInTiming={400}
      isVisible={visible}
      backdropOpacity={0.4}
      avoidKeyboard={true}
      animationIn="slideInUp"
      animationOut="slideOutUp"
      backdropColor="black"
      deviceHeight={height}
      deviceWidth={width}
      swipeDirection={['down']}
      supportedOrientations={['landscape', 'portrait']}
      onBackdropPress={handleCloseModal}
      scrollTo={handleScrollTo}
      propagateSwipe
      useNativeDriver={false}
      useNativeDriverForBackdrop
      onSwipeComplete={handleCloseModal}
      scrollOffset={scrollOffset}
      scrollOffsetMax={100}
    >
      <View>{children}</View>
    </Modal>
  );
};
