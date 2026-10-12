import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { PillButton, Text, useTheme } from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ServiceStackParamList } from '../../services/components/ServicesNavigator';

type Props = {
  onPress?: () => void;
};

export const BookingSlotsStatusLegend = ({ onPress }: Props) => {
  const { t } = useTranslation();
  const { spacing } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<ServiceStackParamList>>();

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
