import { useEffect, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Platform, ScrollView } from 'react-native';

import { faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  Badge,
  BottomBarSpacer,
  CtaButton,
  IconButton,
  IndentedDivider,
  ListItem,
  Text,
} from '@polito/lib';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useCourses } from '../../core/contexts/CoursesContext';
import { useBottomBarAwareStyles } from '../../core/hooks/useBottomBarAwareStyles';
import { useSafeAreaSpacing } from '../../core/hooks/useSafeAreaSpacing';
import { ProfileStackParamList } from './ServiceNavigator';

export const BookEventsRoomScreen = () => {
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const { bookings, setSelectedBooking } = useCourses();
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
        <Text
          variant="heading"
          style={{
            textAlign: 'center',
            width: '100%',
            marginLeft: Platform.OS === 'android' ? -25 : -55,
          }}
        >
          {t('other.requestEventsPlaces')}
        </Text>
      ),
    });
  }, [navigation, t]);

  return (
    <>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={bottomBarAwareStyles}
        contentInsetAdjustmentBehavior="automatic"
        bounces={false}
      >
        <FlatList
          data={bookings.filter(b => b.type === 1)}
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
                  /^Richiesta spazio/,
                  t('other.request'),
                )}
                subtitle={item.date + ' ' + item.time}
                onPress={() => {
                  setSelectedBooking(item);
                  navigation.navigate('Booking1');
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
        title={t('other.newRequest')}
        action={() => {
          navigation.navigate('PrenotaEventiForm');
        }}
        absolute={false}
        variant="filled"
        icon={faPlus}
      />
    </>
  );
};
