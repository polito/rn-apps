import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Text, useTheme } from '@polito/lib/ui';

export const StudentsHomeScreen = () => {
  const { palettes } = useTheme();
  const { t } = useTranslation();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: palettes.gray?.[100] ?? 'transparent',
      }}
    >
      <Text variant="heading">
        {t('other.students', { defaultValue: 'Students' })}
      </Text>
    </View>
  );
};
