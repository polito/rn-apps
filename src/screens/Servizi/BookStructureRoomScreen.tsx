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
  faPlus,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {GlobalStyles} from '../../core/components/GlobalStyles';
import {BottomBarSpacer} from '../../core/components/BottomBarSpacer';
import {IndentedDivider} from '../../ui/components/IndentedDivider';
import {EmptyState} from '../../ui/components/EmptyState';
import {useSafeAreaSpacing} from '../../core/hooks/useSafeAreaSpacing';
import {CtaButton} from '../../ui/components/CtaButton';
import {Badge} from '../../ui/components/Badge';
import {Platform} from 'react-native';

export const BookStructureRoomScreen = () => {
  const {t} = useTranslation();
  const {spacing, colors} = useTheme();
  const navigation = useNavigation();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const styles = useStylesheet(createStyles);
  const {setOptions} = useNavigation();
  const {fontSizes} = useTheme();
  const {user, setSelectedProfile} = useCourses();
  const [searchText, setSearchText] = useState('');
  const {bookings, setSelectedBooking} = useCourses();
  const {paddingHorizontal} = useSafeAreaSpacing();
useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
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
          }}>
          {t('other.bookStructurePlaces')}
        </Text>
      ),
    });
  }, [navigation, colors]);

  return (
    <>
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={bottomBarAwareStyles}
        contentInsetAdjustmentBehavior="automatic"
        bounces={false}>
          <FlatList
  data={bookings.filter(b => b.type == 2)}
  keyExtractor={item => item.id.toString()}
  contentContainerStyle={paddingHorizontal}
  ItemSeparatorComponent={() => <IndentedDivider />}
  renderItem={({item}) => {
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

    const { backgroundColor, foregroundColor } = getBadgeColors(item.status);

    return (
      <ListItem
        title={item.title.replace(/^Prenotazione spazio/, t('other.booking'))}
        subtitle={item.date + ' ' + item.time}
        onPress={() => {
          setSelectedBooking(item);
          navigation.navigate('Booking2');
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
          navigation.navigate('Prenota_struttureForm');
        }}
        absolute={false}
        variant="filled"
        icon={faPlus}
      />
    </>
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
