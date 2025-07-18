import {useEffect, useLayoutEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View, Image, ScrollView, StyleSheet} from 'react-native';
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
  faBell,
  faBullhorn,
  faCircleExclamation,
  faFileSignature,
  faPenToSquare,
  faVideo,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import {
  faBookBookmark,
  faBriefcase,
  faClipboardQuestion,
  faComments,
  faEnvelope,
  faIdCard,
  faMobileScreenButton,
  faNewspaper,
  faPersonCirclePlus,
  faSignsPost,
} from '@fortawesome/free-solid-svg-icons';
import {UnreadBadge} from '../../ui/components/UnreadBadge';
import {Grid, auto} from '../../ui/components/Grid';
import {ServiceCard} from './ServiceCard';
import {Platform} from 'react-native';

export const ServiceScreen = () => {
const { t, i18n } = useTranslation();
  const {spacing, colors} = useTheme();
  const navigation = useNavigation();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const styles = useStylesheet(createStyles);
  const {setOptions} = useNavigation();
  const {fontSizes} = useTheme();
  const {services, updateServicePref} = useCourses();
useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
      navigation.navigate('Didattica');
    });
  
    return unsubscribe; 
  }, [navigation]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <Logo />,
      headerTitle: () => (
        <Text
          variant="heading"
          style={{
            textAlign: 'center',
            width: '100%',
            marginLeft: Platform.OS === 'android' ? -35 : -80,
          }}>
          {t('other.services')}
        </Text>
      ),
    });
  }, [navigation, colors]);

  const updateFavorite = (id: string, favorite: boolean) => {
    updateServicePref(id, favorite);
  };

  const preferredServices = services.filter(s => s.favorite);
  const notPreferredServices = services.filter(s => !s.favorite);

  return (
    <ScrollView
      style={{flex: 1}}
      contentContainerStyle={bottomBarAwareStyles}
      contentInsetAdjustmentBehavior="automatic"
      bounces={false}>
        {preferredServices.length > 0 && (
          <Grid
            numColumns={2}
            minColumnWidth={ServiceCard.minWidth}
            maxColumnWidth={ServiceCard.maxWidth}
            gap={4}
            style={styles.grid}>
            {preferredServices.map(service => (
              <ServiceCard
                key={service.id}
                name={service.name}
                icon={service.icon}
                linkTo={service.linkTo}
                favorite={service.favorite}
                onFavoriteChange={fav => updateFavorite(service.id, fav)}
              />
            ))}
          </Grid>
        )}
        {notPreferredServices.length > 0 && (
          <Grid
            numColumns={2}
            minColumnWidth={ServiceCard.minWidth}
            maxColumnWidth={ServiceCard.maxWidth}
            gap={4}
            style={styles.grid}>
            {notPreferredServices.map(service => (
              <ServiceCard
                key={service.id}
                name={service.name}
                icon={service.icon}
                linkTo={service.linkTo}
                favorite={service.favorite}
                onFavoriteChange={fav => updateFavorite(service.id, fav)}
              />
            ))}
          </Grid>
        )}
    </ScrollView>
  );
};

const createStyles = ({colors, spacing}: Theme) =>
  StyleSheet.create({
    heading: {
      paddingTop: spacing[5],
      paddingHorizontal: spacing[2],
    },
    smartcardImage: {
      width: '100%',
      height: 200,
      marginVertical: spacing[3],
      alignSelf: 'center',
    },
    grid: {
      margin: spacing[5],
    },
  });
