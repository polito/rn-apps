import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';

import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Icon } from '../../ui/components/Icon';
import { useTheme } from '../../ui/hooks/useTheme';

export const HeaderCloseButton = () => {
  const { t } = useTranslation();
  const { spacing } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <Pressable
      onPress={navigation.goBack}
      accessibilityLabel={t('common.close')}
      accessibilityRole="button"
      style={{ padding: spacing['2'] }}
    >
      <Icon icon={faTimes} size={24} />
    </Pressable>
  );
};
