import { PropsWithChildren, ReactNode, useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { HeaderAccessory } from '../../ui/components/HeaderAccessory';
import { Text } from '../../ui/components/Text';
import { useStylesheet } from '../../ui/hooks/useStylesheet';
import { Theme } from '../../ui/types/Theme';

type Props = {
  title: string;
  close: () => void;
  scrollViewRef?: any;
  setScrollOffset?: (value: number) => void;
  rightItemTitle?: string;
  rightItemOnPress?: () => void;
  footer?: ReactNode;
};

export const ModalContent = ({
  children,
  close,
  scrollViewRef,
  setScrollOffset,
  rightItemTitle,
  rightItemOnPress,
  footer,
}: PropsWithChildren<Props>) => {
  const styles = useStylesheet(createStyles);

  const handleOnScroll = useCallback(
    (event: any) => {
      if (setScrollOffset) {
        setScrollOffset(event.nativeEvent.contentOffset.y);
      }
    },
    [setScrollOffset],
  );

  return (
    <View style={styles.container}>
      <HeaderAccessory
        justify="space-between"
        align="center"
        style={styles.header}
      >
        <Text style={styles.headerLeft} onPress={close}>
          Close
        </Text>

        {rightItemTitle && (
          <Text style={styles.headerRight} onPress={rightItemOnPress}>
            {rightItemTitle}
          </Text>
        )}
      </HeaderAccessory>
      <ScrollView
        onScroll={handleOnScroll}
        scrollEventThrottle={120}
        ref={scrollViewRef}
      >
        {children}
      </ScrollView>
      {footer}
    </View>
  );
};

const createStyles = ({
  colors,
  spacing,
  shapes,
  fontSizes,
  fontWeights,
  palettes,
}: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      borderTopRightRadius: shapes.md,
      borderTopLeftRadius: shapes.md,
      maxHeight: '100%',
    },
    header: {
      paddingVertical: 11,
      borderTopRightRadius: shapes.md,
      borderTopLeftRadius: shapes.md,
    },
    headerLeft: {
      padding: spacing[4],
      paddingVertical: 0,
      fontFamily: 'Montserrat-Regular',
    },
    modalTitle: {
      fontSize: fontSizes.md,
      fontWeight: fontWeights.semibold,
      color: colors.prose,
    },
    headerRight: {
      padding: spacing[4],
      paddingVertical: 0,
      color: palettes.lightBlue[500],
      fontFamily: 'Montserrat-Regular',
    },
  });
