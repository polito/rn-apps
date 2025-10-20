import { useEffect, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ScrollView, StyleSheet } from 'react-native';
import { Platform } from 'react-native';

import { faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { BottomBarSpacer } from '../../core/components/BottomBarSpacer';
import { useCourses } from '../../core/contexts/CoursesContext';
import { useBottomBarAwareStyles } from '../../core/hooks/useBottomBarAwareStyles';
import { useSafeAreaSpacing } from '../../core/hooks/useSafeAreaSpacing';
import { Badge } from '../../ui/components/Badge';
import { CtaButton } from '../../ui/components/CtaButton';
import { IconButton } from '../../ui/components/IconButton';
import { IndentedDivider } from '../../ui/components/IndentedDivider';
import { ListItem } from '../../ui/components/ListItem';
import { Text } from '../../ui/components/Text';
import { useTheme } from '../../ui/hooks/useTheme';
import { Theme } from '../../ui/types/Theme';
import { ProfileStackParamList } from './ServiceNavigator';

export const BookRoomScreen = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
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
          {t('other.requestRoom')}
        </Text>
      ),
    });
  }, [navigation, colors]);

  return (
    <>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={bottomBarAwareStyles}
        contentInsetAdjustmentBehavior="automatic"
        bounces={false}
      >
        <FlatList
          data={bookings.filter(b => b.type === 0)}
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
                  }; // light yellow bg, dark yellow text
                case 'accettata':
                  return {
                    backgroundColor: '#D4EDDA',
                    foregroundColor: '#155724',
                  }; // light green bg, dark green text
                case 'respinta':
                  return {
                    backgroundColor: '#F8D7DA',
                    foregroundColor: '#721C24',
                  }; // light red bg, dark red text
                default:
                  return {
                    backgroundColor: '#E2E3E5',
                    foregroundColor: '#6C757D',
                  }; // default grey
              }
            };

            const { backgroundColor, foregroundColor } = getBadgeColors(
              item.status,
            );

            return (
              <ListItem
                title={item.title.replace(
                  /^Richiesta aula/,
                  t('other.request'),
                )}
                subtitle={item.date + ' ' + item.time}
                onPress={() => {
                  setSelectedBooking(item);
                  navigation.navigate('Booking0');
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
          navigation.navigate('PrenotaAulaForm');
        }}
        absolute={false}
        variant="filled"
        icon={faPlus}
      />
    </>
  );
};

const createStyles = ({ colors, spacing }: Theme) =>
  StyleSheet.create({
    centeredContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
    },

    buttonSpacing: {
      width: '100%',
    },
  });
