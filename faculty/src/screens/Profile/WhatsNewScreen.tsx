import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { useAccessibility } from '@polito/lib/core';
import {
  BottomBarSpacer,
  Divider,
  Text,
  Theme,
  useStylesheet,
} from '@polito/lib/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ProfileStackParamList } from './ProfileNavigator';
import { formatAnnouncementDate, news } from './announcements';

type Props = NativeStackScreenProps<ProfileStackParamList, 'WhatsNew'>;

export const WhatsNewScreen = ({ navigation }: Props) => {
  const { t, i18n } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { accessibilityListLabel } = useAccessibility();

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View
        accessibilityRole="list"
        accessibilityLabel={t('appInfoScreen.whatsNewListLabel', {
          count: news.length,
        })}
      >
        {news.length === 0 && (
          <Text style={styles.item}>{t('appInfoScreen.whatsNewEmpty')}</Text>
        )}
        {news.map((item, index) => {
          const date = formatAnnouncementDate(item.date, i18n.language, t);
          return (
            <View key={item.id}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={[
                  item.title,
                  date,
                  item.contents,
                  accessibilityListLabel(index, news.length),
                ].join(', ')}
                accessibilityHint={t('appInfoScreen.openNewsHint')}
                onPress={() =>
                  navigation.navigate('NewOverlay', { id: item.id })
                }
                style={({ pressed }) => [
                  styles.item,
                  pressed && styles.pressed,
                ]}
              >
                <Text variant="title" style={styles.title}>
                  {item.title}
                </Text>
                <Text variant="secondaryText" style={styles.date}>
                  {date}
                </Text>
                <Text style={styles.body}>{item.contents}</Text>
              </Pressable>
              {index < news.length - 1 && <Divider style={styles.divider} />}
            </View>
          );
        })}
      </View>
      <BottomBarSpacer />
    </ScrollView>
  );
};

const createStyles = ({ spacing, fontSizes }: Theme) =>
  StyleSheet.create({
    item: {
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[4],
      gap: spacing[1],
    },
    pressed: {
      opacity: 0.7,
    },
    title: {
      fontSize: fontSizes.md,
    },
    date: {
      fontSize: fontSizes.md,
    },
    body: {
      fontSize: fontSizes.md,
      marginTop: spacing[2],
    },
    divider: {
      marginHorizontal: spacing[5],
    },
  });
