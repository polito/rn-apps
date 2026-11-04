import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { useFeedbackContext } from '@polito/lib/core';
import { ListItem, Text, Theme, useStylesheet } from '@polito/lib/ui';
import { GuideField } from '@polito/student-api-client';
import Clipboard from '@react-native-clipboard/clipboard';

import { usePressableFeedback } from '~/core/hooks/usePressableFeedback';

type Props = {
  field: GuideField;
};
export const GuideFieldListItem = ({ field }: Props) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const pressableFeedback = usePressableFeedback('opacity');
  const { setFeedback } = useFeedbackContext();
  const copyToClipboard = () => {
    if (!field.isCopyEnabled) return;
    Clipboard.setString(field.value);
    setFeedback({
      text: t('guideScreen.copiedFieldFeedback', { field: field.label }),
    });
  };

  return (
    <ListItem
      title={
        <View style={styles.row}>
          <Text style={[styles.text, styles.label]}>{field.label}</Text>
          <Pressable
            onPress={copyToClipboard}
            android_ripple={
              field.isCopyEnabled ? pressableFeedback.androidRipple : undefined
            }
            style={field.isCopyEnabled ? pressableFeedback.style() : undefined}
          >
            <Text weight="semibold" style={styles.text}>
              {field.value}
            </Text>
          </Pressable>
        </View>
      }
    />
  );
};

const createStyles = ({ fontSizes, spacing }: Theme) =>
  StyleSheet.create({
    row: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing[2],
    },
    text: {
      fontSize: fontSizes.md,
    },
    label: {
      flexShrink: 1,
    },
  });
