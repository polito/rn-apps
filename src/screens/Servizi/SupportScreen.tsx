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

export const SupportScreen = () => {
  const {t} = useTranslation();
  const {spacing, colors} = useTheme();
  const navigation = useNavigation();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const styles = useStylesheet(createStyles);
  const {setOptions} = useNavigation();
  const {fontSizes} = useTheme();
  const {user, setSelectedProfile} = useCourses();
  const [searchText, setSearchText] = useState('');
  const {fakeProfiles} = useCourses();
  const {paddingHorizontal} = useSafeAreaSpacing();

  const supportContacts = [
    {
      id: '1',
      title: '3356412988',
      icon: faPhone,
      onPress: () => {},
    },
    
  ];
useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
      navigation.navigate('Servizi');
    });
  
    return unsubscribe; 
  }, [navigation]);
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
          {t('other.audiovideoSupport')}
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
        <View style={[styles.centeredContainer, paddingHorizontal]}>
          <Text variant='heading' style={{padding : 10, textAlign : 'center'}}>{t('other.avtext1')}</Text>
                    <Text  style={{padding : 10, textAlign : 'center'}}>{t('other.avtext2')}</Text>
                    <Text  style={{padding : 10, textAlign : 'center'}}>8:30/20:00</Text>
                                        <Text  style={{padding : 10, textAlign : 'center'}}>{t('other.avtext3')}</Text>
                    <Text variant='heading' style={{padding : 10, textAlign : 'center'}}>{t('other.avtext4')}</Text>
                                        <Text  style={{padding : 10, textAlign : 'center'}}>{t('other.avtext5')}</Text>



          {supportContacts.map(contact => (
            <View key={contact.id} style={styles.buttonSpacing}>
              <CtaButton
                title={contact.title}
                icon={contact.icon}
                action={contact.onPress}
                variant="outlined"
                absolute={false}
              />
            </View>
          ))}
        </View>
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
