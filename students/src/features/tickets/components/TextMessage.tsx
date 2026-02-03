import { useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';

import { usePreferencesContext } from '@polito/lib';
import { sanitizeHtml } from '@polito/lib';
import { TextWithLinks } from '@polito/lib';
import { useStylesheet } from '@polito/lib';
import { useTheme } from '@polito/lib';
import { Theme } from '@polito/lib';

import { AppPreferences } from '~/core/types/preferences';

export interface TextMessageProps {
  message: string;
}

export const TextMessage = ({ message }: TextMessageProps) => {
  const styles = useStylesheet(createStyles);
  const [styless, setStyless] = useState(styles);
  const { accessibility } = usePreferencesContext<AppPreferences>();
  const { fontSizes } = useTheme();
  const textMessage = useMemo(() => {
    return sanitizeHtml(message ?? '');
  }, [message]);

  useEffect(() => {
    const changeStyle = () => {
      setStyless(prevStyles => ({
        text: {
          ...prevStyles.text,
          lineHeight: accessibility?.lineHeight
            ? fontSizes.sm * 1.5
            : undefined,
          marginBottom: accessibility?.paragraphSpacing ? fontSizes.sm * 2 : 0,
        },
      }));
    };
    changeStyle();
  }, [accessibility, fontSizes]);
  return <TextWithLinks style={styless.text}>{textMessage}</TextWithLinks>;
};

const createStyles = ({ fontSizes, colors }: Theme) => {
  return StyleSheet.create({
    text: {
      fontSize: fontSizes.sm,
      color: colors.white,
      textDecorationColor: colors.white,
      justifyContent: 'center',
    },
  });
};
