import { useLayoutEffect } from 'react';
import { Text } from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { defaultUsefulContactsContent } from '../data/defaultUsefulContacts';
import { PeopleStackParamList } from '../types';
import { StaticContactScreenContent } from './StaticContactScreenContent';

export const UsefulContactScreen = () => {
  const route = useRoute();
  const navigation =
    useNavigation<NativeStackNavigationProp<PeopleStackParamList>>();
  const params = (route.params ?? {}) as { id?: string };
  const detail = params.id ? defaultUsefulContactsContent[params.id] : null;

  useLayoutEffect(() => {
    if (detail) {
      navigation.setOptions({ title: detail.title });
    }
  }, [detail, navigation]);

  if (!detail) {
    return <Text>{params.id}</Text>;
  }

  return <StaticContactScreenContent detail={detail} />;
};
