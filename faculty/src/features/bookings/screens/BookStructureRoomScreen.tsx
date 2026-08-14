import { useEffect, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Platform, ScrollView, StyleSheet } from 'react-native';

import { faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  Badge,
  BottomBarSpacer,
  CtaButton,
  IconButton,
  IndentedDivider,
  ListItem,
  Text,
  Theme,
  useBottomBarAwareStyles,
  useSafeAreaSpacing,
  useStylesheet,
} from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ProfileStackParamList } from '../../../screens/Servizi/ServiceNavigator';
import { useBookings } from '../hooks/useBookings';

export const BookStructureRoomScreen = () => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const { bookings, setSelectedBooking } = useBookings();
  const { paddingHorizontal } = useSafeAreaSpacing();
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      e.preventDefault();
      navigation.navigate('Prenotazione');
    });

    return unsubscribe;
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <IconButton
          icon={faArrowLeft}
          size={22}
          onPress={() => navigation.navigate('Prenotazione')}
        />
      ),
      headerTitle: () => (
        <Text variant="heading" style={styles.headerTitle}>
          {t('other.bookStructurePlaces')}
        </Text>
      ),
    });
  }, [navigation, t, styles.headerTitle]);

  return (
    <>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={bottomBarAwareStyles}
        contentInsetAdjustmentBehavior="automatic"
        bounces={false}
      >
        <FlatList
          data={bookings.filter(b => b.type === 2)}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={paddingHorizontal}
          ItemSeparatorComponent={() => <IndentedDivider />}
          renderItem={({ item }) => {
            const getBadgeColors = (status: string) => {
              switch (status) {
                case 'in attesa':
                  return {
                    backgroundColor: '#FFF3CD',
                    foregroundColor: '#856404',
                  };
                case 'accettata':
                  return {
                    backgroundColor: '#D4EDDA',
                    foregroundColor: '#155724',
                  };
                case 'respinta':
                  return {
                    backgroundColor: '#F8D7DA',
                    foregroundColor: '#721C24',
                  };
                default:
                  return {
                    backgroundColor: '#E2E3E5',
                    foregroundColor: '#6C757D',
                  };
              }
            };

            const { backgroundColor, foregroundColor } = getBadgeColors(
              item.status,
            );

            return (
              <ListItem
                title={item.title.replace(
                  /^Prenotazione spazio/,
                  t('other.booking'),
                )}
                subtitle={item.date + ' ' + item.time}
                onPress={() => {
                  setSelectedBooking(item);
                  navigation.navigate('RequestDetails');
                }}
                trailingItem={
                  <Badge
                    text={
                      item.status === 'in attesa'
                        ? t('other.waiting')
                        : item.status === 'accettata'
                          ? t('other.accepted')
                          : item.status === 'respinta'
                            ? t('other.rejected')
                            : item.status
                    }
                    backgroundColor={backgroundColor}
                    foregroundColor={foregroundColor}
                  />
                }
              />
            );
          }}
          ListFooterComponent={<BottomBarSpacer />}
        />
      </ScrollView>
      <CtaButton
        title={t('bookingsScreen.newBooking')}
        action={() => {
          navigation.navigate('RichiediSpazio');
        }}
        absolute={false}
        variant="filled"
        icon={faPlus}
      />
    </>
  );
};

const createStyles = ({ fontFamilies, fontSizes, fontWeights }: Theme) =>
  StyleSheet.create({
    scroll: {
      flex: 1,
    },
    headerTitle: {
      width: '100%',
      textAlign: 'center',
      marginLeft: Platform.select({ android: -25, default: -55 }),
      fontFamily: fontFamilies.heading,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.semibold,
    },
  });
