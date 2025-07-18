import {useEffect, useLayoutEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {ListItem} from '../../ui/components/ListItem';
import {MetricCard} from '../../ui/components/MetricCard';
import {Section} from '../../ui/components/Section';
import {SectionHeader} from '../../ui/components/SectionHeader';
import {SectionList} from '../../ui/components/SectionList';
import {useTheme} from '../../ui/hooks/useTheme';
import {useCourses} from '../../core/contexts/CoursesContext';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useBottomBarAwareStyles} from '../../core/hooks/useBottomBarAwareStyles';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useStylesheet} from '../../ui/hooks/useStylesheet';
import {Theme} from '../../ui/types/Theme';
import {Text} from '../../ui/components/Text';
import {Icon} from '../../ui/components/Icon';
import {Logo} from '../../core/components/Logo';
import {Row} from '../../ui/components/Row';
import {IconButton} from '../../ui/components/IconButton';
import {
  faArrowLeft,
  faChevronRight,
  faInbox,
  faPerson,
  faPhone,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {GlobalStyles} from '../../core/components/GlobalStyles';
import {BottomBarSpacer} from '../../core/components/BottomBarSpacer';
import {IndentedDivider} from '../../ui/components/IndentedDivider';
import {EmptyState} from '../../ui/components/EmptyState';
import {useSafeAreaSpacing} from '../../core/hooks/useSafeAreaSpacing';
import {CtaButton} from '../../ui/components/CtaButton';
import {Platform} from 'react-native';

export const BookingScreen = () => {
  const {t} = useTranslation();
  const {spacing, colors} = useTheme();
  const navigation = useNavigation();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const styles = useStylesheet(createStyles);
  const {setOptions} = useNavigation();
  const {fontSizes} = useTheme();
  const {user, setSelectedProfile} = useCourses();
  const [searchText, setSearchText] = useState('');
  const {setSelectedBooking} = useCourses();
  const {paddingHorizontal} = useSafeAreaSpacing();
useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
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
        navigation.navigate('Prenota_aula');
      },
    },
    {
      id: '2',
      title: t('other.requestEventsPlaces'),
      onPress: () => {
        navigation.navigate('Prenota_spaziEventi');
      },
    },
    {
      id: '3',
      title: t('other.bookStructurePlaces'),
      onPress: () => {
        navigation.navigate('Prenota_spaziStrutture');
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
          }}>
          {t('other.bookPlaces')}
        </Text>
      ),
    });
  }, [navigation, colors]);

  return (
    <ScrollView
      style={{flex: 1}}
      contentContainerStyle={bottomBarAwareStyles}
      contentInsetAdjustmentBehavior="automatic"
      bounces={false}>
        <FlatList
          data={possibleBookings}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={paddingHorizontal}
          ItemSeparatorComponent={() => <IndentedDivider />}
          renderItem={({item}) => (
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

const createStyles = ({colors, spacing}: Theme) =>
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
