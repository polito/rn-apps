/**
 * Wraps HTMLTable from @native-html/table-plugin, adding CSS `fit-content`
 * on html/body so the WebView shrinks to the actual table width.
 */
import { useCallback, useMemo, useState } from 'react';
import { Dimensions, View } from 'react-native';
import {
  CustomBlockRenderer,
  CustomRendererProps,
  useContentWidth,
  useSharedProps,
} from 'react-native-render-html';

import {
  HTMLTable,
  cssRulesFromSpecs,
  defaultTableStylesSpecs,
  useHtmlTableProps,
} from '@native-html/table-plugin';
import type { TBlock } from '@native-html/transient-render-engine';

const SHRINK_WRAP_CSS = `
  html, body {
    width: fit-content;
    max-width: 100%;
    box-sizing: border-box;
  }
`;

const MEASURE_WIDTH_JS = `(function(){var w=document.body.scrollWidth;if(w>0)window.ReactNativeWebView.postMessage(JSON.stringify({type:'__table_shrink_w__',value:w}))})();`;

const TYPE = '__table_shrink_w__';

export const TableRendererShrinkWidth: CustomBlockRenderer =
  function TableRendererShrinkWidth(props) {
    const tableProps = useHtmlTableProps(props as CustomRendererProps<TBlock>);
    const contentWidth = useContentWidth();
    const { computeEmbeddedMaxWidth } = useSharedProps();

    const resolvedContentWidth =
      typeof contentWidth === 'number'
        ? contentWidth
        : Dimensions.get('window').width;
    const maxW =
      computeEmbeddedMaxWidth?.call(null, resolvedContentWidth, 'table') ??
      resolvedContentWidth;

    const [measuredWidth, setMeasuredWidth] = useState<number>();

    const cssRules = useMemo(() => {
      const baseCss =
        tableProps.cssRules ?? cssRulesFromSpecs(defaultTableStylesSpecs);
      return `${baseCss}${SHRINK_WRAP_CSS}`;
    }, [tableProps.cssRules]);

    const handleMessage = useCallback(
      (event: any) => {
        try {
          const data = JSON.parse(event.nativeEvent.data) as {
            type?: string;
            value?: number;
          };
          if (data.type === TYPE && typeof data.value === 'number') {
            setMeasuredWidth(prev => {
              const clamped = Math.min(data.value!, maxW);
              return prev === clamped ? prev : clamped;
            });
          }
        } catch {
          /* non-JSON messages are ignored */
        }
        tableProps.webViewProps?.onMessage?.(event);
      },
      [tableProps.webViewProps, maxW],
    );

    const webViewProps = useMemo(
      () => ({
        ...tableProps.webViewProps,
        injectedJavaScript: `${MEASURE_WIDTH_JS}${tableProps.webViewProps?.injectedJavaScript ?? ''}`,
        onMessage: handleMessage,
      }),
      [tableProps.webViewProps, handleMessage],
    );

    return (
      <View
        style={{
          maxWidth: '100%',
          ...(measuredWidth != null
            ? { width: measuredWidth }
            : { height: 0, overflow: 'hidden' }),
        }}
      >
        <HTMLTable
          {...tableProps}
          cssRules={cssRules}
          webViewProps={webViewProps}
        />
      </View>
    );
  };
