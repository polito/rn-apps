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
import {Badge} from '../../ui/components/Badge';
import {Platform} from 'react-native';
import { OverviewList } from '../../ui/components/OverviewList';

export const DigitalSignatureScreen = () => {
  const {t} = useTranslation();
  const {spacing, colors} = useTheme();
  const navigation = useNavigation();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const styles = useStylesheet(createStyles);
  const {setOptions} = useNavigation();
  const {fontSizes} = useTheme();
  const {user, setSelectedProfile, setSelectedDoc} = useCourses();
  const [searchText, setSearchText] = useState('');
  const {tbsDocs} = useCourses();
  const {paddingHorizontal} = useSafeAreaSpacing();
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
           {t('other.digitalSignature')}
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
        <View style={{marginTop: spacing[4]}}></View>
        <SectionHeader title={t('other.toBeSigned')}></SectionHeader>
        <View style={{marginBottom: spacing[4]}}></View>
        <OverviewList>
        <FlatList
          data={tbsDocs.filter(b => b.status == 'da firmare')}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={paddingHorizontal}
          ItemSeparatorComponent={() => <IndentedDivider />}
          renderItem={({item}) => {
            return (
              <ListItem
                title={item.title}
                subtitle={'Da firmare entro ' + item.tbsDate}
                onPress={() => {
                  setSelectedDoc(item);
                  navigation.navigate('SignatureScreen');
                }}
              />
            );
          }}
        />
        </OverviewList>

        <View style={{marginTop: spacing[4]}}></View>
        <SectionHeader title={t('other.signedByYou')}></SectionHeader>
        <View style={{marginBottom: spacing[4]}}></View>
        <OverviewList>
        <FlatList
          data={tbsDocs.filter(b => b.status == 'firmato')}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={paddingHorizontal}
          ItemSeparatorComponent={() => <IndentedDivider />}
          renderItem={({item}) => {
            const getBadgeColors = (signers: number) => {
              switch (signers) {
                case 1:
                  return {
                    backgroundColor: '#D4EDDA',
                    foregroundColor: '#155724',
                  }; // light green bg, dark green text
                default:
                  return {
                    backgroundColor: '#FFF3CD',
                    foregroundColor: '#856404',
                  };
              }
            };

            const {backgroundColor, foregroundColor} = getBadgeColors(
              item.numberOfSignatures,
            );

            return (
              <ListItem
                title={item.title}
                subtitle={t('other.toBeSignedUntil')+ ' ' + item.tbsDate}
                onPress={() => {
                  setSelectedDoc(item);
                  navigation.navigate('SignatureScreen');
                }}
                trailingItem={
                  <Badge
                    text={
                      item.numberOfSignatures === 1
                        ? t('other.completedSigns')
                        : t('other.waitingForSigns')
                    }
                    backgroundColor={backgroundColor}
                    foregroundColor={foregroundColor}
                  />
                }
              />
            );
          }}
        />
        </OverviewList>
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
