import {useTranslation} from 'react-i18next';
import {
  Animated,
  Platform,
  StyleProp,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {useTheme} from '../../ui/hooks/useTheme';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {AgendaScreen} from './AgendaScreen';
import {LectureScreen} from './LectureScreen';
import {titlesStyles} from '../../core/hooks/titlesStyles';
import {Logo} from '../../core/components/Logo';
import {AgendaWeekScreen} from './AgendaWeekScreen';
import {useNavigation} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {useTitlesStyles} from '../../core/hooks/useTitleStyles';
import {NoteForm} from './NoteFrom';
import {SingleElementScreen} from './SingleElementScreen';
import {Text} from '../../ui/components/Text';

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
      style={{paddingHorizontal: 10}}>
      <FontAwesomeIcon icon={faArrowLeft} size={22} color="black" />
    </TouchableOpacity>
  );
};

const Stack = createNativeStackNavigator<AgendaStackParamList>();

export const AgendaNavigator = () => {
  const {t} = useTranslation();
  const theme = useTheme();
  const {colors} = theme;
  const tabBarStyle: any = {
    position: Platform.select({ios: 'absolute'}),
  };
  if (Platform.OS === 'ios') {
    tabBarStyle.height = 84;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerLargeTitle: false,
        headerTransparent: Platform.select({ios: false}),
        headerLargeStyle: {
          backgroundColor: colors.background,
        },
        ...useTitlesStyles(theme),
      }}>
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
              style={{textAlign: 'center', width: '100%', marginLeft: -20}}>
              Lezione
            </Text>
          ),
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};
