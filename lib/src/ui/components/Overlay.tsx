import { PropsWithChildren, ReactNode, useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { faArrowLeft, faClose } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@polito/lib/ui';

import { HeaderAccessory } from '../../ui/components/HeaderAccessory';
import { Text } from '../../ui/components/Text';
import { useStylesheet } from '../../ui/hooks/useStylesheet';
import { Theme } from '../../ui/types/Theme';
import { useTheme } from '../hooks';

type Props = {
  title: string;
  close: () => void;
  scrollViewRef?: any;
  setScrollOffset?: (value: number) => void;
  backButton?: boolean;
  footer?: ReactNode;
};

export const Overlay = ({
  title,
  children,
  close,
  scrollViewRef,
  setScrollOffset,
  backButton = false,
  footer,
}: PropsWithChildren<Props>) => {
  const styles = useStylesheet(createStyles);
  const { palettes } = useTheme();
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
      <HeaderAccessory align="center" style={styles.header}>
        <View style={styles.headerRow}>
          {backButton && (
            <IconButton
              icon={faArrowLeft}
              style={styles.headerSideLeft}
              noPadding
            />
          )}

          <View pointerEvents="none" style={styles.headerTitleContainer}>
            <Text style={styles.modalTitle}>{title}</Text>
          </View>

          <View style={styles.headerSideRight}>
            <IconButton
              icon={faClose}
              size={16}
              color={palettes.primary[500]}
              onPress={close}
              style={{ paddingVertical: 0 }}
              noPadding
            />
          </View>
        </View>
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
  fontSizes,
  fontWeights,
  palettes,
}: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: palettes.gray[50],
    },
    header: {
      backgroundColor: colors.background,
      height: 57,
    },
    headerRow: {
      paddingVertical: spacing[2.5],
      paddingHorizontal: spacing[5],
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerSideLeft: {
      flex: 1,
      alignItems: 'flex-start',
      justifyContent: 'center',
      minWidth: 0,
    },
    headerSideRight: {
      flex: 1,
      alignItems: 'flex-end',
      justifyContent: 'center',
      minWidth: 0,
    },
    headerTitleContainer: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalTitle: {
      fontSize: fontSizes.md,
      fontWeight: fontWeights.semibold,
      fontFamily: 'Montserrat-Medium',
      color: palettes.primary[700],
    },
  });
