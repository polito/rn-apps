import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { useFeedbackContext } from '@polito/lib/core';
import { ListItem, Text, Theme, useStylesheet } from '@polito/lib/ui';
import { GuideField } from '@polito/student-api-client';
import Clipboard from '@react-native-clipboard/clipboard';

type Props = {
  field: GuideField;
};

export const GuideFieldListItem = ({ field }: Props) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { setFeedback } = useFeedbackContext();

  const accessibilityLabel = `${field.label}: ${field.value}`;

  const title = (
    <View style={styles.row}>
      <Text style={[styles.text, styles.label]}>{field.label}</Text>
      <Text weight="semibold" style={styles.text}>
        {field.value}
      </Text>
    </View>
  );

  const handleCopy = () => {
    if (!field.isCopyEnabled) return;
    Clipboard.setString(field.value);
    setFeedback({
      text: t('guideScreen.copiedFieldFeedback', { field: field.label }),
    });
  };

  if (!field.isCopyEnabled) {
    return (
      <View
        accessible
        accessibilityRole="none"
        accessibilityLabel={accessibilityLabel}
        style={styles.staticRow}
      >
        {title}
      </View>
    );
  }

  return (
    <ListItem
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={t('guideFieldListItem.tapToCopy')}
      onPress={handleCopy}
      title={title}
    />
  );
};

const createStyles = ({ fontSizes, spacing }: Theme) =>
  StyleSheet.create({
    staticRow: {
      minHeight: 60,
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[2],
      justifyContent: 'center',
    },
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
