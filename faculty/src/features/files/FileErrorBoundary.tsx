import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Text, Theme, useStylesheet } from '@polito/lib/ui';

type State = { hasError: boolean };

const FileErrorFallback = () => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);

  return (
    <View style={styles.container}>
      <Text style={styles.message}>
        {t('filesScreen.errorBoundaryMessage', {
          defaultValue: 'Something went wrong. Please try again.',
        })}
      </Text>
    </View>
  );
};

export class FileErrorBoundary extends React.Component<
  React.PropsWithChildren,
  State
> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <FileErrorFallback />;
    }
    return this.props.children;
  }
}

const createStyles = ({ colors, spacing }: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing[5],
    },
    message: {
      color: colors.secondaryText,
      textAlign: 'center',
    },
  });
