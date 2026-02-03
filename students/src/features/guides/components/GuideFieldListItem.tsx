import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { GuideField } from '@polito/api-client';
import { useFeedbackContext } from '@polito/lib';
import { ListItem } from '@polito/lib';
import { Text } from '@polito/lib';
import { useStylesheet } from '@polito/lib';
import { Theme } from '@polito/lib';
import Clipboard from '@react-native-clipboard/clipboard';

type Props = {
  field: GuideField;
};
export const GuideFieldListItem = ({ field }: Props) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
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
          <TouchableOpacity
            activeOpacity={field.isCopyEnabled ? 0.2 : 1}
            onPress={copyToClipboard}
          >
            <Text weight="semibold" style={styles.text}>
              {field.value}
            </Text>
          </TouchableOpacity>
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
