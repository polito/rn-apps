import React from 'react';
import { useTranslation } from 'react-i18next';

import { Sentry } from '@polito/lib/core';
import { ErrorCard } from '@polito/lib/ui';

type State = { hasError: boolean };

const FileErrorFallback = () => {
  const { t } = useTranslation();

  return (
    <ErrorCard
      text={t('filesScreen.errorBoundaryMessage', {
        defaultValue: 'Something went wrong. Please try again.',
      })}
    />
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

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (typeof Sentry?.captureException === 'function') {
      Sentry.captureException(error, {
        tags: { boundary: 'FileErrorBoundary', feature: 'files' },
        extra: { componentStack: errorInfo.componentStack },
      });
      return;
    }

    console.error('FileErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <FileErrorFallback />;
    }
    return this.props.children;
  }
}
