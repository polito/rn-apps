import {useTranslation} from 'react-i18next';
import {
  Animated,
  Platform,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {useTheme} from '../../ui/hooks/useTheme';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ExamScreen} from '../ExamScreen';
import {ExamsScreen} from '../ExamsScreen';
import {GradesScreen} from '../GradesScreen';
import {HomeScreen} from '../HomeScreen';
import {EmptyScreen} from '../EmptyScreen';
import React, {useRef, useState} from 'react';
import TranslucentView from '../../core/components/TranslucentView';
import {getHeaderTitle} from '@react-navigation/elements';
import {Header} from '../../core/components/Header';
import {Logo} from '../../core/components/Logo';
import {titlesStyles} from '../../core/hooks/titlesStyles';
import {useTitlesStyles} from '../../core/hooks/useTitleStyles';
import {useNavigation} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faArrowLeft,
  faBell,
  faEllipsisV,
  faPenToSquare,
  faSliders,
} from '@fortawesome/free-solid-svg-icons';
import Popover from 'react-native-popover-view';
import {Text} from '../../ui/components/Text';
import {useCourses} from '../../core/contexts/CoursesContext';
import {ProfileScreen} from './ProfileScreen';
import {IconButton} from '../../ui/components/IconButton';
import {Row} from '../../ui/components/Row';
import {ProfileForm} from './ProfileForm';
import { SettingsScreen } from './SettingsScreen';

export type ProfileStackParamList = {
  Profilo: undefined;
  Form: undefined;
  Profile_form: undefined;
  Impostazioni : undefined;
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

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileNavigator = () => {
  const {t} = useTranslation();
  const theme = useTheme();
  const {colors, fontSizes, spacing} = theme;
  const navigation = useNavigation();

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
      <Stack.Screen name="Profilo" component={ProfileScreen} />
      <Stack.Screen
        name="Profile_form"
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

const styles = StyleSheet.create({
  menuItem: {
    padding: 10,
    fontSize: 16,
  },
});
