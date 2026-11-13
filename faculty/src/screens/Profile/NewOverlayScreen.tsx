import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IS_ANDROID } from '@polito/lib/core';
import {
  CtaButton,
  Text,
  Theme,
  useHideTabs,
  useStylesheet,
} from '@polito/lib/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ProfileStackParamList } from './ProfileNavigator';
import { announcements, formatAnnouncementDate } from './announcements';

type Props = NativeStackScreenProps<ProfileStackParamList, 'NewOverlay'>;

export const NewOverlayScreen = ({ route, navigation }: Props) => {
  const { t, i18n } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { bottom } = useSafeAreaInsets();
  const announcement = announcements.find(a => a.id === route.params.id);
  useHideTabs();

  if (!announcement) return null;

  return (
    <View style={styles.screen} accessibilityViewIsModal={IS_ANDROID}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="title" style={styles.title} accessibilityRole="header">
          {announcement.title}
        </Text>
        <Text variant="secondaryText" style={styles.text}>
          {formatAnnouncementDate(announcement.date, i18n.language, t)}
        </Text>
        <Text style={[styles.text, styles.body]}>{announcement.contents}</Text>
      </ScrollView>
      <View style={{ paddingBottom: bottom }}>
        <CtaButton
          absolute={false}
          title={t('appInfoScreen.gotIt')}
          accessibilityHint={t('appInfoScreen.gotItHint')}
          action={() => navigation.goBack()}
        />
      </View>
    </View>
  );
};

const createStyles = ({ colors, spacing, fontSizes }: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: spacing[5],
      gap: spacing[1],
    },
    title: {
      fontSize: fontSizes.sm,
    },
    text: {
      fontSize: fontSizes.sm,
    },
    body: {
      marginTop: spacing[2],
    },
  });
