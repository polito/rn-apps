import { Platform } from 'react-native';

import { useTheme, useTitlesStyles } from '@polito/lib/ui';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ProfileForm } from './ProfileForm';
import { ProfileScreen } from './ProfileScreen';
import { SettingsScreen } from './SettingsScreen';

export type ProfileStackParamList = {
  Profilo: undefined;
  Form: undefined;
  ProfileForm: undefined;
  Impostazioni: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileNavigator = () => {
  const theme = useTheme();
  const { colors } = theme;

  return (
    <Stack.Navigator
      screenOptions={{
        headerLargeTitle: false,
        headerTransparent: Platform.select({ ios: false }),
        headerLargeStyle: {
          backgroundColor: colors.background,
        },
        ...useTitlesStyles(theme),
      }}
    >
      <Stack.Screen name="Profilo" component={ProfileScreen} />
      <Stack.Screen
        name="ProfileForm"
        component={ProfileForm}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Impostazioni"
        component={SettingsScreen}
        options={{
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};
