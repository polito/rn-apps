import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';

import { faComments, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import i18next from 'i18next';

import { Icon } from '../../../lib/src/ui/components/Icon';
import { SectionHeader } from '../../../lib/src/ui/components/SectionHeader';
import { SwitchListItem } from '../../../lib/src/ui/components/SwitchListItem';
import { Text } from '../../../lib/src/ui/components/Text';
import { useBottomBarAwareStyles } from '../../../lib/src/ui/hooks/useBottomBarAwareStyles';
import { useStylesheet } from '../../../lib/src/ui/hooks/useStylesheet';
import { useTheme } from '../../../lib/src/ui/hooks/useTheme';
import { Theme } from '../../../lib/src/ui/types/Theme';
import { SectionList } from '../core/components/SectionList';
import { ProfileStackParamList } from '../screens/Profile/ProfileNavigator';

export const NotificationsScreen = () => {
  const { t } = useTranslation();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const styles = useStylesheet(createStyles);
  const { fontSizes } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const [ticketEnabled, setTicketEnabled] = useState(true);
  const [reservationsEnabled, setReservationsEnabled] = useState(true);

  useLayoutEffect(() => {
    const marginLeft = i18next.language === 'en' ? 80 : 65;
    navigation.setOptions({
      headerTitle: () => (
        <Text variant="heading" style={{ marginLeft }}>
          {t('notificationsScreen.title')}
        </Text>
      ),
    });
  }, [navigation, t]);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={bottomBarAwareStyles}
      contentInsetAdjustmentBehavior="automatic"
      bounces={false}
    >
      <View style={styles.container}>
        <SectionHeader title={t('notificationsScreen.general')} />
        <Text variant="secondaryText" style={styles.subtitle}>
          {t('notificationsScreen.globalSubtitle')}
        </Text>
        <SectionList>
          <SwitchListItem
            title={t('notificationsScreen.ticket')}
            value={ticketEnabled}
            onChange={setTicketEnabled}
            leadingItem={<Icon icon={faComments} size={fontSizes.xl} />}
          />
          <SwitchListItem
            title={t('notificationsScreen.reservations')}
            value={reservationsEnabled}
            onChange={setReservationsEnabled}
            leadingItem={<Icon icon={faUserGroup} size={fontSizes.xl} />}
          />
        </SectionList>
      </View>
    </ScrollView>
  );
};

const createStyles = ({ spacing, fontSizes }: Theme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: spacing[4],
      paddingTop: spacing[3],
      paddingBottom: spacing[5],
    },
    subtitle: {
      fontSize: fontSizes.sm,
      marginTop: spacing[1],
      marginBottom: spacing[3],
      paddingHorizontal: spacing[4],
    },
  });
