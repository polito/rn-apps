import { PropsWithChildren, ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  CtaButton,
  GlobalStyles,
  Text,
  Theme,
  useStylesheet,
} from '@polito/lib/ui';

import { ExamStudentSearchBar } from './ExamStudentSearchBar';

type Cta = {
  title: string;
  icon?: IconDefinition;
  disabled?: boolean;
  disabledHint?: string;
  onPress: () => void;
};

type Props = PropsWithChildren<{
  searchText: string;
  onChangeSearch: (text: string) => void;
  filters?: ReactNode;
  counter?: string;
  cta?: Cta;
}>;

export const ExamStudentsSheet = ({
  searchText,
  onChangeSearch,
  filters,
  counter,
  cta,
  children,
}: Props) => {
  const styles = useStylesheet(createStyles);

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <KeyboardAvoidingView
        style={GlobalStyles.grow}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.top}>
          <ExamStudentSearchBar
            value={searchText}
            onChangeText={onChangeSearch}
          />
          {filters}
        </View>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {counter && (
            <Text
              variant="subHeading"
              style={styles.counter}
              accessibilityLiveRegion="polite"
            >
              {counter}
            </Text>
          )}
          {children}
        </ScrollView>
        {cta && (
          <View style={styles.cta}>
            <CtaButton
              absolute={false}
              title={cta.title}
              icon={cta.icon}
              disabled={cta.disabled}
              accessibilityState={{ disabled: !!cta.disabled }}
              accessibilityHint={cta.disabled ? cta.disabledHint : undefined}
              action={cta.onPress}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = ({ colors, palettes, dark, spacing }: Theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    top: {
      paddingTop: spacing[3],
      paddingBottom: spacing[2],
      gap: spacing[1],
      backgroundColor: dark ? palettes.gray[800] : palettes.gray[100],
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.divider,
    },
    content: {
      paddingVertical: spacing[4],
      gap: spacing[3],
    },
    counter: {
      marginHorizontal: spacing[4],
    },
    cta: {
      backgroundColor: colors.background,
    },
  });
