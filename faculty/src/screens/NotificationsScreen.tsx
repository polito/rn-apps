import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet } from 'react-native';

import {
  faComments,
  faPersonCirclePlus,
} from '@fortawesome/free-solid-svg-icons';
import {
  Icon,
  OverviewList,
  Section,
  SectionHeader,
  SwitchListItem,
  Text,
  Theme,
  useBottomBarAwareStyles,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import i18next from 'i18next';

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
      <Section style={styles.container}>
        <SectionHeader
          title={t('notificationsScreen.general')}
          subtitle={t('notificationsScreen.globalSubtitle')}
        />
        <OverviewList indented>
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
            leadingItem={<Icon icon={faPersonCirclePlus} size={fontSizes.xl} />}
          />
        </OverviewList>
      </Section>
    </ScrollView>
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    container: {
      paddingTop: spacing[5],
    },
  });
