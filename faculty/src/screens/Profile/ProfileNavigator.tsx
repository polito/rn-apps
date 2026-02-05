import { Platform, TouchableOpacity } from 'react-native';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useTheme, useTitlesStyles } from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
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

const CustomBackButton2 = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.goBack(); // Altrimenti torna alla schermata "Courses"
      }}
      style={{ paddingHorizontal: 10 }}
    >
      <FontAwesomeIcon icon={faArrowLeft} size={22} color="black" />
    </TouchableOpacity>
  );
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
          headerLeft: () => <CustomBackButton2 />,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Impostazioni"
        component={SettingsScreen}
        options={{
          headerLeft: () => <CustomBackButton2 />,
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};
