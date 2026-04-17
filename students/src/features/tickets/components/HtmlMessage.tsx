import { useMemo } from 'react';
import {
  MixedStyleDeclaration,
  RenderHTMLProps,
} from 'react-native-render-html';

import { linkUrls, sanitizeHtml } from '../../../../../lib/src/core/utils/html';
import { HtmlView } from '../../../../../lib/src/ui/components/HtmlView';

export interface HtmlMessage {
  message: string;
  baseStyle?: MixedStyleDeclaration;
  renderersProps?: RenderHTMLProps['renderersProps'];
}

export const HtmlMessage = ({
  message,
  baseStyle,
  renderersProps,
}: HtmlMessage) => {
  const html = useMemo(() => {
    return linkUrls(sanitizeHtml(message));
  }, [message]);

  return (
    <HtmlView
      props={{
        source: { html },
        baseStyle: { padding: 0, ...baseStyle },
        ...(renderersProps != null ? { renderersProps } : {}),
      }}
      variant="longProse"
    />
  );
};
