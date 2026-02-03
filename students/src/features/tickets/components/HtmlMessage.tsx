import { useMemo } from 'react';
import { MixedStyleDeclaration } from 'react-native-render-html';

import { linkUrls, sanitizeHtml } from '@polito/lib';
import { HtmlView } from '@polito/lib';

export interface HtmlMessage {
  message: string;
  baseStyle?: MixedStyleDeclaration;
}

export const HtmlMessage = ({ message, baseStyle }: HtmlMessage) => {
  const html = useMemo(() => {
    return linkUrls(sanitizeHtml(message));
  }, [message]);

  return (
    <HtmlView
      props={{
        source: { html },
        baseStyle: { padding: 0, ...baseStyle },
      }}
      variant="longProse"
    />
  );
};
