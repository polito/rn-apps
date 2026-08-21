import { ComponentType, ReactNode, RefObject, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';

import {
  CtaButtonSpacer,
  HtmlView,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';

import { Image } from 'expo-image';

import { hideFromScreenReader } from '../accessibility/hideFromScreenReader';

interface Props {
  title: string;
  description?: string;
  html: string;
  cover?: string;
  ScrollViewComponent?: ComponentType<any>;
  children?: ReactNode;
  headerRef?: RefObject<View | null>;
}

export const OnboardingStep = ({
  title,
  html,
  cover,
  ScrollViewComponent = ScrollView,
  children,
  headerRef,
}: Props) => {
  const styles = useStylesheet(createStyles);
  const { shapes, spacing } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const [coverAspectRatio, setCoverAspectRatio] = useState<number>();

  const coverWidth = screenWidth - spacing[5] * 2;

  const htmlViewProps = useMemo(
    () => ({
      source: { html },
      baseStyle: {
        paddingHorizontal: spacing[5],
        paddingVertical: spacing[1],
        paddingBottom: spacing[2],
      },
    }),
    [html, spacing],
  );

  return (
    <ScrollViewComponent
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {cover && (
        <View style={styles.coverImageContainer}>
          <View {...hideFromScreenReader}>
            <Image
              source={{ uri: cover }}
              style={{
                borderRadius: shapes.lg,
                width: coverWidth,
                aspectRatio: coverAspectRatio ?? 16 / 9,
              }}
              contentFit="cover"
              onLoad={e => {
                const { width: w, height: h } = e.source;
                if (w > 0 && h > 0) setCoverAspectRatio(w / h);
              }}
            />
          </View>
        </View>
      )}
      <View
        ref={headerRef}
        style={styles.header}
        accessible
        accessibilityRole="header"
        accessibilityLabel={title}
      >
        <Text variant="title" role="heading" accessible={false}>
          {title}
        </Text>
      </View>
      <HtmlView props={htmlViewProps} variant="onboarding" />
      {children}
      <CtaButtonSpacer />
    </ScrollViewComponent>
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    content: {
      paddingVertical: spacing[6],
    },
    header: {
      paddingHorizontal: spacing[5],
      paddingTop: spacing[2],
      gap: spacing[1],
    },
    coverImageContainer: {
      paddingHorizontal: spacing[5],
      marginBottom: spacing[2],
    },
  });
