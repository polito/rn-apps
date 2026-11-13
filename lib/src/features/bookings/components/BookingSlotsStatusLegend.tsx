import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { PillButton, Text, useTheme } from '../../../ui';
import { BookingsStackParamList } from '../types';

type Props = {
  onPress?: () => void;
};

export const BookingSlotsStatusLegend = ({ onPress }: Props) => {
  const { t } = useTranslation();
  const { spacing } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<BookingsStackParamList>>();

  return (
    <PillButton
      variant="neutral"
      accessibilityLabel={t('common.legend')}
      onPress={onPress ?? (() => navigation.navigate('BookingSlotsLegend'))}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: spacing[2],
          alignItems: 'center',
        }}
      >
        <Text key="events">{t('common.legend')}</Text>
      </View>
    </PillButton>
  );
};
