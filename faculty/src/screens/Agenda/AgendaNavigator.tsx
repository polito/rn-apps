import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';

import { useTheme, useTitlesStyles } from '@polito/lib/ui';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Logo } from '../../core/components/Logo';
import { AgendaScreen } from './AgendaScreen';
import { AgendaWeekScreen } from './AgendaWeekScreen';
import { LectureScreen } from './LectureScreen';
import { NoteForm } from './NoteForm';
import { SingleElementScreen } from './SingleElementScreen';

export type AgendaStackParamList = {
  Agenda2: undefined;
  Lezione: undefined;
  AgendaWeek: undefined;
  Form: undefined;
  SingleElement: undefined;
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
          headerTitle: t('common.lecture'),
        }}
      />

      <Stack.Screen name="Form" component={NoteForm} />

      <Stack.Screen
        name="SingleElement"
        component={SingleElementScreen}
        options={{
          headerTitle: t('common.lecture'),
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};
