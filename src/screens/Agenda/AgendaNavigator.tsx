import { useTranslation } from 'react-i18next';
import { Platform, TouchableOpacity } from 'react-native';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Logo } from '../../core/components/Logo';
import { useTitlesStyles } from '../../core/hooks/useTitleStyles';
import { Text } from '../../ui/components/Text';
import { useTheme } from '../../ui/hooks/useTheme';
import { AgendaScreen } from './AgendaScreen';
import { AgendaWeekScreen } from './AgendaWeekScreen';
import { LectureScreen } from './LectureScreen';
import { NoteForm } from './NoteFrom';
import { SingleElementScreen } from './SingleElementScreen';

export type AgendaStackParamList = {
  Agenda2: undefined;
  Lezione: undefined;
  AgendaWeek: undefined;
  Form: undefined;
  SingleElement: undefined;
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

const Stack = createNativeStackNavigator<AgendaStackParamList>();

export const AgendaNavigator = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { colors } = theme;
  const tabBarStyle: any = {
    position: Platform.select({ ios: 'absolute' }),
  };
  if (Platform.OS === 'ios') {
    tabBarStyle.height = 84;
  }

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
      <Stack.Screen
        name="Agenda2"
        component={AgendaScreen}
        options={{
          headerLargeTitle: false,
          headerLeft: () => <Logo />,
          headerTitle: t('Agenda'),
          headerTransparent: false,
          headerShadowVisible: false,
        }}
      />

      <Stack.Screen
        name="AgendaWeek"
        component={AgendaWeekScreen}
        options={{
          headerLargeTitle: false,
          headerLeft: () => <Logo />,
          headerTitle: t('Agenda'),
          headerTransparent: false,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="Lezione"
        component={LectureScreen}
        options={{
          headerTitle: 'Lezione',
        }}
      />

      <Stack.Screen name="Form" component={NoteForm} />

      <Stack.Screen
        name="SingleElement"
        component={SingleElementScreen}
        options={{
          headerLeft: () => <CustomBackButton2 />,
          headerTitle: () => (
            <Text
              variant="heading"
              style={{ textAlign: 'center', width: '100%', marginLeft: -20 }}
            >
              Lezione
            </Text>
          ),
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};
