import { useEffect, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ScrollView } from 'react-native';
import { Platform } from 'react-native';

import { faArrowLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  BottomBarSpacer,
  IconButton,
  IndentedDivider,
  ListItem,
  Text,
  useTheme,
} from '@polito/lib';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useBottomBarAwareStyles } from '../../core/hooks/useBottomBarAwareStyles';
import { useSafeAreaSpacing } from '../../core/hooks/useSafeAreaSpacing';
import { ProfileStackParamList } from './ServiceNavigator';

export const BookingScreen = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const { paddingHorizontal } = useSafeAreaSpacing();
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      e.preventDefault();
      navigation.navigate('Servizi');
    });

    return unsubscribe;
  }, [navigation]);
  const possibleBookings = [
    {
      id: '1',
      title: t('other.requestRoom'),
      onPress: () => {
        navigation.navigate('PrenotaAula');
      },
    },
    {
      id: '2',
      title: t('other.requestEventsPlaces'),
      onPress: () => {
        navigation.navigate('PrenotaSpaziEventi');
      },
    },
    {
      id: '3',
      title: t('other.bookStructurePlaces'),
      onPress: () => {
        navigation.navigate('PrenotaSpaziStrutture');
      },
    },
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <IconButton
          icon={faArrowLeft}
          size={22}
          onPress={() => navigation.navigate('Servizi')}
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
          {t('other.bookPlaces')}
        </Text>
      ),
    });
  }, [navigation, colors, t]);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={bottomBarAwareStyles}
      contentInsetAdjustmentBehavior="automatic"
      bounces={false}
    >
      <FlatList
        data={possibleBookings}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={paddingHorizontal}
        ItemSeparatorComponent={() => <IndentedDivider />}
        renderItem={({ item }) => (
          <ListItem
            title={`${item.title}`}
            onPress={() => {
              item.onPress();
            }}
            trailingItem={<FontAwesomeIcon icon={faChevronRight} />}
          />
        )}
        ListFooterComponent={<BottomBarSpacer />}
      />
    </ScrollView>
  );
};
