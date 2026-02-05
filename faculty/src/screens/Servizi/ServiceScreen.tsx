import { useEffect, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet } from 'react-native';
import { Platform } from 'react-native';

import {
  Grid,
  Text,
  Theme,
  useBottomBarAwareStyles,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';

import { Logo } from '../../core/components/Logo';
import { RootParamList } from '../../core/components/RootNavigator';
import { useCourses } from '../../core/contexts/CoursesContext';
import { ServiceCard } from './ServiceCard';

export const ServiceScreen = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<BottomTabNavigationProp<RootParamList>>();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const styles = useStylesheet(createStyles);
  const { services, updateServicePref } = useCourses();
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      e.preventDefault();
      navigation.navigate({
        name: 'Didattica',
        params: { screen: 'Incarichi' },
        merge: true,
      });
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
          }}
        >
          {t('other.services')}
        </Text>
      ),
    });
  }, [navigation, colors, t]);

  const updateFavorite = (id: string, favorite: boolean) => {
    updateServicePref(id, favorite);
  };

  const preferredServices = services.filter(s => s.favorite);
  const notPreferredServices = services.filter(s => !s.favorite);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={bottomBarAwareStyles}
      contentInsetAdjustmentBehavior="automatic"
      bounces={false}
    >
      {preferredServices.length > 0 && (
        <Grid
          numColumns={2}
          minColumnWidth={ServiceCard.minWidth}
          maxColumnWidth={ServiceCard.maxWidth}
          gap={4}
          style={styles.grid}
        >
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
          style={styles.grid}
        >
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

const createStyles = ({ spacing }: Theme) =>
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
