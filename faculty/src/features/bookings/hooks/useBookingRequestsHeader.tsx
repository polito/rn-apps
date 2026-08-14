import { useLayoutEffect } from 'react';
import { Platform, StyleSheet } from 'react-native';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import {
  IconButton,
  Text,
  Theme,
  useStylesheet,
} from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ProfileStackParamList } from '../../../screens/Servizi/ServiceNavigator';

export const useBookingRequestsHeader = (title: string) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const styles = useStylesheet(createStyles);

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
        <Text variant="heading" style={styles.headerTitle}>
          {title}
        </Text>
      ),
    });
  }, [navigation, title, styles.headerTitle]);
};

const createStyles = ({ fontFamilies, fontSizes, fontWeights }: Theme) =>
  StyleSheet.create({
    headerTitle: {
      width: '100%',
      textAlign: 'center',
      marginLeft: Platform.select({ android: -25, default: -55 }),
      fontFamily: fontFamilies.heading,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.semibold,
    },
  });
