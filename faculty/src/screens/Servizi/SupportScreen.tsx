import { useEffect, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Platform } from 'react-native';

import { faArrowLeft, faPhone } from '@fortawesome/free-solid-svg-icons';
import {
  CtaButton,
  IconButton,
  Text,
  useBottomBarAwareStyles,
  useSafeAreaSpacing,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ProfileStackParamList } from './ServiceNavigator';

export const SupportScreen = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const styles = useStylesheet(createStyles);
  const { paddingHorizontal } = useSafeAreaSpacing();

  const supportContacts = [
    {
      id: '1',
      title: '3356412988',
      icon: faPhone,
      onPress: () => {},
    },
  ];
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
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
          }}
        >
          {t('other.audiovideoSupport')}
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
      <View style={[styles.centeredContainer, paddingHorizontal]}>
        <Text variant="heading" style={{ padding: 10, textAlign: 'center' }}>
          {t('other.avtext1')}
        </Text>
        <Text style={{ padding: 10, textAlign: 'center' }}>
          {t('other.avtext2')}
        </Text>
        <Text style={{ padding: 10, textAlign: 'center' }}>8:30/20:00</Text>
        <Text style={{ padding: 10, textAlign: 'center' }}>
          {t('other.avtext3')}
        </Text>
        <Text variant="heading" style={{ padding: 10, textAlign: 'center' }}>
          {t('other.avtext4')}
        </Text>
        <Text style={{ padding: 10, textAlign: 'center' }}>
          {t('other.avtext5')}
        </Text>

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

const createStyles = () =>
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
